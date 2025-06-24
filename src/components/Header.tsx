"use client";

import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import { client } from "../app/client";

export default function Header() {
  // Check if we have a valid client ID
  const hasValidClient = process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID || process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

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
            {hasValidClient ? (
              <ConnectButton
                client={client}
                appMetadata={{
                  name: "SLNGUNBOX",
                  url: "https://SLNGUNBOX.com",
                }}
              />
            ) : (
              <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm">
                Connect Wallet (Setup Required)
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
