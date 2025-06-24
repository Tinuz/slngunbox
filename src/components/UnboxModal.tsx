"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

interface UnboxModalProps {
  isOpen: boolean;
  selectedItem: string;
  onClose: () => void;
  onNewSpin: () => void;
  onTokensEarned: (tokens: number) => void;
  onItemsClaimed: (items: InventoryItem[]) => void;
  nftRarity?: 'none' | 'uncommon' | 'epic' | 'legendary';
}

// NFT boost configuration for rarity rolls
const nftRarityBoosts = {
  none: { chanceMod: 0, label: 'Standard' },
  uncommon: { chanceMod: 15, label: 'Uncommon NFT' },
  epic: { chanceMod: 35, label: 'Epic NFT' },
  legendary: { chanceMod: 60, label: 'Legendary NFT' }
};

// Game info mapping for unbox modal
const gameInfo: Record<string, { name: string; genre: string; description: string; players: number }> = {
  "/mystery-box": { name: "Daily Mystery Box", genre: "Special Reward", description: "Exclusive daily rewards for stakers and NFT holders", players: 0 },
  "/A0PG.png": { name: "A0PG", genre: "Action/Adventure", description: "Action-packed adventure game", players: 1250 },
  "/animeball.png": { name: "Anime Ball", genre: "Sports", description: "Anime-style ball sports game", players: 3400 },
  "/BladesRng.avif": { name: "Blades RNG", genre: "Collection/RNG", description: "Random number generation collectible game", players: 2100 },
  "/bombdoor.png": { name: "Bomb Door", genre: "Puzzle/Strategy", description: "Strategic puzzle game with explosive elements", players: 890 },
  "/dragonblox.png": { name: "Dragon Blox", genre: "RPG/Adventure", description: "Dragon-themed RPG adventure", players: 4200 },
  "/greedy.png": { name: "Greedy", genre: "Strategy/Economy", description: "Economic strategy and resource management", players: 1800 },
  "/heroes.avif": { name: "Heroes", genre: "RPG/Action", description: "Hero-based action RPG", players: 5600 },
  "/obby.webp": { name: "Obby", genre: "Obstacle Course", description: "Challenging obstacle course game", players: 2800 },
  "/treesmash.png": { name: "Tree Smash", genre: "Action/Casual", description: "Fast-paced tree chopping action", players: 1900 },
  "/wallball.webp": { name: "Wall Ball", genre: "Sports/Arcade", description: "Classic wall ball arcade game", players: 1100 },
  "/westport.avif": { name: "Westport", genre: "Western/Adventure", description: "Wild west adventure game", players: 3200 }
};

// Rarity system
const rarities = [
  { name: "Common", color: "border-gray-400", textColor: "text-gray-700", glow: "shadow-gray-300", chance: 50, sellPrice: 10 },
  { name: "Uncommon", color: "border-green-400", textColor: "text-green-700", glow: "shadow-green-300", chance: 30, sellPrice: 25 },
  { name: "Rare", color: "border-blue-400", textColor: "text-blue-700", glow: "shadow-blue-300", chance: 15, sellPrice: 50 },
  { name: "Epic", color: "border-purple-400", textColor: "text-purple-700", glow: "shadow-purple-300", chance: 4, sellPrice: 100 },
  { name: "Legendary", color: "border-yellow-400", textColor: "text-yellow-700", glow: "shadow-yellow-300", chance: 1, sellPrice: 250 }
];

