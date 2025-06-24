"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "../app/client";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-lg border-b border-gray-200">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo uiterst links */}
          <div className="flex items-center space-x-3">
            <Image
              src="/thirdweb.svg"
              alt="SLNGUNBOX Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold text-gray-800">SLNGUNBOX</h1>
          </div>
          
          {/* Connect Button uiterst rechts */}
          <div className="flex items-center">
            <ConnectButton
              client={client}
              appMetadata={{
                name: "SLNGUNBOX",
                url: "https://SLNGUNBOX.com",
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
