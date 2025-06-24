"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface UnboxModalProps {
  isOpen: boolean;
  selectedItem: string;
  onClose: () => void;
  onNewSpin: () => void;
  onTokensEarned: (tokens: number) => void;
  nftRarity?: 'none' | 'uncommon' | 'epic' | 'legendary';
}

// NFT boost configuratie voor rarity rolls
const nftRarityBoosts = {
  none: { chanceMod: 0, label: 'Standard' },
  uncommon: { chanceMod: 15, label: 'Uncommon NFT' },
  epic: { chanceMod: 35, label: 'Epic NFT' },
  legendary: { chanceMod: 60, label: 'Legendary NFT' }
};

const rarities = [
  { name: "Common", chance: 50, color: "bg-gray-400", textColor: "text-gray-800", glow: "shadow-gray-400", sellPrice: 10 },
  { name: "Uncommon", chance: 30, color: "bg-green-500", textColor: "text-white", glow: "shadow-green-500", sellPrice: 25 },
  { name: "Rare", chance: 15, color: "bg-blue-500", textColor: "text-white", glow: "shadow-blue-500", sellPrice: 75 },
  { name: "Epic", chance: 4, color: "bg-purple-600", textColor: "text-white", glow: "shadow-purple-600", sellPrice: 200 },
  { name: "Legendary", chance: 1, color: "bg-yellow-500", textColor: "text-black", glow: "shadow-yellow-500", sellPrice: 1000 }
];

