"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface SpinCarouselProps {
  images?: string[];
  onItemSelected?: (item: string) => void;
  nftRarity?: 'none' | 'uncommon' | 'epic' | 'legendary';
}

// NFT boost configuratie
const nftBoosts = {
  none: { multiplier: 1.0, label: 'No NFT', rarityBoost: 0, color: 'text-gray-600' },
  uncommon: { multiplier: 1.25, label: 'Uncommon NFT', rarityBoost: 15, color: 'text-blue-600' },
  epic: { multiplier: 1.5, label: 'Epic NFT', rarityBoost: 35, color: 'text-orange-600' },
  legendary: { multiplier: 2.0, label: 'Legendary NFT', rarityBoost: 60, color: 'text-yellow-600' }
};

// Gewogen items met kansen (hogere weight = hogere kans)
const itemWeights = [
  { image: "/A0PG.png", weight: 5 },           // Laag
  { image: "/animeball.png", weight: 15 },     // Hoog
  { image: "/BladesRng.avif", weight: 8 },     // Medium
  { image: "/bombdoor.png", weight: 12 },      // Hoog
  { image: "/dragonblox.png", weight: 3 },     // Zeer laag
  { image: "/greedy.png", weight: 18 },        // Zeer hoog
  { image: "/heroes.avif", weight: 7 },        // Medium
  { image: "/obby.webp", weight: 10 },         // Medium-hoog
  { image: "/treesmash.png", weight: 14 },     // Hoog
  { image: "/wallball.webp", weight: 6 },      // Laag-medium
  { image: "/westport.avif", weight: 2 }       // Zeer laag
];

