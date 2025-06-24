// Game data structure for the DAO's live games
export interface Game {
  id: string;
  name: string;
  image: string;
  description: string;
  genre: string;
  players: number;
  weight: number; // For carousel weighting
}

// Live games from the DAO
export const games: Game[] = [
  {
    id: "a0pg",
    name: "A0PG",
    image: "/A0PG.png",
    description: "Action-packed adventure game",
    genre: "Action/Adventure",
    players: 1250,
    weight: 5
  },
  {
    id: "animeball",
    name: "Anime Ball",
    image: "/animeball.png", 
    description: "Anime-style ball sports game",
    genre: "Sports",
    players: 3400,
    weight: 15
  },
  {
    id: "bladesrng",
    name: "Blades RNG",
    image: "/BladesRng.avif",
    description: "RNG-based blade collection game",
    genre: "Collection/RNG",
    players: 2100,
    weight: 8
  },
  {
    id: "bombdoor",
    name: "Bomb Door",
    image: "/bombdoor.png",
    description: "Strategic puzzle adventure",
    genre: "Puzzle/Strategy",
    players: 2800,
    weight: 12
  },
  {
    id: "dragonblox",
    name: "Dragon Blox",
    image: "/dragonblox.png",
    description: "Epic dragon adventure RPG",
    genre: "RPG/Adventure",
    players: 950,
    weight: 3
  },
  {
    id: "greedy",
    name: "Greedy",
    image: "/greedy.png",
    description: "Resource collection and trading",
    genre: "Strategy/Economy",
    players: 4200,
    weight: 18
  },
  {
    id: "heroes",
    name: "Heroes",
    image: "/heroes.avif",
    description: "Hero collection and battle game",
    genre: "RPG/Strategy",
    players: 1800,
    weight: 7
  },
  {
    id: "obby",
    name: "Obby Adventure",
    image: "/obby.webp",
    description: "Challenging obstacle course",
    genre: "Platformer",
    players: 2600,
    weight: 10
  },
  {
    id: "treesmash",
    name: "Tree Smash",
    image: "/treesmash.png",
    description: "Fast-paced action smashing game",
    genre: "Action/Arcade",
    players: 3100,
    weight: 14
  },
  {
    id: "wallball",
    name: "Wall Ball",
    image: "/wallball.webp",
    description: "Physics-based ball game",
    genre: "Physics/Sports",
    players: 1600,
    weight: 6
  },
  {
    id: "westport",
    name: "Westport",
    image: "/westport.avif",
    description: "Wild west adventure simulation",
    genre: "Simulation/Adventure", 
    players: 750,
    weight: 2
  }
];

// Helper function to get game info from image path
export function getGameFromImage(imagePath: string): Game | null {
  return games.find(game => game.image === imagePath) || null;
}
