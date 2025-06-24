"use client";

import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white mt-auto">
      <div className="container max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo en beschrijving */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <Image
                src="/thirdweb.svg"
                alt="SLNGUNBOX Logo"
                width={32}
                height={32}
                className="object-contain filter invert"
              />
              <h3 className="text-xl font-bold">SLNGUNBOX</h3>
            </div>
            <p className="text-gray-400 text-sm">
              The ultimate NFT unboxing experience. Spin and win exclusive items!
            </p>
          </div>
          
          {/* Social Media */}
          <div className="flex flex-col space-y-4">
            <h4 className="text-lg font-semibold">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">📱</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">🐦</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="text-2xl">💬</span>
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 SLNGUNBOX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
