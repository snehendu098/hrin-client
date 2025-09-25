import { PoolChainData } from "@/types/api";
import Image from "next/image";
import React from "react";

interface pools {
  eth: PoolChainData;
  near: PoolChainData;
}

export const InfoTable = ({ poolData }: { poolData: pools }) => {
  return (
    <div className="w-full bg-neutral-900 border rounded-lg p-6">
      <h3 className="text-xl text-white/90 font-semibold mb-6">
        Pool Statistics
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left text-sm text-white/60 font-medium py-3 px-4">
                Token
              </th>
              <th className="text-left text-sm text-white/60 font-medium py-3 px-4">
                Total
              </th>
              <th className="text-left text-sm text-white/60 font-medium py-3 px-4">
                Locked
              </th>
              <th className="text-center text-sm text-white/60 font-medium py-3 px-4">
                Available
              </th>
              <th className="text-right text-sm text-white/60 font-medium py-3 px-4">
                Utilization
              </th>
              <th className="text-right text-sm text-white/60 font-medium py-3 px-4">
                Total USD
              </th>
            </tr>
          </thead>
          <tbody>
            {poolData &&
              Object.keys(poolData).map((item, index) => {
                const pool = poolData[item as "eth" | "near"];

                return (
                  <tr
                    key={index}
                    className={`${
                      index !== Object.keys(poolData).length - 1
                        ? "border-b border-neutral-800"
                        : ""
                    } hover:bg-neutral-800/50 transition-colors`}
                  >
                    <td className="py-4 px-4 flex items-center">
                      <div className="flex space-x-2 items-center">
                        <Image
                          src={item === "eth" ? "/eth.svg" : "/near.svg"}
                          alt="img"
                          height={30}
                          width={30}
                        />
                        <span className="text-white/90 font-medium">
                          {item}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-white/80">{pool.total}</td>
                    <td className="py-4 px-4 text-white/80">{pool.locked}</td>
                    <td className="py-4 px-4 text-white/80 text-center">
                      {pool.available}
                    </td>
                    <td className="py-4 px-4 text-right ">
                      <span className="text-green-400 font-medium">
                        {pool.utilizationRate}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-white/90 font-semibold text-right">
                      {pool.totalUSD}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
