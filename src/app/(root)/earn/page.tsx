"use client";

import { Area, AreaChart, CartesianGrid } from "recharts";
import { useState, useEffect } from "react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import PageLayout from "@/components/page-layouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDashboardData } from "@/lib/actions/dashboard.action";
import { LentRecord } from "@/types/api";

// Dummy chart data for earnings over time
const chartData = [
  { month: "January", earnings: 120 },
  { month: "February", earnings: 245 },
  { month: "March", earnings: 189 },
  { month: "April", earnings: 295 },
  { month: "May", earnings: 378 },
  { month: "June", earnings: 420 },
];

const chartConfig = {
  earnings: {
    label: "Earnings ($)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export default function Earn() {
  const [selectedChain, setSelectedChain] = useState<"eth" | "near">("eth");
  const [txHash, setTxHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [lendRecords, setLendRecords] = useState<LentRecord[]>([]);

  const fetchLendRecords = async () => {
    try {
      setLoading(true);
      // Using hardcoded address for demo - in real app this would come from wallet
      const address = "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE";
      const res = await getDashboardData(address);

      if (res.success && res.data) {
        setLendRecords(res.data.records.lentRecords);
      }
    } catch (err) {
      console.error("Error fetching lend records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLendRecords();
  }, []);

  const handleDeposit = async () => {
    if (!txHash) {
      alert("Please enter transaction hash");
      return;
    }

    try {
      setLoading(true);

      // Call the lend deposit endpoint
      const response = await fetch("http://localhost:8080/lend/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: txHash,
          chain: "eth",
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          `Deposit successful! Amount: ${
            result.data.amount
          } ${result.data.chain.toUpperCase()}`
        );

        // Refresh lend records after successful deposit
        await fetchLendRecords();

        // Clear form
        setTxHash("");
      } else {
        alert(`Deposit failed: ${result.message}`);
      }
    } catch (err) {
      console.error("Deposit error:", err);
      alert("Deposit failed: Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout text="Earnings">
      <div className="w-full grid grid-cols-3 gap-6">
        {/* Deposit Section */}
        <div className="col-span-1 w-full space-y-6">
          <div className="bg-neutral-800 rounded-lg border p-6">
            <p className="text-xl font-semibold mb-4">Deposit Funds</p>
            <div className="flex flex-col space-y-4">
              <div>
                <Label className="text-muted-foreground">Chain</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={selectedChain === "eth" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChain("eth")}
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
                    variant={selectedChain === "near" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedChain("near")}
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
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                />
              </div>

              <Button
                className="text-md font-semibold"
                onClick={handleDeposit}
                disabled={loading || !txHash}
              >
                {loading ? "Processing..." : "Deposit"}
              </Button>
            </div>
          </div>

          {/* Lend Records */}
          <div className="bg-neutral-800 rounded-lg border p-6">
            <p className="text-xl font-semibold mb-4">Your Lend Records</p>
            <div className="space-y-3">
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : lendRecords.length > 0 ? (
                lendRecords.map((record, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-neutral-700 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={
                          record.asset.toLowerCase().trim() === "eth"
                            ? "/eth.svg"
                            : "/near.svg"
                        }
                        alt={record.asset}
                        height={20}
                        width={20}
                      />
                      <div>
                        <div className="font-medium">
                          {record.amount.toFixed(4)} {record.asset}
                        </div>
                        <div className="text-sm text-gray-400">
                          ${record.usdValue.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-medium">
                        +${record.projectedEarnings.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-400">projected</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No lend records found</p>
              )}
            </div>
          </div>
        </div>

        {/* Earnings Chart Section */}
        <div className="col-span-2">
          <Card className="bg-neutral-800 border">
            <CardHeader>
              <CardTitle>Earnings Overview</CardTitle>
              <CardDescription>
                Your lending earnings progression over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="line" />}
                  />
                  <Area
                    dataKey="earnings"
                    type="natural"
                    fill="var(--primary)"
                    fillOpacity={0.4}
                    stroke="var(--primary)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