// Game-specific rewards with multiple themed categories
const gameRewards: Record<string, { items: Array<{ name: string; type: 'weapon' | 'cosmetic' | 'currency' | 'powerup' | 'collectible'; icon: string; description: string }> }> = {
  "/mystery-box": {
    items: [
      // Exclusive mystery box items - higher value and unique
      { name: "Legendary Staker Sword", type: "weapon", icon: "⚔️", description: "Exclusive weapon for loyal stakers" },
      { name: "Diamond Staking Badge", type: "cosmetic", icon: "💎", description: "Shows your dedication to the platform" },
      { name: "Bonus SLING Tokens", type: "currency", icon: "🪙", description: "Extra tokens as staking reward" },
      { name: "Staker's Fortune", type: "powerup", icon: "🍀", description: "Increases all future rewards" },
      { name: "NFT Fragment", type: "collectible", icon: "🧩", description: "Collect fragments to forge rare NFTs" },
      { name: "Mystery Chest Key", type: "collectible", icon: "🗝️", description: "Unlocks special treasure chests" },
      { name: "Loyalty Crown", type: "cosmetic", icon: "👑", description: "Crown for the most loyal supporters" },
      { name: "Staking Multiplier", type: "powerup", icon: "⚡", description: "Boosts staking rewards temporarily" },
      { name: "Platform Shares", type: "currency", icon: "📈", description: "Exclusive platform revenue shares" },
      { name: "Golden Ticket", type: "collectible", icon: "🎫", description: "Access to exclusive future drops" }
    ]
  },
  "/A0PG.png": {
    items: [
      { name: "Plasma Sword", type: "weapon", icon: "⚔️", description: "High-tech energy blade" },
      { name: "Cyber Armor", type: "cosmetic", icon: "🛡️", description: "Futuristic protective suit" },
      { name: "Tech Points", type: "currency", icon: "💎", description: "Advanced technology currency" },
      { name: "Speed Boost", type: "powerup", icon: "⚡", description: "Temporary speed enhancement" },
      { name: "Data Chip", type: "collectible", icon: "💾", description: "Rare technology artifact" }
    ]
  },
  "/animeball.png": {
    items: [
      { name: "Power Racket", type: "weapon", icon: "🏸", description: "Enhanced sports equipment" },
      { name: "Sports Uniform", type: "cosmetic", icon: "👕", description: "Professional sports wear" },
      { name: "Skill Points", type: "currency", icon: "🏆", description: "Improve your technique" },
      { name: "Energy Drink", type: "powerup", icon: "🥤", description: "Stamina restoration" },
      { name: "Physics Formula", type: "collectible", icon: "🧮", description: "Advanced ball physics" }
    ]
  },
  "/BladesRng.avif": {
    items: [
      { name: "Mystic Blade", type: "weapon", icon: "🗡️", description: "Enchanted weapon" },
      { name: "Battle Cloak", type: "cosmetic", icon: "👘", description: "Mystical warrior attire" },
      { name: "Soul Gems", type: "currency", icon: "💜", description: "Spiritual energy currency" },
      { name: "Luck Charm", type: "powerup", icon: "🍀", description: "Increases RNG luck" },
      { name: "Ancient Rune", type: "collectible", icon: "🔮", description: "Mysterious power source" }
    ]
  },
  "/bombdoor.png": {
    items: [
      { name: "Defusal Kit", type: "weapon", icon: "🧰", description: "Bomb disposal equipment" },
      { name: "Safety Gear", type: "cosmetic", icon: "🦺", description: "Protective equipment" },
      { name: "Circuit Coins", type: "currency", icon: "🪙", description: "Electronic currency" },
      { name: "Time Extension", type: "powerup", icon: "⏰", description: "Extra solving time" },
      { name: "Blueprint", type: "collectible", icon: "📋", description: "Technical schematic" }
    ]
  },
  "/dragonblox.png": {
    items: [
      { name: "Dragon Sword", type: "weapon", icon: "🐲", description: "Forged by ancient dragons" },
      { name: "Scale Armor", type: "cosmetic", icon: "🛡️", description: "Dragon scale protection" },
      { name: "Dragon Gold", type: "currency", icon: "🏅", description: "Precious dragon hoard" },
      { name: "Fire Breath", type: "powerup", icon: "🔥", description: "Temporary dragon power" },
      { name: "Dragon Egg", type: "collectible", icon: "🥚", description: "Rare dragon artifact" }
    ]
  },
  "/greedy.png": {
    items: [
      { name: "Gold Pickaxe", type: "weapon", icon: "⛏️", description: "Premium mining tool" },
      { name: "Merchant Robes", type: "cosmetic", icon: "👔", description: "Wealthy trader attire" },
      { name: "Premium Coins", type: "currency", icon: "🪙", description: "High-value currency" },
      { name: "Greed Multiplier", type: "powerup", icon: "💰", description: "Double earning power" },
      { name: "Treasure Map", type: "collectible", icon: "🗺️", description: "Leads to hidden wealth" }
    ]
  },
  "/heroes.avif": {
    items: [
      { name: "Hero Blade", type: "weapon", icon: "⚔️", description: "Legendary hero weapon" },
      { name: "Hero Cape", type: "cosmetic", icon: "🦸", description: "Iconic hero costume" },
      { name: "Honor Points", type: "currency", icon: "🏅", description: "Heroic achievement currency" },
      { name: "Hero Rush", type: "powerup", icon: "💨", description: "Heroic speed boost" },
      { name: "Hero Medal", type: "collectible", icon: "🏆", description: "Recognition of valor" }
    ]
  },
  "/obby.webp": {
    items: [
      { name: "Grappling Hook", type: "weapon", icon: "🪝", description: "Obstacle traversal tool" },
      { name: "Parkour Gear", type: "cosmetic", icon: "👟", description: "Professional obstacle wear" },
      { name: "Checkpoint Tokens", type: "currency", icon: "🎯", description: "Save progress currency" },
      { name: "Jump Boost", type: "powerup", icon: "🦘", description: "Enhanced jumping ability" },
      { name: "Course Record", type: "collectible", icon: "📜", description: "Speed run achievement" }
    ]
  },
  "/treesmash.png": {
    items: [
      { name: "Golden Axe", type: "weapon", icon: "🪓", description: "Premium tree cutting tool" },
      { name: "Lumberjack Outfit", type: "cosmetic", icon: "👔", description: "Professional woodcutter attire" },
      { name: "Wood Chips", type: "currency", icon: "🪵", description: "Valuable wood currency" },
      { name: "Strength Potion", type: "powerup", icon: "💪", description: "Increased chopping power" },
      { name: "Ancient Seed", type: "collectible", icon: "🌱", description: "Rare tree seed" }
    ]
  },
  "/wallball.webp": {
    items: [
      { name: "Power Ball", type: "weapon", icon: "🏐", description: "High-impact sports ball" },
      { name: "Athletic Gear", type: "cosmetic", icon: "👕", description: "Professional sports attire" },
      { name: "Score Points", type: "currency", icon: "🏆", description: "Game score currency" },
      { name: "Precision Mode", type: "powerup", icon: "🎯", description: "Enhanced accuracy" },
      { name: "Hall of Fame", type: "collectible", icon: "🏛️", description: "Achievement recognition" }
    ]
  },
  "/westport.avif": {
    items: [
      { name: "Sheriff Badge", type: "weapon", icon: "🤠", description: "Symbol of authority" },
      { name: "Cowboy Hat", type: "cosmetic", icon: "👒", description: "Classic western headwear" },
      { name: "Gold Nuggets", type: "currency", icon: "🥇", description: "Wild west currency" },
      { name: "Quick Draw", type: "powerup", icon: "⚡", description: "Faster weapon speed" },
      { name: "Wanted Poster", type: "collectible", icon: "📋", description: "Bounty hunter target" }
    ]
  }
};

