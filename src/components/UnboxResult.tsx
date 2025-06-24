"use client";

import { useState } from "react";
import Image from "next/image";

interface UnboxResultProps {
  selectedItem: string;
  selectedRarity: string;
  onNewSpin: () => void;
}

const rarityStyles = {
  "Common": { bg: "bg-gray-400", text: "text-gray-800", glow: "shadow-gray-400", emoji: "⚪" },
  "Uncommon": { bg: "bg-green-500", text: "text-white", glow: "shadow-green-500", emoji: "🟢" },
  "Rare": { bg: "bg-blue-500", text: "text-white", glow: "shadow-blue-500", emoji: "🔵" },
  "Epic": { bg: "bg-purple-600", text: "text-white", glow: "shadow-purple-600", emoji: "🟣" },
  "Legendary": { bg: "bg-yellow-500", text: "text-black", glow: "shadow-yellow-500", emoji: "🟡" }
};

export default function UnboxResult({ selectedItem, selectedRarity, onNewSpin }: UnboxResultProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const rarity = rarityStyles[selectedRarity as keyof typeof rarityStyles] || rarityStyles.Common;

  return (
    <div className="flex flex-col items-center space-y-8 p-8 relative">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-1/4 text-6xl animate-bounce">🎉</div>
          <div className="absolute top-16 right-1/4 text-4xl animate-pulse">✨</div>
          <div className="absolute top-20 left-1/3 text-5xl animate-spin">🎊</div>
          <div className="absolute top-12 right-1/3 text-3xl animate-bounce">⭐</div>
        </div>
      )}

      <h2 className="text-4xl font-bold text-gray-800 mb-4">🎁 UNBOXED!</h2>
      
      {/* Main Result Card */}
      <div className={`relative p-8 rounded-2xl ${rarity.bg} ${rarity.text} shadow-2xl ${rarity.glow} transform hover:scale-105 transition-all duration-300`}>
        <div className="text-center space-y-4">
          {/* Rarity Badge */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">{rarity.emoji}</span>
            <span className="text-2xl font-bold">{selectedRarity}</span>
            <span className="text-3xl">{rarity.emoji}</span>
          </div>
          
          {/* Item Image */}
          <div className="bg-white rounded-xl p-4 shadow-inner">
            <Image
              src={selectedItem}
              alt="Unboxed item"
              width={200}
              height={120}
              className="object-contain mx-auto"
            />
          </div>
          
          {/* Item Name */}
          <div className="mt-4">
            <p className="text-lg font-semibold opacity-90">You received:</p>
            <p className="text-xl font-bold">
              {selectedItem.split('/').pop()?.replace(/\.(png|svg|avif|webp)$/, '').toUpperCase()}
            </p>
          </div>
        </div>
        
        {/* Decorative corners */}
        <div className="absolute top-2 left-2 text-2xl opacity-50">✨</div>
        <div className="absolute top-2 right-2 text-2xl opacity-50">✨</div>
        <div className="absolute bottom-2 left-2 text-2xl opacity-50">✨</div>
        <div className="absolute bottom-2 right-2 text-2xl opacity-50">✨</div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">📊 Drop Statistics</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Rarity:</span>
            <span className={`font-bold ${rarity.text}`}>{selectedRarity}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Drop Chance:</span>
            <span className="font-bold text-gray-800">
              {selectedRarity === "Common" ? "50%" : 
               selectedRarity === "Uncommon" ? "30%" :
               selectedRarity === "Rare" ? "15%" :
               selectedRarity === "Epic" ? "4%" : "1%"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Item:</span>
            <span className="font-bold text-gray-800">
              {selectedItem.split('/').pop()?.replace(/\.(png|svg|avif|webp)$/, '')}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onNewSpin}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          🎲 Spin Again
        </button>
        
        <button
          onClick={() => setShowConfetti(!showConfetti)}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
        >
          {showConfetti ? "🎊 Hide Effects" : "✨ Show Effects"}
        </button>
      </div>
    </div>
  );
}
