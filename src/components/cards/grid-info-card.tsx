import Image from "next/image";
import React from "react";

export interface GridInfoCardProps {
  title: string;
  value: string;
  imageNum: 1 | 2 | 3;
}

const GridInfoCard = ({ title, value, imageNum }: GridInfoCardProps) => {
  return (
    <div className="w-full p-6 border px-8 bg-neutral-900 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <p className="text-sm text-white/60">{title}</p>
          <p className="text-2xl text-white/90 font-semibold mt-2">{value}</p>
        </div>
        <Image src={`/${imageNum}.png`} alt="img" height={60} width={80} />
      </div>
    </div>
  );
};

export default GridInfoCard;
