"use client";

import { useState, useEffect } from "react";
import SpinCarousel from "../components/SpinCarousel";
import UnboxModal from "../components/UnboxModal";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Inventory item type definition
interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'cosmetic' | 'currency' | 'powerup' | 'collectible';
  icon: string;
  description: string;
  rarity: {
    name: string;
    color: string;
    textColor: string;
    glow: string;
    sellPrice: number;
  };
  quantity: number;
  dateClaimed: string;
  gameSource: string;
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [totalTokens, setTotalTokens] = useState(500); // Start with some tokens for demo
  const [nftRarity, setNftRarity] = useState<'none' | 'uncommon' | 'epic' | 'legendary'>('none');
  
  // Free spins system
  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(3);
  const [lastResetDate, setLastResetDate] = useState<string>('');
  
  // Inventory system
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showInventory, setShowInventory] = useState(false);

  // Daily Mystery Box system
  const [stakedAmount, setStakedAmount] = useState(0); // Amount of $SLING staked
  const [lastMysteryBoxClaim, setLastMysteryBoxClaim] = useState<string>('');
  const [mysteryBoxAvailable, setMysteryBoxAvailable] = useState(false);
  const [showMysteryBoxModal, setShowMysteryBoxModal] = useState(false);

  // Spin costs configuration
  const spinCosts = {
    base: 100, // Base cost in $SLING
    nftDiscounts: {
      none: 0,       // No discount
      uncommon: 20,  // 20% discount
      epic: 35,      // 35% discount  
      legendary: 50  // 50% discount
    }
  };

  // Calculate current spin cost
  const getCurrentSpinCost = () => {
    if (freeSpinsRemaining > 0) return 0;
    
    const discount = spinCosts.nftDiscounts[nftRarity];
    return Math.floor(spinCosts.base * (1 - discount / 100));
  };

  // Check if daily reset is needed
  const checkDailyReset = () => {
    const today = new Date().toDateString();
    if (lastResetDate !== today) {
      setFreeSpinsRemaining(3);
      setLastResetDate(today);
    }
  };

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

  // Daily Mystery Box logic
  const checkMysteryBoxEligibility = () => {
    const today = new Date().toDateString();
    
    // Check if user has staked $SLING or owns NFTs
    const isEligible = stakedAmount > 0 || nftRarity !== 'none';
    
    // Check if mystery box was already claimed today
    const alreadyClaimedToday = lastMysteryBoxClaim === today;
    
    setMysteryBoxAvailable(isEligible && !alreadyClaimedToday);
  };

  // Simulate staking check (in real app, this would check staked amount from smart contract)
  const checkStakingStatus = () => {
    // For demo purposes, randomly assign staked amount
    // In real app, this would query the staking contract
    const random = Math.random();
    if (random > 0.7) {
      setStakedAmount(Math.floor(Math.random() * 5000) + 1000); // 1000-6000 staked
    } else {
      setStakedAmount(0); // No staking
    }
  };

  const handleMysteryBoxClaim = () => {
    if (!mysteryBoxAvailable) return;
    
    const today = new Date().toDateString();
    setLastMysteryBoxClaim(today);
    setMysteryBoxAvailable(false);
    
    // Open mystery box modal
    setSelectedItem('/mystery-box'); // Special mystery box identifier
    setShowMysteryBoxModal(true);
  };

  // Initialize all checks on component mount
  useEffect(() => {
    checkNFTOwnership();
    checkStakingStatus();
    checkDailyReset();
  }, []);

  // Check mystery box eligibility when staking or NFT status changes
  useEffect(() => {
    checkMysteryBoxEligibility();
  }, [stakedAmount, nftRarity, lastMysteryBoxClaim]);

  const handleItemSelected = (item: string) => {
    const spinCost = getCurrentSpinCost();
    
    // Check if player can afford the spin
    if (spinCost > 0 && totalTokens < spinCost) {
      alert(`Not enough $SLING! You need ${spinCost} $SLING to spin. Current balance: ${totalTokens} $SLING`);
      return;
    }
    
    // Deduct spin cost or free spin
    if (freeSpinsRemaining > 0) {
      setFreeSpinsRemaining(prev => prev - 1);
    } else {
      setTotalTokens(prev => prev - spinCost);
    }
    
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

  // Add items to inventory when claimed
  const handleItemsClaimed = (items: InventoryItem[]) => {
    setInventory(prev => {
      const newInventory = [...prev];
      
      items.forEach(newItem => {
        // Check if item already exists in inventory
        const existingIndex = newInventory.findIndex(
          item => item.name === newItem.name && 
                  item.rarity.name === newItem.rarity.name &&
                  item.gameSource === newItem.gameSource
        );
        
        if (existingIndex >= 0) {
          // Update quantity if item exists
          newInventory[existingIndex].quantity += newItem.quantity;
        } else {
          // Add new item to inventory
          newInventory.push(newItem);
        }
      });
      
      return newInventory;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center container max-w-screen-lg mx-auto p-4">
        <div className="py-20 w-full">
          {/* Token Balance, NFT Status, Mystery Box, and Inventory Button */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8 flex-wrap">
            {/* Inventory Button */}
            <button
              onClick={() => setShowInventory(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">📦 Inventory</p>
                <p className="text-lg font-bold">{inventory.length} items</p>
              </div>
            </button>

            {/* Daily Mystery Box */}
            <div className="relative">
              <button
                onClick={handleMysteryBoxClaim}
                disabled={!mysteryBoxAvailable}
                className={`rounded-xl px-6 py-3 shadow-lg transform transition-all duration-300 ${
                  mysteryBoxAvailable
                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:shadow-xl hover:scale-105 animate-pulse"
                    : "bg-gray-400 text-gray-700 cursor-not-allowed opacity-50"
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">
                    {mysteryBoxAvailable ? "🎁 Daily Mystery Box" : "⏰ Mystery Box"}
                  </p>
                  <p className="text-lg font-bold">
                    {mysteryBoxAvailable ? "CLAIM NOW!" : "Tomorrow"}
                  </p>
                  {(stakedAmount > 0 || nftRarity !== 'none') && (
                    <p className="text-xs opacity-90">
                      {stakedAmount > 0 ? `💎 ${stakedAmount.toLocaleString()} staked` : `✨ ${nftRarity.toUpperCase()} NFT`}
                    </p>
                  )}
                </div>
              </button>
              {mysteryBoxAvailable && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
              )}
            </div>

            {/* Token Balance */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-8 py-4 shadow-lg">
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">Your Balance</p>
                <p className="text-3xl font-bold">{totalTokens.toLocaleString()} $SLING</p>
              </div>
            </div>

            {/* Free Spins / Spin Cost Display */}
            <div className={`rounded-xl px-8 py-4 shadow-lg ${
              freeSpinsRemaining > 0 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white"
                : "bg-gradient-to-r from-orange-500 to-red-600 text-white"
            }`}>
              <div className="text-center">
                <p className="text-sm font-medium opacity-90">
                  {freeSpinsRemaining > 0 ? "🎁 Free Spins" : "💰 Spin Cost"}
                </p>
                <p className="text-2xl font-bold">
                  {freeSpinsRemaining > 0 ? `${freeSpinsRemaining} remaining` : `${getCurrentSpinCost()} $SLING`}
                </p>
                {freeSpinsRemaining === 0 && nftRarity !== 'none' && (
                  <p className="text-xs opacity-90">
                    💎 {spinCosts.nftDiscounts[nftRarity]}% NFT discount applied!
                  </p>
                )}
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
                    💎 {spinCosts.nftDiscounts[nftRarity]}% spin discount • 
                    {nftRarity === 'legendary' && ' +60% better rarity rolls • +100% rare item chance'}
                    {nftRarity === 'epic' && ' +35% better rarity rolls • +50% rare item chance'}
                    {nftRarity === 'uncommon' && ' +15% better rarity rolls • +25% rare item chance'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Daily Free Spins Info */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg px-6 py-3 shadow-lg">
              <div className="text-center">
                <p className="font-bold">🎁 Daily Free Spins: {freeSpinsRemaining}/3</p>
                <p className="text-sm opacity-90">
                  {freeSpinsRemaining > 0 
                    ? `${freeSpinsRemaining} free spins remaining today!`
                    : `Spins cost ${getCurrentSpinCost()} $SLING each • Free spins reset daily`
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <SpinCarousel 
              onItemSelected={handleItemSelected} 
              nftRarity={nftRarity}
              spinCost={getCurrentSpinCost()}
              freeSpinsRemaining={freeSpinsRemaining}
              hasEnoughTokens={totalTokens >= getCurrentSpinCost()}
            />
          </div>

          {/* Buy Tokens Section - shown when no free spins and low balance */}
          {freeSpinsRemaining === 0 && totalTokens < getCurrentSpinCost() && (
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg px-8 py-4 shadow-lg">
                <div className="text-center">
                  <p className="font-bold text-lg">🪙 Need more $SLING tokens?</p>
                  <p className="text-sm opacity-90 mb-3">
                    You need {getCurrentSpinCost()} $SLING to spin • Current balance: {totalTokens} $SLING
                  </p>
                  <button 
                    onClick={() => setTotalTokens(prev => prev + 1000)}
                    className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors"
                  >
                    🎁 Get 1000 $SLING (Demo)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
      
      <UnboxModal 
        isOpen={isModalOpen}
        selectedItem={selectedItem}
        onClose={handleCloseModal}
        onNewSpin={handleNewSpin}
        onTokensEarned={handleTokensEarned}
        onItemsClaimed={handleItemsClaimed}
        nftRarity={nftRarity}
      />

      {/* Mystery Box Modal */}
      <UnboxModal 
        isOpen={showMysteryBoxModal}
        selectedItem="/mystery-box"
        onClose={() => setShowMysteryBoxModal(false)}
        onNewSpin={() => setShowMysteryBoxModal(false)}
        onTokensEarned={handleTokensEarned}
        onItemsClaimed={handleItemsClaimed}
        nftRarity={nftRarity}
      />
      
      {/* Inventory Modal */}
      {showInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">📦 Your Inventory</h2>
              <button 
                onClick={() => setShowInventory(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>
            
            {inventory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-2xl text-gray-500 mb-4">📦</p>
                <p className="text-lg text-gray-600">Your inventory is empty</p>
                <p className="text-sm text-gray-500">Claim items from lootboxes to add them here!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory.map((item, index) => (
                  <div key={`${item.id}-${index}`} className={`${item.rarity.color} rounded-xl p-4 shadow-lg ${item.rarity.glow}/50 shadow-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.rarity.textColor} bg-black bg-opacity-20`}>
                        {item.rarity.name}
                      </span>
                    </div>
                    <h4 className={`font-bold text-lg ${item.rarity.textColor}`}>{item.name}</h4>
                    <p className={`text-sm ${item.rarity.textColor} opacity-80 mb-2`}>{item.description}</p>
                    <div className={`text-xs ${item.rarity.textColor} opacity-70`}>
                      <p>Quantity: {item.quantity}</p>
                      <p>From: {item.gameSource}</p>
                      <p>Claimed: {new Date(item.dateClaimed).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {inventory.length > 0 && (
              <div className="mt-6 text-center">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 inline-block">
                  <p className="text-sm opacity-90">Total Collection Value</p>
                  <p className="text-2xl font-bold">
                    {inventory.reduce((total, item) => {
                      const typeMultiplier = item.type === 'currency' ? 0.1 : 1;
                      return total + (item.rarity.sellPrice * typeMultiplier * item.quantity);
                    }, 0).toLocaleString()} $SLING
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
