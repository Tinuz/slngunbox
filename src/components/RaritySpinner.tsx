"use client";

import { useState, useEffect } from "react";

interface RaritySpinnerProps {
  onRaritySelected: (rarity: string) => void;
  selectedItem: string;
}

const rarities = [
  { name: "Common", chance: 50, color: "bg-gray-400", textColor: "text-gray-800", glow: "shadow-gray-400" },
  { name: "Uncommon", chance: 30, color: "bg-green-500", textColor: "text-white", glow: "shadow-green-500" },
  { name: "Rare", chance: 15, color: "bg-blue-500", textColor: "text-white", glow: "shadow-blue-500" },
  { name: "Epic", chance: 4, color: "bg-purple-600", textColor: "text-white", glow: "shadow-purple-600" },
  { name: "Legendary", chance: 1, color: "bg-yellow-500", textColor: "text-black", glow: "shadow-yellow-500" }
];

export default function RaritySpinner({ onRaritySelected, selectedItem }: RaritySpinnerProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<typeof rarities[0] | null>(null);
  const [spinningRarity, setSpinningRarity] = useState(0);

  const getRandomRarity = () => {
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < rarities.length; i++) {
      cumulative += rarities[i].chance;
      if (random <= cumulative) {
        return rarities[i];
      }
    }
    return rarities[0]; // fallback
  };

  const handleRaritySpin = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedRarity(null);
    
    // Animatie van random rariteiten
    const interval = setInterval(() => {
      setSpinningRarity(Math.floor(Math.random() * rarities.length));
    }, 100);
    
    // Stop na 3 seconden en selecteer finale rariteit
    setTimeout(() => {
      clearInterval(interval);
      const finalRarity = getRandomRarity();
      setSelectedRarity(finalRarity);
      setIsSpinning(false);
      
      // Trigger callback na korte delay voor dramatic effect
      setTimeout(() => {
        onRaritySelected(finalRarity.name);
      }, 1000);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h3 className="text-2xl font-bold text-gray-800">🎁 Unpack Your Box!</h3>
      
      <div className="text-center mb-4">
        <p className="text-lg text-gray-600">Selected Item:</p>
        <p className="text-xl font-semibold text-blue-600">{selectedItem}</p>
      </div>

      {/* Rarity Display */}
      <div className="relative w-80 h-32 flex items-center justify-center border-4 border-gold rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100 shadow-2xl">
        <div className="absolute inset-2 border-2 border-dashed border-amber-300 rounded-lg"></div>
        
        {isSpinning ? (
          <div className={`px-8 py-4 rounded-xl font-bold text-xl transition-all duration-100 ${rarities[spinningRarity].color} ${rarities[spinningRarity].textColor} shadow-xl ${rarities[spinningRarity].glow}`}>
            {rarities[spinningRarity].name}
          </div>
        ) : selectedRarity ? (
          <div className={`px-8 py-4 rounded-xl font-bold text-xl ${selectedRarity.color} ${selectedRarity.textColor} shadow-xl ${selectedRarity.glow} animate-pulse`}>
            {selectedRarity.name}
          </div>
        ) : (
          <div className="text-gray-400 text-xl font-semibold">
            ??? Rarity ???
          </div>
        )}
      </div>

      {/* Rarity Chances Display */}
      <div className="grid grid-cols-5 gap-2 text-xs text-center mb-4">
        {rarities.map((rarity, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className={`w-4 h-4 rounded ${rarity.color} mb-1`}></div>
            <span className="font-semibold">{rarity.name}</span>
            <span className="text-gray-500">{rarity.chance}%</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleRaritySpin}
        disabled={isSpinning}
        className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          isSpinning 
            ? "bg-gray-400 cursor-not-allowed scale-95" 
            : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        {isSpinning ? "🎰 Rolling Rarity..." : "🎲 UNPACK"}
      </button>
    </div>
  );
}
