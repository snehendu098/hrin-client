"use client";

import GridInfoCard, {
  GridInfoCardProps,
} from "@/components/cards/grid-info-card";
import { InfoTable } from "@/components/cards/tables";
import PageLayout from "@/components/page-layouts";
import { getPoolStatus } from "@/lib/actions/pool.action";
import { PoolStatusData } from "@/types/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [response, setResponse] = useState<PoolStatusData>();
  const [loading, setLoading] = useState<boolean>(false);
  const [gridInfo, setGridInfo] = useState<GridInfoCardProps[]>([
    { title: "Pool USDT", value: "Loading", imageNum: 1 },
    { title: "Borrow APY", value: "7%", imageNum: 2 },
    { title: "Lend APY", value: "5%", imageNum: 3 },
  ]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getPoolStatus();

      if (res.success && res.data != undefined) {
        console.log(res.data);
        setResponse(res.data);
        setGridInfo((prev) => [
          {
            ...prev[0],
            value: `$ ${res.data?.summary.availableUSD.toLocaleString()}`,
          },
          ...prev.slice(1),
        ]);
      }
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
    <PageLayout text="Market">
      {!loading ? (
        <div className="grid grid-cols-3 gap-6">
          {gridInfo.map((item, index) => (
            <GridInfoCard
              key={index}
              title={item.title}
              value={item.value}
              imageNum={item.imageNum}
            />
          ))}
          <div className="col-span-3">
            {response?.pools && <InfoTable poolData={response?.pools} />}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </PageLayout>
  );
}
