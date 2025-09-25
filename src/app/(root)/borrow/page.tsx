"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import PageLayout from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserLoans, getCollateralStatus } from "@/lib/actions/user.action";
import { LoanSummary, CollateralStatus } from "@/types/api";

export default function Borrow() {
  // Collateral deposit state
  const [collateralTxHash, setCollateralTxHash] = useState<string>("");
  const [collateralChain, setCollateralChain] = useState<"eth" | "near">("eth");
  const [collateralLoading, setCollateralLoading] = useState<boolean>(false);

  // Borrow request state
  const [borrowAmount, setBorrowAmount] = useState<string>("");
  const [borrowChain, setBorrowChain] = useState<"eth" | "near">("eth");
  const [selectedCollateralTxHash, setSelectedCollateralTxHash] =
    useState<string>("");
  const [borrowLoading, setBorrowLoading] = useState<boolean>(false);

  // Repay state
  const [repayLoanId, setRepayLoanId] = useState<string>("");
  const [repayTxHash, setRepayTxHash] = useState<string>("");
  const [repayChain, setRepayChain] = useState<"eth" | "near">("eth");
  const [repayLoading, setRepayLoading] = useState<boolean>(false);

  // Data state
  const [userLoans, setUserLoans] = useState<LoanSummary[]>([]);
  const [availableCollateral, setAvailableCollateral] = useState<
    CollateralStatus[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const address = "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE";

      // Fetch user loans and collateral status
      const loansRes = await getUserLoans(address);
      const collateralRes = await getCollateralStatus(address);

      if (loansRes.success && loansRes.data) {
        setUserLoans(loansRes.data.loans);
      }

      if (collateralRes.success && collateralRes.data) {
        // Filter available (unlocked) collateral for borrowing
        const available = collateralRes.data.collaterals.filter(
          (c) => !c.isLocked
        );
        setAvailableCollateral(available);
      }
    } catch (err) {
      console.error("Error fetching borrow data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCollateralDeposit = async () => {
    if (!collateralTxHash) {
      alert("Please enter collateral transaction hash");
      return;
    }

    try {
      setCollateralLoading(true);

      const response = await fetch("http://localhost:8080/collateral/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: collateralTxHash,
          chain: collateralChain,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Collateral deposited! Amount: ${
            result.data.amount
          } ${result.data.chain.toUpperCase()}`
        );
        await fetchData(); // Refresh data
        setCollateralTxHash("");
      } else {
        alert(`Collateral deposit failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Collateral deposit error:", err);
      alert("Collateral deposit failed: Network error");
    } finally {
      setCollateralLoading(false);
    }
  };

  const handleBorrowRequest = async () => {
    if (!borrowAmount || !selectedCollateralTxHash) {
      alert("Please enter borrow amount and select collateral");
      return;
    }

    try {
      setBorrowLoading(true);

      const response = await fetch("http://localhost:8080/borrow/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          borrower: "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE",
          collateralTxHash: selectedCollateralTxHash,
          borrowChain: borrowChain,
          borrowAmount: parseFloat(borrowAmount),
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Loan created! Loan ID: ${result.data.loanId}`);
        await fetchData(); // Refresh data
        setBorrowAmount("");
        setSelectedCollateralTxHash("");
      } else {
        alert(`Borrow request failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Borrow request error:", err);
      alert("Borrow request failed: Network error");
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleRepay = async () => {
    if (!repayLoanId || !repayTxHash) {
      alert("Please enter loan ID and repayment transaction hash");
      return;
    }

    try {
      setRepayLoading(true);

      const response = await fetch("http://localhost:8080/borrow/repay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId: repayLoanId,
          repaymentTxHash: repayTxHash,
          repaymentChain: repayChain,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Loan repaid successfully! Loan ID: ${result.data.loanId}`);
        await fetchData(); // Refresh data
        setRepayLoanId("");
        setRepayTxHash("");
      } else {
        alert(`Repayment failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Repay error:", err);
      alert("Repayment failed: Network error");
    } finally {
      setRepayLoading(false);
    }
  };

  return (
    <PageLayout text="Borrow">
      <div className="w-full space-y-6">
        {/* Top Section - 3 Column Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Collateral Deposit */}
          <div className="bg-neutral-800 rounded-lg border p-6">
            <p className="text-xl font-semibold mb-4">Deposit Collateral</p>
            <div className="flex flex-col space-y-4">
              <div>
                <Label className="text-muted-foreground">Chain</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={collateralChain === "eth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCollateralChain("eth")}
                  >
                    <Image
                      src="/eth.svg"
                      alt="ETH"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    ETH
                  </Button>
                  <Button
                    variant={collateralChain === "near" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCollateralChain("near")}
                  >
                    <Image
                      src="/near.svg"
                      alt="NEAR"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    NEAR
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Transaction Hash
                </Label>
                <Input
                  placeholder="Enter transaction hash"
                  value={collateralTxHash}
                  onChange={(e) => setCollateralTxHash(e.target.value)}
                />
              </div>

              <Button
                className="text-md font-semibold"
                onClick={handleCollateralDeposit}
                disabled={collateralLoading || !collateralTxHash}
              >
                {collateralLoading ? "Processing..." : "Deposit Collateral"}
              </Button>
            </div>
          </div>

          {/* Borrow Request */}
          <div className="bg-neutral-800 rounded-lg border p-6">
            <p className="text-xl font-semibold mb-4">Borrow Funds</p>
            <div className="flex flex-col space-y-4">
              <div>
                <Label className="text-muted-foreground">Borrow Chain</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={borrowChain === "eth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBorrowChain("eth")}
                  >
                    <Image
                      src="/eth.svg"
                      alt="ETH"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    ETH
                  </Button>
                  <Button
                    variant={borrowChain === "near" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBorrowChain("near")}
                  >
                    <Image
                      src="/near.svg"
                      alt="NEAR"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    NEAR
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Amount</Label>
                <Input
                  placeholder="Enter amount to borrow"
                  value={borrowAmount}
                  onChange={(e) => setBorrowAmount(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Collateral</Label>
                <Select
                  value={selectedCollateralTxHash}
                  onValueChange={setSelectedCollateralTxHash}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select collateral" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCollateral.map((collateral, index) => (
                      <SelectItem key={index} value={collateral.txHash}>
                        <div className="flex items-center space-x-2">
                          <Image
                            src={
                              collateral.chain.toLowerCase() === "eth"
                                ? "/eth.svg"
                                : "/near.svg"
                            }
                            alt={collateral.chain}
                            width={16}
                            height={16}
                          />
                          <span>
                            {collateral.amount.toFixed(4)}{" "}
                            {collateral.chain.toUpperCase()}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="text-md font-semibold"
                onClick={handleBorrowRequest}
                disabled={
                  borrowLoading || !borrowAmount || !selectedCollateralTxHash
                }
              >
                {borrowLoading ? "Processing..." : "Borrow"}
              </Button>
            </div>
          </div>

          {/* Repay Loan */}
          <div className="bg-neutral-800 rounded-lg border p-6">
            <p className="text-xl font-semibold mb-4">Repay Loan</p>
            <div className="flex flex-col space-y-4">
              <div>
                <Label className="text-muted-foreground">Repay Chain</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={repayChain === "eth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRepayChain("eth")}
                  >
                    <Image
                      src="/eth.svg"
                      alt="ETH"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    ETH
                  </Button>
                  <Button
                    variant={repayChain === "near" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRepayChain("near")}
                  >
                    <Image
                      src="/near.svg"
                      alt="NEAR"
                      width={16}
                      height={16}
                      className="mr-1"
                    />
                    NEAR
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Loan ID</Label>
                <Select value={repayLoanId} onValueChange={setRepayLoanId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select active loan" />
                  </SelectTrigger>
                  <SelectContent>
                    {userLoans
                      .filter((loan) => loan.status === "active")
                      .map((loan) => (
                        <SelectItem key={loan.loanId} value={loan.loanId}>
                          <div className="flex items-center space-x-2">
                            <Image
                              src={
                                loan.borrowChain.toLowerCase() === "eth"
                                  ? "/eth.svg"
                                  : "/near.svg"
                              }
                              alt={loan.borrowChain}
                              width={16}
                              height={16}
                            />
                            <span>
                              {loan.loanId.substring(0, 8)}... -{" "}
                              {loan.borrowAmount}{" "}
                              {loan.borrowChain.toUpperCase()}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Repayment Tx Hash
                </Label>
                <Input
                  placeholder="Enter repayment tx hash"
                  value={repayTxHash}
                  onChange={(e) => setRepayTxHash(e.target.value)}
                />
              </div>

              <Button
                className="text-md font-semibold"
                onClick={handleRepay}
                disabled={repayLoading || !repayLoanId || !repayTxHash}
              >
                {repayLoading ? "Processing..." : "Repay"}
              </Button>
            </div>
          </div>
        </div>

        {/* Previous Borrows */}
        <div className="bg-neutral-800 rounded-lg border p-6">
          <p className="text-xl font-semibold mb-4">Your Loans</p>
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : userLoans.length > 0 ? (
              userLoans.map((loan, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-neutral-700 rounded-md"
                >
                  <div className="flex items-center space-x-4">
                    <Image
                      src={
                        loan.borrowChain.toLowerCase() === "eth"
                          ? "/eth.svg"
                          : "/near.svg"
                      }
                      alt={loan.borrowChain}
                      height={24}
                      width={24}
                    />
                    <div>
                      <div className="font-medium">
                        Loan ID: {loan.loanId.substring(0, 12)}...
                      </div>
                      <div className="text-sm text-gray-400">
                        Borrowed: {loan.borrowAmount}{" "}
                        {loan.borrowChain.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-400">
                        Collateral: {loan.collateralInfo.amount}{" "}
                        {loan.collateralInfo.chain.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${
                        loan.status === "active"
                          ? "text-yellow-400"
                          : loan.status === "repaid"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {loan.status.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Repay: {loan.totalRepaymentAmount}{" "}
                      {loan.borrowChain.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-400">
                      Due: {new Date(loan.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No loans found</p>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