export default function UnboxModal({ isOpen, selectedItem, onClose, onNewSpin, onTokensEarned, onItemsClaimed, nftRarity = 'none' }: UnboxModalProps) {
  const [gamePhase, setGamePhase] = useState<'rarity' | 'result' | 'sold'>('rarity');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<typeof rarities[0] | null>(null);
  const [spinningRarity, setSpinningRarity] = useState(0);
  const [unboxedRewards, setUnboxedRewards] = useState<Array<{
    item: typeof gameRewards[string]['items'][0];
    rarity: typeof rarities[0];
    quantity: number;
  }>>([]);
  
  // Per-item action tracking
  const [itemActions, setItemActions] = useState<Array<{
    index: number;
    action: 'claimed' | 'sold' | 'pending';
  }>>([]);
  
  // Phase 3: Advanced reward system state
  const [streakCount, setStreakCount] = useState(0);
  const [specialEvent, setSpecialEvent] = useState<{
    type: 'combo' | 'streak' | 'jackpot' | 'fusion' | null;
    message: string;
    bonus: number;
  } | null>(null);
  const [comboRewards, setComboRewards] = useState<Array<{
    name: string;
    description: string;
    value: number;
  }>>([]);
  
  // Get game information from selected item
  const currentGameInfo = gameInfo[selectedItem] || { name: "Unknown Game", genre: "Unknown", description: "Game information not available", players: 0 };

  const getRandomRarity = () => {
    const currentBoost = nftRarityBoosts[nftRarity];
    
    // Create adjusted chances based on NFT rarity
    let adjustedRarities = [...rarities];
    if (currentBoost.chanceMod > 0) {
      // Reduce common/uncommon, increase rare/epic/legendary
      adjustedRarities = [
        { ...rarities[0], chance: Math.max(25, rarities[0].chance - currentBoost.chanceMod) }, // Common: reduce
        { ...rarities[1], chance: Math.max(15, rarities[1].chance - currentBoost.chanceMod * 0.5) }, // Uncommon: reduce less
        { ...rarities[2], chance: rarities[2].chance + currentBoost.chanceMod * 0.3 }, // Rare: increase  
        { ...rarities[3], chance: rarities[3].chance + currentBoost.chanceMod * 0.4 }, // Epic: increase more
        { ...rarities[4], chance: rarities[4].chance + currentBoost.chanceMod * 0.2 }   // Legendary: increase
      ];
    }
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const rarity of adjustedRarities) {
      cumulative += rarity.chance;
      if (random <= cumulative) {
        return rarity;
      }
    }
    
    return adjustedRarities[0]; // Fallback to common
  };

  // Phase 3: Advanced reward system functions
  const checkForCombos = (rewards: typeof unboxedRewards) => {
    const combos: Array<{ name: string; description: string; value: number }> = [];
    
    // Type diversity combo
    const uniqueTypes = new Set(rewards.map(r => r.item.type));
    if (uniqueTypes.size >= 4) {
      combos.push({
        name: "Collector's Combo",
        description: "4+ different item types",
        value: 50
      });
    }
    
    // Rarity combo
    const hasEpicOrLegendary = rewards.some(r => r.rarity.name === 'Epic' || r.rarity.name === 'Legendary');
    if (hasEpicOrLegendary && rewards.length >= 3) {
      combos.push({
        name: "Lucky Strike",
        description: "Epic/Legendary + multiple items",
        value: 75
      });
    }
    
    // Weapon/armor combo
    const hasWeapon = rewards.some(r => r.item.type === 'weapon');
    const hasCosmetic = rewards.some(r => r.item.type === 'cosmetic');
    if (hasWeapon && hasCosmetic) {
      combos.push({
        name: "Warrior's Set",
        description: "Weapon + Cosmetic combination",
        value: 30
      });
    }
    
    return combos;
  };

  const triggerSpecialEvent = () => {
    const eventChance = Math.random();
    
    if (eventChance < 0.05) { // 5% chance
      return {
        type: 'jackpot' as const,
        message: "🎰 JACKPOT! Bonus multiplier activated!",
        bonus: 100
      };
    } else if (eventChance < 0.15) { // 10% additional chance  
      return {
        type: 'fusion' as const,
        message: "⚗️ FUSION EVENT! Items enhanced!",
        bonus: 50
      };
    }
    
    return null;
  };

  const calculateStreakBonus = (streak: number) => {
    if (streak >= 10) {
      return { multiplier: 2.0, message: "🔥 MEGA STREAK! x2 Value!" };
    } else if (streak >= 5) {
      return { multiplier: 1.5, message: "🔥 HOT STREAK! +50% Value!" };
    } else if (streak >= 3) {
      return { multiplier: 1.25, message: "🔥 ON FIRE! +25% Value!" };
    }
    return { multiplier: 1.0, message: "" };
  };

  // Per-item action functions
  const handleClaimItem = (index: number) => {
    const reward = unboxedRewards[index];
    if (!reward) return;
    
    // Create inventory item
    const inventoryItem: InventoryItem = {
      id: `${Date.now()}-${index}`,
      name: reward.item.name,
      type: reward.item.type,
      icon: reward.item.icon,
      description: reward.item.description,
      rarity: reward.rarity,
      quantity: reward.quantity,
      dateClaimed: new Date().toISOString(),
      gameSource: currentGameInfo.name
    };
    
    // Update item action state
    setItemActions(prev => [
      ...prev.filter(action => action.index !== index),
      { index, action: 'claimed' }
    ]);
    
    // Add to inventory
    onItemsClaimed([inventoryItem]);
  };
  
  const handleSellItem = (index: number) => {
    const reward = unboxedRewards[index];
    if (!reward) return;
    
    // Calculate item value
    const basePrice = reward.rarity.sellPrice;
    const typeMultiplier = reward.item.type === 'currency' ? 0.1 : 1;
    const itemValue = Math.floor(basePrice * typeMultiplier * reward.quantity);
    
    // Update item action state
    setItemActions(prev => [
      ...prev.filter(action => action.index !== index),
      { index, action: 'sold' }
    ]);
    
    // Add tokens
    onTokensEarned(itemValue);
  };
  
  const handleClaimAll = () => {
    const pendingItems = unboxedRewards.filter((_, index) => getItemAction(index) === 'pending');
    const inventoryItems: InventoryItem[] = pendingItems.map((reward, originalIndex) => {
      const actualIndex = unboxedRewards.indexOf(reward);
      return {
        id: `${Date.now()}-${actualIndex}`,
        name: reward.item.name,
        type: reward.item.type,
        icon: reward.item.icon,
        description: reward.item.description,
        rarity: reward.rarity,
        quantity: reward.quantity,
        dateClaimed: new Date().toISOString(),
        gameSource: currentGameInfo.name
      };
    });
    
    // Update pending item actions to claimed
    setItemActions(prev => [
      ...prev,
      ...unboxedRewards.map((_, index) => 
        getItemAction(index) === 'pending' ? { index, action: 'claimed' as const } : null
      ).filter(Boolean) as Array<{ index: number; action: 'claimed' }>
    ]);
    
    // Add all to inventory
    onItemsClaimed(inventoryItems);
  };
  
  const handleSellAll = () => {
    // Calculate total value including bonuses for pending items only
    const pendingRewards = unboxedRewards.filter((_, index) => getItemAction(index) === 'pending');
    const baseValue = pendingRewards.reduce((total, reward) => {
      const basePrice = reward.rarity.sellPrice;
      const typeMultiplier = reward.item.type === 'currency' ? 0.1 : 1;
      return total + (basePrice * typeMultiplier * reward.quantity);
    }, 0);
    
    const comboBonus = comboRewards.reduce((total, combo) => total + combo.value, 0);
    const eventBonus = specialEvent ? specialEvent.bonus : 0;
    const totalValue = Math.floor(baseValue + comboBonus + eventBonus);
    
    // Update pending item actions to sold
    setItemActions(prev => [
      ...prev,
      ...unboxedRewards.map((_, index) => 
        getItemAction(index) === 'pending' ? { index, action: 'sold' as const } : null
      ).filter(Boolean) as Array<{ index: number; action: 'sold' }>
    ]);
    
    // Add tokens
    onTokensEarned(totalValue);
  };

  // Get item action state
  const getItemAction = (index: number) => {
    return itemActions.find(action => action.index === index)?.action || 'pending';
  };

  // Check if all items have been actioned
  const allItemsActioned = unboxedRewards.every((_, index) => getItemAction(index) !== 'pending');
  const anyItemsPending = unboxedRewards.some((_, index) => getItemAction(index) === 'pending');

  // Reset item actions when starting new unbox
  useEffect(() => {
    if (gamePhase === 'rarity') {
      setItemActions([]);
      setSpecialEvent(null);
      setComboRewards([]);
    }
  }, [gamePhase]);

  const handleSpin = () => {
    setIsSpinning(true);
    setSpecialEvent(null);
    setComboRewards([]);
    
    // Start spinning animation
    const spinInterval = setInterval(() => {
      setSpinningRarity(prev => (prev + 1) % rarities.length);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Generate multiple rewards (2-5 items)
      const numRewards = Math.floor(Math.random() * 4) + 2;
      const rewards: typeof unboxedRewards = [];
      const gameRewardPool = gameRewards[selectedItem]?.items || [];
      
      for (let i = 0; i < numRewards; i++) {
        const rarity = getRandomRarity();
        const randomItem = gameRewardPool[Math.floor(Math.random() * gameRewardPool.length)];
        const quantity = randomItem.type === 'currency' 
          ? Math.floor(Math.random() * 50) + 10  // Currency: 10-59 units
          : Math.floor(Math.random() * 3) + 1;   // Others: 1-3 units
        
        rewards.push({
          item: randomItem,
          rarity,
          quantity
        });
      }
      
      // Phase 3: Check for advanced features
      const combos = checkForCombos(rewards);
      const event = triggerSpecialEvent();
      
      // Update streak count
      const newStreak = streakCount + 1;
      setStreakCount(newStreak);
      
      // Apply streak bonus to rewards if applicable
      const streakInfo = calculateStreakBonus(newStreak);
      if (streakInfo.multiplier > 1.0) {
        setSpecialEvent({
          type: 'streak',
          message: streakInfo.message,
          bonus: Math.floor((rewards.reduce((total, r) => total + r.rarity.sellPrice, 0)) * (streakInfo.multiplier - 1.0))
        });
      } else if (event) {
        setSpecialEvent(event);
      }
      
      setComboRewards(combos);
      setUnboxedRewards(rewards);
      
      // Set the best rarity for legacy compatibility
      const bestRarity = rewards.reduce((best, current) => 
        rarities.indexOf(current.rarity) > rarities.indexOf(best) ? current.rarity : best, 
        rarities[0]
      );
      setSelectedRarity(bestRarity);
      setIsSpinning(false);
      setGamePhase('result');
    }, 3000);
  };

  const handleClose = () => {
    setGamePhase('rarity');
    setIsSpinning(false);
    setSelectedRarity(null);
    setUnboxedRewards([]);
    setItemActions([]);
    setSpecialEvent(null);
    setComboRewards([]);
    onClose();
  };

  const handleNewSpin = () => {
    setGamePhase('rarity');
    setIsSpinning(false);
    setSelectedRarity(null);
    setUnboxedRewards([]);
    setItemActions([]);
    setSpecialEvent(null);
    setComboRewards([]);
    onNewSpin();
  };

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

  if (!isOpen) return null;

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
            {/* Game Info Header */}
            {currentGameInfo && (
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold">🎮 {currentGameInfo.name}</h3>
                <p className="text-sm opacity-90">{currentGameInfo.description}</p>
                <p className="text-xs opacity-75">{currentGameInfo.genre} • {currentGameInfo.players.toLocaleString()} players</p>
              </div>
            )}
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Unbox Loot from {itemName}</h2>
            
            {/* NFT Boost Indicator */}
            {nftRarity !== 'none' && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-3 mb-4">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg">✨</span>
                  <span className="font-bold">{nftRarityBoosts[nftRarity].label} Boost Active!</span>
                  <span className="text-lg">✨</span>
                </div>
                <p className="text-sm opacity-90 mt-1">
                  +{nftRarityBoosts[nftRarity].chanceMod}% chance for higher rarities
                </p>
              </div>
            )}
          </div>

          {/* Rarity Spinner Phase */}
          {gamePhase === 'rarity' && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  {isSpinning ? "🎲 Spinning..." : "Ready to Unbox?"}
                </h3>
                
                {/* Rarity probabilities display */}
                <div className="grid grid-cols-5 gap-2 mb-6 p-4 bg-gray-100 rounded-lg">
                  {rarities.map((rarity, index) => {
                    // Calculate boosted chances for display
                    let displayChance = rarity.chance;
                    if (nftRarity !== 'none') {
                      const boost = nftRarityBoosts[nftRarity].chanceMod;
                      if (index === 0) displayChance = Math.max(25, rarity.chance - boost);
                      else if (index === 1) displayChance = Math.max(15, rarity.chance - boost * 0.5);
                      else if (index === 2) displayChance = rarity.chance + boost * 0.3;
                      else if (index === 3) displayChance = rarity.chance + boost * 0.4;
                      else if (index === 4) displayChance = rarity.chance + boost * 0.2;
                    }
                    
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded ${rarity.color} mb-1`}></div>
                        <span className="font-semibold">{rarity.name}</span>
                        <span className={nftRarity !== 'none' && index >= 2 ? "text-yellow-600 font-bold" : "text-gray-500"}>
                          {displayChance.toFixed(1)}%
                        </span>
                        {nftRarity !== 'none' && index >= 2 && (
                          <span className="text-xs text-yellow-600">↑</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Spinning rarity indicator */}
              {isSpinning && (
                <div className={`w-32 h-32 rounded-full ${rarities[spinningRarity].color} ${rarities[spinningRarity].glow} flex items-center justify-center transform scale-110 transition-all duration-100`}>
                  <span className={`text-4xl font-bold ${rarities[spinningRarity].textColor}`}>
                    {rarities[spinningRarity].name}
                  </span>
                </div>
              )}

              {/* Spin button */}
              {!isSpinning && (
                <button
                  onClick={handleSpin}
                  className="px-12 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎲 Spin for Loot!
                </button>
              )}
            </div>
          )}

          {/* Results Phase */}
          {gamePhase === 'result' && unboxedRewards.length > 0 && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-purple-600 mb-2">🎉 UNBOXED!</h3>
                <p className="text-lg text-gray-700">You discovered {unboxedRewards.length} amazing items!</p>
              </div>

              {/* Phase 3: Special events and combos */}
              {specialEvent && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl p-4 shadow-xl animate-pulse">
                  <div className="text-center">
                    <p className="text-lg font-bold">{specialEvent.message}</p>
                    <p className="text-sm opacity-90">Bonus: +{specialEvent.bonus} $SLING</p>
                  </div>
                </div>
              )}

              {comboRewards.length > 0 && (
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-4 shadow-xl">
                  <div className="text-center">
                    <p className="text-lg font-bold">🎯 COMBO BONUSES!</p>
                    {comboRewards.map((combo, index) => (
                      <div key={index} className="text-sm opacity-90">
                        {combo.name}: +{combo.value} $SLING
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rewards Grid */}
              <div className="grid gap-4 w-full max-w-lg">
                {unboxedRewards.map((reward, index) => {
                  const itemAction = getItemAction(index);
                  return (
                    <div 
                      key={index}
                      className={`relative p-4 rounded-xl border-2 ${reward.rarity.color} ${reward.rarity.textColor} shadow-lg ${reward.rarity.glow} transform hover:scale-105 transition-all duration-300 ${
                        itemAction !== 'pending' ? 'opacity-75' : ''
                      }`}
                    >
                      {/* Rarity Badge */}
                      <div className="absolute -top-2 -right-2 px-2 py-1 bg-white rounded-full text-xs font-bold text-gray-800 shadow-md">
                        {reward.rarity.name}
                      </div>
                      
                      {/* Action Status Badge */}
                      {itemAction !== 'pending' && (
                        <div className={`absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-bold shadow-md ${
                          itemAction === 'claimed' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                        }`}>
                          {itemAction === 'claimed' ? '📦 Claimed' : '💰 Sold'}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-4">
                        {/* Item Icon */}
                        <div className="text-4xl">{reward.item.icon}</div>
                        
                        {/* Item Details */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-lg">{reward.item.name}</h4>
                            {reward.quantity > 1 && (
                              <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-sm font-bold">
                                x{reward.quantity}
                              </span>
                            )}
                          </div>
                          <p className="text-sm opacity-90">{reward.item.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                              {reward.item.type.charAt(0).toUpperCase() + reward.item.type.slice(1)}
                            </span>
                            <span className="text-xs opacity-75">
                              Value: {Math.floor(reward.rarity.sellPrice * (reward.item.type === 'currency' ? 0.1 : 1) * reward.quantity)} $SLING
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Per-item action buttons */}
                      {itemAction === 'pending' && (
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleClaimItem(index)}
                            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg font-bold transition-colors"
                          >
                            📦 Claim
                          </button>
                          <button
                            onClick={() => handleSellItem(index)}
                            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-bold transition-colors"
                          >
                            💰 Sell
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Total Value Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-xl">
                <div className="text-center">
                  <p className="text-sm opacity-90">Total Collection Value</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(unboxedRewards.reduce((total, reward) => {
                      const basePrice = reward.rarity.sellPrice;
                      const typeMultiplier = reward.item.type === 'currency' ? 0.1 : 1;
                      return total + (basePrice * typeMultiplier * reward.quantity);
                    }, 0) + 
                    comboRewards.reduce((total, combo) => total + combo.value, 0) +
                    (specialEvent ? specialEvent.bonus : 0))} $SLING
                  </p>
                  {/* Phase 3: Bonus breakdown */}
                  {(comboRewards.length > 0 || specialEvent) && (
                    <div className="text-xs opacity-75 mt-2">
                      Base: {Math.floor(unboxedRewards.reduce((total, reward) => {
                        const basePrice = reward.rarity.sellPrice;
                        const typeMultiplier = reward.item.type === 'currency' ? 0.1 : 1;
                        return total + (basePrice * typeMultiplier * reward.quantity);
                      }, 0))}
                      {comboRewards.length > 0 && ` + Combos: ${comboRewards.reduce((total, combo) => total + combo.value, 0)}`}
                      {specialEvent && ` + ${specialEvent.type}: ${specialEvent.bonus}`}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-3 w-full max-w-md">
                {/* Claim All / Sell All buttons */}
                {anyItemsPending && (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleClaimAll}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      📦 Claim All
                    </button>
                    
                    <button
                      onClick={handleSellAll}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      💰 Sell All
                    </button>
                  </div>
                )}
                
                {/* New Spin button */}
                <button
                  onClick={handleNewSpin}
                  className="w-full px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  🎲 Spin Again
                </button>
                
                {/* Status text */}
                {allItemsActioned && (
                  <p className="text-center text-sm text-gray-600">
                    All items processed! Ready for another spin.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sold Phase - legacy support */}
          {gamePhase === 'sold' && unboxedRewards.length > 0 && (
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-green-600 mb-2">💰 SOLD!</h3>
                <p className="text-lg text-gray-700">You have sold your rewards for a total of:</p>
              </div>

              {/* Total Value Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl p-4 shadow-xl">
                <div className="text-center">
                  <p className="text-sm opacity-90">Total Sale Value</p>
                  <p className="text-2xl font-bold">
                    {Math.floor(unboxedRewards.reduce((total, reward) => {
                      const basePrice = reward.rarity.sellPrice;
                      const typeMultiplier = reward.item.type === 'currency' ? 0.1 : 1;
                      return total + (basePrice * typeMultiplier * reward.quantity);
                    }, 0) + 
                    comboRewards.reduce((total, combo) => total + combo.value, 0) +
                    (specialEvent ? specialEvent.bonus : 0))} $SLING
                  </p>
                  {/* Phase 3: Show breakdown of bonuses earned */}
                  {(comboRewards.length > 0 || specialEvent) && (
                    <div className="text-sm opacity-90 mt-2">
                      {comboRewards.length > 0 && <p>🎯 Combo bonuses: +{comboRewards.reduce((total, combo) => total + combo.value, 0)} $SLING</p>}
                      {specialEvent && <p>✨ {specialEvent.type} bonus: +{specialEvent.bonus} $SLING</p>}
                    </div>
                  )}
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
