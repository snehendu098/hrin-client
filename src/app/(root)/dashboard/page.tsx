"use client";

import GridInfoCard, {
  GridInfoCardProps,
} from "@/components/cards/grid-info-card";
import PageLayout from "@/components/page-layouts";
import {
  getCollateralStatus,
  getLendEarnings,
  getUserLoans,
} from "@/lib/actions/user.action";
import { UserLoansResponse } from "@/types/api";
import { useEffect, useState } from "react";

const info: GridInfoCardProps[] = [
  { title: "Locked USDT", value: "$ 500,000", imageNum: 1 },
  { title: "Borrow APY", value: "7%", imageNum: 2 },
  { title: "Lend APY", value: "5%", imageNum: 3 },
];

export default function Dashboard() {
  const [response, setResponse] = useState();
  const [loading, setLoading] = useState<boolean>();

  const fetchData = async () => {
    try {
      setLoading(true);

      const lendEarnings = await getLendEarnings(
        "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE"
      );
      const userLoans = await getUserLoans(
        "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE"
      );
      const collateralStatus = await getCollateralStatus(
        "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE"
      );

      console.log({
        lendEarnings: lendEarnings.data,
        userLoans: userLoans.data,
        collateralStatus: collateralStatus.data,
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageLayout text="Dashboard">
      <div className="w-full space-y-8">
        {/* Top Section - 3 Column Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Total Portfolio Value */}
          {info.map((item, index) => (
            <GridInfoCard
              key={index}
              title={item.title}
              value={item.value}
              imageNum={item.imageNum}
            />
          ))}

          {/* Active Loans */}

          {/* Available Liquidity */}
        </div>

        {/* Bottom Section - 5 Column Grid with Spans */}
        <div className="grid grid-cols-5 gap-6">
          {/* Loan Activity Overview - Spans 3 columns */}
          <div className="col-span-3">
            <div className="p-6 bg-neutral-900 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">Loan Activity</h3>
            </div>
          </div>

          {/* Collateral & Earnings Summary - Spans 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Collateral Status */}
            <div className="bg-neutral-900 rounded-lg border shadow-sm p-6"></div>

            {/* Lend Earnings */}
            <div className="bg-neutral-900 rounded-lg border shadow-sm p-6"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
