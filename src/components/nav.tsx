"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import Image from "next/image";

const nav = [
  { title: "Market", link: "/" },
  { title: "Dashboard", link: "/dashboard" },
  { title: "Earn", link: "/earn" },
];

function Nav() {
  return (
    <div className="w-full p-4 flex border-b justify-between items-center">
      {/* Name and logo */}
      <div className="flex items-center">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={50}
          height={50}
          className="aspect-square"
        />
        <p className="text-2xl font-semibold">Hrin</p>
      </div>
      {/* Nav Items */}
      <NavigationMenuDemo />
      {/* Connect Button */}
      <div>
        <Button size={"lg"} className="font-semibold">
          Connect Wallet
        </Button>
      </div>
    </div>
  );
}

function NavigationMenuDemo() {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        {nav.map((item, idx) => (
          <NavigationMenuItem key={idx}>
            <NavigationMenuTrigger>
              <Link href={item.link}>{item.title}</Link>
            </NavigationMenuTrigger>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Nav;
