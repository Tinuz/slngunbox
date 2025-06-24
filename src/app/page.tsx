"use client";

import { useState, useEffect } from "react";
import SpinCarousel from "../components/SpinCarousel";
import UnboxModal from "../components/UnboxModal";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [totalTokens, setTotalTokens] = useState(0);
  const [nftRarity, setNftRarity] = useState<'none' | 'uncommon' | 'epic' | 'legendary'>('none');

  // Simulate NFT check (in real app, this would check the connected wallet)
  const checkNFTOwnership = () => {
    // For demo purposes, randomly assign NFT rarity
    // In real app, this would check wallet for NFTs and determine highest rarity
    const random = Math.random();
    if (random > 0.85) {
      setNftRarity('legendary'); // 15% chance
    } else if (random > 0.65) {
      setNftRarity('epic'); // 20% chance
    } else if (random > 0.35) {
      setNftRarity('uncommon'); // 30% chance
    } else {
      setNftRarity('none'); // 35% chance
    }
  };

  // Initialize NFT check on component mount
  useEffect(() => {
    checkNFTOwnership();
  }, []);

  const handleItemSelected = (item: string) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem('');
  };

  const handleNewSpin = () => {
    setIsModalOpen(false);
    setSelectedItem('');
  };

  const handleTokensEarned = (tokens: number) => {
    setTotalTokens(prev => prev + tokens);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center container max-w-screen-lg mx-auto p-4">
        <div className="py-20 w-full">
          {/* Token Balance and NFT Status Display */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            {/* Token Balance */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-8 py-4 shadow-lg">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">Your Balance</p>
                <p className="text-3xl font-bold">{totalTokens.toLocaleString()} $SLING</p>
              </div>
            </div>

            {/* NFT Status */}
            <div className={`rounded-xl px-8 py-4 shadow-lg ${
              nftRarity !== 'none'
                ? nftRarity === 'legendary'
                  ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                  : nftRarity === 'epic'
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  : "bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}>
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">
                  {nftRarity !== 'none' ? "🎖️ VIP Status" : "👤 Standard"}
                </p>
                <p className="text-lg font-bold">
                  {nftRarity !== 'none' ? `${nftRarity.charAt(0).toUpperCase() + nftRarity.slice(1)} NFT` : "No NFT"}
                </p>
              </div>
            </div>
          </div>

          {/* NFT Boost Info */}
          {nftRarity !== 'none' && (
            <div className="flex justify-center mb-6">
              <div className={`rounded-lg px-6 py-3 shadow-lg text-white ${
                nftRarity === 'legendary'
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                  : nftRarity === 'epic'
                  ? "bg-gradient-to-r from-purple-500 to-pink-500"
                  : "bg-gradient-to-r from-blue-400 to-cyan-500"
              }`}>
                <div className="text-center">
                  <p className="font-bold">🚀 {nftRarity.toUpperCase()} NFT BOOST ACTIVE!</p>
                  <p className="text-sm opacity-90">
                    {nftRarity === 'legendary' && '+100% chance for Rare+ items | +60% better rarity rolls'}
                    {nftRarity === 'epic' && '+50% chance for Rare+ items | +35% better rarity rolls'}
                    {nftRarity === 'uncommon' && '+25% chance for Rare+ items | +15% better rarity rolls'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <SpinCarousel onItemSelected={handleItemSelected} nftRarity={nftRarity} />
          </div>
        </div>
      </main>
      
      <Footer />
      
      <UnboxModal 
        isOpen={isModalOpen}
        selectedItem={selectedItem}
        onClose={handleCloseModal}
        onNewSpin={handleNewSpin}
        onTokensEarned={handleTokensEarned}
        nftRarity={nftRarity}
      />
    </div>
  );
}