export default function UnboxModal({ isOpen, selectedItem, onClose, onNewSpin, onTokensEarned, nftRarity = 'none' }: UnboxModalProps) {
  const [gamePhase, setGamePhase] = useState<'rarity' | 'result' | 'sold'>('rarity');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<typeof rarities[0] | null>(null);
  const [spinningRarity, setSpinningRarity] = useState(0);

  const getRandomRarity = () => {
    const currentBoost = nftRarityBoosts[nftRarity];
    
    // NFT boost: verhoog kans op betere rariteiten
    let modifiedRarities = [...rarities];
    
    if (nftRarity !== 'none') {
      // Verschuif kansen gebaseerd op NFT rarity boost
      const boostAmount = currentBoost.chanceMod;
      
      modifiedRarities = [
        { ...rarities[0], chance: Math.max(10, 50 - boostAmount) }, // Common: verminder met boost
        { ...rarities[1], chance: Math.max(10, 30 - boostAmount * 0.3) }, // Uncommon: licht verminderen
        { ...rarities[2], chance: 15 + boostAmount * 0.4 }, // Rare: verhogen
        { ...rarities[3], chance: 4 + boostAmount * 0.4 }, // Epic: verhogen
        { ...rarities[4], chance: 1 + boostAmount * 0.2 }   // Legendary: verhogen
      ];
    }
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (let i = 0; i < modifiedRarities.length; i++) {
      cumulative += modifiedRarities[i].chance;
      if (random <= cumulative) {
        return rarities[i]; // Return original rarity object for consistent pricing
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
      setGamePhase('result');
    }, 3000);
  };

  const handleSell = () => {
    if (selectedRarity) {
      onTokensEarned(selectedRarity.sellPrice);
      setGamePhase('sold');
    }
  };

  const handleNewSpin = () => {
    setGamePhase('rarity');
    setSelectedRarity(null);
    setIsSpinning(false);
    onNewSpin();
  };

  const handleClose = () => {
    setGamePhase('rarity');
    setSelectedRarity(null);
    setIsSpinning(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setGamePhase('rarity');
      setSelectedRarity(null);
      setIsSpinning(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Verbeterde item name extractie met betere fallback
  const extractItemName = (itemPath: string) => {
    if (!itemPath) return 'Unknown Item';
    
    const fileName = itemPath.split('/').pop();
    if (!fileName) return 'Unknown Item';
    
    // Verwijder extensies en verbeter formatting
    const nameWithoutExt = fileName.replace(/\.(png|svg|avif|webp|jpg|jpeg)$/i, '');
    
    // Maak de naam meer leesbaar
    return nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1);
  };

  const itemName = extractItemName(selectedItem);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Background Image */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <Image
            src={selectedItem}
            alt={itemName}
            fill
            className="object-cover opacity-30 blur-md"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50"></div>
        </div>

        {/* Modal Content */}
        <div className="relative bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              🎁 Unboxing {nftRarity !== 'none' && <span className="text-yellow-600">🚀</span>}
            </h2>
            
            {/* NFT Boost Indicator */}
            {nftRarity !== 'none' && (
              <div className={`rounded-lg px-4 py-2 mb-4 inline-block text-white ${
                nftRarity === 'legendary'
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                  : nftRarity === 'epic'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-400 to-cyan-500"
              }`}>
                <p className="text-sm font-bold">🎖️ {nftRarityBoosts[nftRarity].label} - Better rarity chances!</p>
              </div>
            )}
            
            {/* Item Preview */}
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="bg-white rounded-lg p-2 shadow-md border-2 border-gray-200">
                <Image
                  src={selectedItem}
                  alt={itemName}
                  width={60}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-500">Unboxing Item:</p>
                <p className="text-lg font-semibold text-gray-800">{itemName.toUpperCase()}</p>
              </div>
            </div>
          </div>

          {/* Rarity Phase */}
          {gamePhase === 'rarity' && (
            <div className="flex flex-col items-center space-y-6">
              {/* Rarity Display */}
              <div className="relative w-80 h-32 flex items-center justify-center border-4 border-amber-400 rounded-xl bg-gradient-to-br from-yellow-50 to-amber-100 shadow-2xl">
                <div className="absolute inset-2 border-2 border-dashed border-amber-300 rounded-lg"></div>
                
                {isSpinning ? (
                  <div className={`px-8 py-4 rounded-xl font-bold text-xl transition-all duration-100 ${rarities[spinningRarity].color} ${rarities[spinningRarity].textColor} shadow-xl`}>
                    {rarities[spinningRarity].name}
                  </div>
                ) : (
                  <div className="text-gray-400 text-xl font-semibold">
                    ??? Rarity ???
                  </div>
                )}
              </div>

              {/* Rarity Chances */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2 text-center">
                  {nftRarity !== 'none' ? `🎖️ ${nftRarityBoosts[nftRarity].label} Boosted Chances:` : "Standard Chances:"}
                </p>
                <div className="grid grid-cols-5 gap-2 text-xs text-center">
                  {rarities.map((rarity, index) => {
                    // Calculate boosted chances for display
                    let displayChance = rarity.chance;
                    if (nftRarity !== 'none') {
                      const currentBoost = nftRarityBoosts[nftRarity];
                      const boostAmount = currentBoost.chanceMod;
                      
                      const boostedChances = [
                        Math.max(10, 50 - boostAmount), // Common
                        Math.max(10, 30 - boostAmount * 0.3), // Uncommon
                        15 + boostAmount * 0.4, // Rare
                        4 + boostAmount * 0.4, // Epic
                        1 + boostAmount * 0.2 // Legendary
                      ];
                      displayChance = Math.round(boostedChances[index]);
                    }
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded ${rarity.color} mb-1`}></div>
                        <span className="font-semibold">{rarity.name}</span>
                        <span className={nftRarity !== 'none' && index >= 2 ? "text-yellow-600 font-bold" : "text-gray-500"}>
                          {displayChance}%
                        </span>
                        {nftRarity !== 'none' && index >= 2 && (
                          <span className="text-green-600 text-xs">↑</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleRaritySpin}
                disabled={isSpinning}
                className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                  isSpinning 
                    ? "bg-gray-400 cursor-not-allowed scale-95" 
                    : "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                }`}
              >
                {isSpinning ? "🎰 Rolling..." : "🎲 UNPACK"}
              </button>
            </div>
          )}

          {/* Result Phase */}
          {gamePhase === 'result' && selectedRarity && (
            <div className="flex flex-col items-center space-y-6">
              {/* Rarity Result */}
              <div className={`px-8 py-4 rounded-xl font-bold text-2xl ${selectedRarity.color} ${selectedRarity.textColor} shadow-xl`}>
                {selectedRarity.name}
              </div>

              {/* Item Display */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <Image
                  src={selectedItem}
                  alt={itemName}
                  width={200}
                  height={120}
                  className="object-contain mx-auto"
                />
              </div>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 w-full">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600">Rarity</p>
                    <p className={`font-bold ${selectedRarity.textColor}`}>{selectedRarity.name}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Sell Value</p>
                    <p className="font-bold text-green-600">{selectedRarity.sellPrice} $SLANG</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={handleSell}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  💰 Sell for {selectedRarity.sellPrice} $SLANG
                </button>
                
                <button
                  onClick={handleNewSpin}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎲 Spin Again
                </button>
              </div>
            </div>
          )}

          {/* Sold Phase */}
          {gamePhase === 'sold' && selectedRarity && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600 mb-4">💰 SOLD!</h3>
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-xl">
                  <p className="text-lg mb-2">You received:</p>
                  <p className="text-4xl font-bold">{selectedRarity.sellPrice} $SLANG</p>
                </div>
              </div>

              <button
                onClick={handleNewSpin}
                className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                🎲 Spin Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