export default function SpinCarousel({ 
  images,
  onItemSelected,
  nftRarity = 'none'
}: SpinCarouselProps) {
  // Genereer carrousel array gebaseerd op gewichten (deterministisch)
  const generateCarouselImages = () => {
    const carouselArray: string[] = [];
    
    itemWeights.forEach(item => {
      // Voeg items toe gebaseerd op hun gewicht (gewicht = aantal keer dat ze verschijnen)
      for (let i = 0; i < item.weight; i++) {
        carouselArray.push(item.image);
      }
    });
    
    // Geen shuffle voor consistente server/client rendering
    return carouselArray;
  };

  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [winningItem, setWinningItem] = useState<string>(''); // Track het winnende item
  const carouselRef = useRef<HTMLDivElement>(null);

  // Initialize carousel images after component mounts
  useEffect(() => {
    setIsClient(true);
    const initialImages = images || generateCarouselImages();
    
    // Shuffle only on client side
    const shuffledImages = [...initialImages].sort(() => Math.random() - 0.5);
    setCarouselImages(shuffledImages);
    
    // Start met het eerste item in het midden (index 1 positie)
    setSelectedIndex(1);
  }, [images]);

  const getItemRarity = (weight: number) => {
    if (weight >= 15) return { label: "Common", color: "bg-green-500", textColor: "text-white" };
    if (weight >= 10) return { label: "Uncommon", color: "bg-blue-500", textColor: "text-white" };
    if (weight >= 6) return { label: "Rare", color: "bg-purple-500", textColor: "text-white" };
    if (weight >= 3) return { label: "Epic", color: "bg-orange-500", textColor: "text-white" };
    return { label: "Legendary", color: "bg-yellow-500", textColor: "text-black" };
  };

  const getWeightedRandomIndex = () => {
    const currentBoost = nftBoosts[nftRarity];
    
    // Create modified weights for NFT boost
    const modifiedWeights = itemWeights.map(item => {
      let boostedWeight = item.weight;
      
      // NFT boost: verhoog kans op rare items (lagere weight = zeldzamer)
      if (nftRarity !== 'none' && item.weight <= 8) { // Rare, Epic, Legendary items
        boostedWeight = item.weight * currentBoost.multiplier;
      }
      
      return { ...item, weight: boostedWeight };
    });
    
    const totalWeight = modifiedWeights.reduce((sum, item) => sum + item.weight, 0);
    const random = Math.random() * totalWeight;
    let cumulative = 0;
    
    for (let i = 0; i < modifiedWeights.length; i++) {
      cumulative += modifiedWeights[i].weight;
      if (random <= cumulative) {
        // Find the selected item in carousel and return a random occurrence
        const selectedImage = itemWeights[i].image;
        const imageIndices = carouselImages
          .map((img, idx) => img === selectedImage ? idx : -1)
          .filter(idx => idx !== -1);
        
        return imageIndices[Math.floor(Math.random() * imageIndices.length)] || 0;
      }
    }
    return 0; // fallback
  };

  const handleSpin = () => {
    if (isSpinning || carouselImages.length === 0) return;
    
    setIsSpinning(true);
    setWinningItem(''); // Reset het winnende item
    
    // Gebruik gewogen willekeurige selectie (met NFT boost) om het winnende item direct te bepalen
    const targetIndex = getWeightedRandomIndex();
    
    // Validatie: zorg dat targetIndex binnen bereik is
    const safeTargetIndex = Math.max(0, Math.min(targetIndex, carouselImages.length - 1));
    
    // Sla het winnende item direct op (dit is het item dat gekozen is)
    const chosenItem = carouselImages[safeTargetIndex];
    
    // Het doel is dat safeTargetIndex in de gouden zone (midden) komt te staan
    const extraSpins = 5; // Aantal extra volledige rondes voor dramatic effect
    const finalSelectedIndex = safeTargetIndex + (extraSpins * carouselImages.length);
    setSelectedIndex(finalSelectedIndex);
    
    // Stop na 4 seconden
    setTimeout(() => {
      setIsSpinning(false);
      // Zet naar de finale positie waar het geselecteerde item in het midden staat
      // We willen dat item op safeTargetIndex in de gouden zone staat
      setSelectedIndex(safeTargetIndex);
      
      // Stel het winnende item in (dit is consistent met de visuele selectie)
      setWinningItem(chosenItem);
      
      // Verhoogde delay zodat gebruikers het winnende item kunnen zien
      if (onItemSelected) {
        setTimeout(() => {
          // Stuur het daadwerkelijk gekozen item naar de modal
          onItemSelected(chosenItem);
        }, 2000); // Langere delay van 2 seconden voor betere UX
      }
    }, 4000);
  };

  useEffect(() => {
    if (isSpinning && carouselRef.current) {
      // Start de spin animatie met snellere snelheid
      carouselRef.current.style.animation = "fastSpin 0.6s linear infinite";
    } else if (carouselRef.current) {
      // Stop de animatie en toon de geselecteerde image in het midden
      carouselRef.current.style.animation = "none";
      const imageWidth = 220; // Breedte van elke image
      
      // De selectedIndex vertegenwoordigt welk item in de gouden zone moet staan
      // De gouden zone begint op 220px, dus we moeten verschuiven met:
      // offset = -selectedIndex * imageWidth + 220
      const offset = -(selectedIndex * imageWidth) + 220;
      
      carouselRef.current.style.transform = `translateX(${offset}px)`;
    }
  }, [isSpinning, selectedIndex, carouselImages.length]);

  // Don't render until client-side hydration is complete
  if (!isClient || carouselImages.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-8 p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎰 SLNGUNBOX Spinner</h2>
        <div className="relative w-[660px] h-[140px] overflow-hidden border-4 border-blue-500 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">🎰 SLNGUNBOX Spinner</h2>
      
      <div className="relative w-[660px] h-[140px] overflow-hidden border-4 border-blue-500 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl">
        {/* Selection Indicator - markeert het midden item */}
        <div className="absolute top-0 left-[220px] w-[220px] h-full z-10 pointer-events-none">
          {/* Gouden border om het selectie-gebied */}
          <div className="absolute inset-2 border-4 border-yellow-400 rounded-lg bg-yellow-400/10 shadow-lg">
            {/* Pulsing effect tijdens spinning */}
            <div className={`absolute inset-0 border-2 border-yellow-300 rounded-lg ${
              isSpinning ? 'animate-pulse bg-yellow-300/20' : ''
            }`}></div>
            
            {/* Selection arrow indicator */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-l-transparent border-r-transparent border-b-yellow-400"></div>
            </div>
            
            {/* "WINNER" label tijdens spinning */}
            {isSpinning && (
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded animate-bounce">
                TARGET
              </div>
            )}
          </div>
        </div>

        <div className="absolute inset-2 border-2 border-dashed border-gray-300 rounded-lg"></div>
        <div
          ref={carouselRef}
          className="flex h-full"
          style={{ 
            width: `${carouselImages.length * 220}px`,
            transform: !isSpinning ? 'none' : undefined,
            transition: !isSpinning ? 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none'
          }}
        >
          {carouselImages.map((src, index) => {
            const itemWeight = itemWeights.find(item => item.image === src)?.weight || 1;
            const rarity = getItemRarity(itemWeight);
            
            // Check of dit het daadwerkelijk winnende item is
            // Het winnende item wordt getoond als het in de gouden zone staat EN overeenkomt met winningItem
            const isWinningItem = !isSpinning && winningItem === src && index === selectedIndex;
            
            return (
              <div key={index} className="w-[220px] h-full flex items-center justify-center flex-shrink-0 p-2">
                <div className={`bg-white rounded-lg shadow-md p-2 w-full h-full flex flex-col items-center justify-center relative transition-all duration-300 ${
                  isWinningItem ? 'ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl transform scale-105' : ''
                }`}>
                  {/* Rarity Badge */}
                  <div className={`absolute top-1 right-1 px-2 py-1 rounded text-xs font-bold ${rarity.color} ${rarity.textColor}`}>
                    {rarity.label}
                  </div>
                  
                  {/* Weight indicator */}
                  <div className="absolute top-1 left-1 bg-gray-700 text-white text-xs px-1 py-0.5 rounded">
                    {itemWeight}%
                  </div>
                  
                  {/* Selected indicator - alleen tonen voor het daadwerkelijk winnende item */}
                  {isWinningItem && (
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                      WON!
                    </div>
                  )}
                  
                  <Image
                    src={src}
                    alt={`Carousel image ${index + 1}`}
                    width={150}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className={`px-12 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
          isSpinning 
            ? "bg-gray-400 cursor-not-allowed scale-95" 
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
        }`}
      >
        {isSpinning ? "🎰 Spinning..." : "🎲 SPIN"}
      </button>

      {/* Drop Chance Legend */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-2xl">
        <h3 className="text-lg font-bold text-gray-800 mb-3 text-center">
          📊 Drop Chances {nftRarity !== 'none' && <span className={nftBoosts[nftRarity].color}>🚀 ({nftBoosts[nftRarity].label})</span>}
        </h3>
        <div className="grid grid-cols-5 gap-2 text-xs">
          <div className="text-center">
            <div className="bg-green-500 text-white px-2 py-1 rounded mb-1 font-bold">Common</div>
            <p className="text-gray-600">15%+ chance</p>
            <p className="text-gray-500">High drop rate</p>
            {nftRarity !== 'none' && <p className="text-green-600 font-bold">No boost</p>}
          </div>
          <div className="text-center">
            <div className="bg-blue-500 text-white px-2 py-1 rounded mb-1 font-bold">Uncommon</div>
            <p className="text-gray-600">10-14% chance</p>
            <p className="text-gray-500">Medium drop rate</p>
            {nftRarity !== 'none' && <p className="text-green-600 font-bold">No boost</p>}
          </div>
          <div className="text-center">
            <div className="bg-purple-500 text-white px-2 py-1 rounded mb-1 font-bold">Rare</div>
            <p className="text-gray-600">6-9% chance</p>
            <p className="text-gray-500">{nftRarity !== 'none' ? "Boosted!" : "Low drop rate"}</p>
            {nftRarity !== 'none' && <p className={nftBoosts[nftRarity].color + " font-bold"}>+{Math.round((nftBoosts[nftRarity].multiplier - 1) * 100)}% boost!</p>}
          </div>
          <div className="text-center">
            <div className="bg-orange-500 text-white px-2 py-1 rounded mb-1 font-bold">Epic</div>
            <p className="text-gray-600">3-5% chance</p>
            <p className="text-gray-500">{nftRarity !== 'none' ? "Boosted!" : "Very low drop rate"}</p>
            {nftRarity !== 'none' && <p className={nftBoosts[nftRarity].color + " font-bold"}>+{Math.round((nftBoosts[nftRarity].multiplier - 1) * 100)}% boost!</p>}
          </div>
          <div className="text-center">
            <div className="bg-yellow-500 text-black px-2 py-1 rounded mb-1 font-bold">Legendary</div>
            <p className="text-gray-600">2% chance</p>
            <p className="text-gray-500">{nftRarity !== 'none' ? "Boosted!" : "Ultra rare"}</p>
            {nftRarity !== 'none' && <p className={nftBoosts[nftRarity].color + " font-bold"}>+{Math.round((nftBoosts[nftRarity].multiplier - 1) * 100)}% boost!</p>}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fastSpin {
          0% { transform: translateX(0px); }
          100% { transform: translateX(-${carouselImages.length * 220}px); }
        }
      `}</style>
    </div>
  );
}
