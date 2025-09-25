"use client";

import GridInfoCard, {
  GridInfoCardProps,
} from "@/components/cards/grid-info-card";
import PageLayout from "@/components/page-layouts";
import { getDashboardData } from "@/lib/actions/dashboard.action";
import { DashboardUserData } from "@/types/api";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardUserData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [gridInfo, setGridInfo] = useState<GridInfoCardProps[]>([
    { title: "Total Lent", value: "Loading...", imageNum: 1 },
    { title: "Total Collateral", value: "Loading...", imageNum: 2 },
    { title: "Projected Earnings", value: "Loading...", imageNum: 3 },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Using a hardcoded address for demo - in real app this would come from wallet connection
      const address = "0xf1D3B710896e0df00833Ae05d195F722A3D84EAE";
      const res = await getDashboardData(address);

      if (res.success && res.data) {
        console.log("Dashboard data:", res.data);
        setDashboardData(res.data);

        // Update grid cards with actual data
        setGridInfo([
          {
            title: "Total Lent",
            value: `$${res.data.summary.totalLentUSD.toLocaleString()}`,
            imageNum: 1,
          },
          {
            title: "Total Collateral",
            value: `$${res.data.summary.totalCollateralUSD.toLocaleString()}`,
            imageNum: 2,
          },
          {
            title: "Projected Earnings",
            value: `$${res.data.summary.totalProjectedEarningsUSD.toLocaleString()}`,
            imageNum: 3,
          },
        ]);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PageLayout text="Dashboard">
      {!loading ? (
        <div className="w-full space-y-8">
          {/* Top Section - 3 Column Grid */}
          <div className="grid grid-cols-3 gap-6">
            {gridInfo.map((item, index) => (
              <GridInfoCard
                key={index}
                title={item.title}
                value={item.value}
                imageNum={item.imageNum}
              />
            ))}
          </div>

          {/* Bottom Section - 5 Column Grid with Spans */}
          <div className="grid grid-cols-5 gap-6">
            {/* Records Overview - Spans 3 columns */}
            <div className="col-span-3">
              <div className="p-6 bg-neutral-900 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4">
                  Transaction Records
                </h3>
                {dashboardData && (
                  <div className="space-y-4">
                    {/* Lent Records */}
                    <div>
                      <h4 className="text-lg font-medium mb-2">Lent Funds</h4>
                      {dashboardData.records.lentRecords.length > 0 ? (
                        <div className="space-y-2">
                          {dashboardData.records.lentRecords.map(
                            (record, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-3 bg-neutral-800/90 border rounded-md"
                              >
                                <div className="flex items-center space-x-2">
                                  <Image
                                    src={
                                      record.asset.toLowerCase().trim() ===
                                      "eth"
                                        ? "/eth.svg"
                                        : "/near.svg"
                                    }
                                    alt={record.asset}
                                    height={30}
                                    width={30}
                                  />

                                  <div className="font-semibold">
                                    {record.amount.toFixed(2)}
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <p className="font-semibold ">
                                    ${record.usdValue.toLocaleString()}
                                  </p>
                                  <p className="text-primary">
                                    + $ {record.projectedEarnings.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">No lent funds</p>
                      )}
                    </div>

                    {/* Borrow Records */}
                    <div>
                      <h4 className="text-lg font-medium mb-2">
                        Borrowed Funds
                      </h4>
                      {dashboardData.records.borrowRecords.length > 0 ? (
                        <div className="space-y-2">
                          {dashboardData.records.borrowRecords.map(
                            (record, index) => (
                              <div
                                key={index}
                                className="flex justify-between p-4 bg-neutral-800 rounded-lg border"
                              >
                                <div className="flex items-center space-x-2">
                                  <Image
                                    src={
                                      record.asset.toLowerCase() === "eth"
                                        ? "/eth.svg"
                                        : "/near.svg"
                                    }
                                    alt={record.asset}
                                    width={30}
                                    height={30}
                                  />
                                  <span className="text-md font-semibold">
                                    {record.amount.toFixed(2)}
                                  </span>
                                </div>
                                <span>${record.usdValue.toLocaleString()}</span>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400">No borrowed funds</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Collateral Summary - Spans 2 columns */}
            <div className="col-span-2 space-y-6">
              {/* Collateral Status */}
              <div className="bg-neutral-900 rounded-lg border shadow-sm p-6">
                <h4 className="text-lg font-medium mb-4">Collateral Status</h4>
                {dashboardData && (
                  <div className="space-y-2">
                    {dashboardData.records.collateralRecords.length > 0 ? (
                      dashboardData.records.collateralRecords.map(
                        (record, index) => (
                          <div
                            key={index}
                            className="flex justify-between p-4 border bg-neutral-800 rounded-lg"
                          >
                            <div>
                              <div className="flex items-center space-x-2">
                                <Image
                                  src={
                                    record.asset.toLowerCase() === "eth"
                                      ? "/eth.svg"
                                      : "/near.svg"
                                  }
                                  alt={record.asset}
                                  width={16}
                                  height={16}
                                />
                                <span>{record.amount.toFixed(4)}</span>
                              </div>
                              <div className="text-sm text-gray-400">
                                {record.locked ? "Locked" : "Available"}
                              </div>
                            </div>
                            <div>${record.usdValue.toLocaleString()}</div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-400">No collateral deposits</p>
                    )}
                  </div>
                )}
              </div>

              {/* Price Info */}
              <div className="bg-neutral-900 rounded-lg border shadow-sm p-6">
                <h4 className="text-lg font-medium mb-4">Current Prices</h4>
                {dashboardData && (
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>ETH</span>
                      <span>${dashboardData.prices.eth.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>NEAR</span>
                      <span>${dashboardData.prices.near.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading dashboard data...</p>
      )}
    </PageLayout>
  );
}
