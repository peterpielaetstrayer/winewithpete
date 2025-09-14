export type Artwork = {
  id: string; // slug-safe
  title: string;
  year: number;
  medium: string; // "AI + post"
  tags: string[];
  aspectRatio: number; // width/height for skeleton sizing
  src: string; // /public/images/art/<id>.jpg
  alt: string;
  description?: string;
  dominantHex?: string; // optional for placeholder
};

export const artworks: Artwork[] = [
  {
    id: "digital-dreams-01",
    title: "Digital Dreams #01",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.2,
    src: "/images/art/digital-dreams-01.jpg",
    alt: "Abstract digital composition with flowing organic shapes in warm earth tones",
    description: "An exploration of digital consciousness through organic forms that seem to breathe and pulse with life.",
    dominantHex: "#8B4513"
  },
  {
    id: "wine-country-sunset",
    title: "Wine Country Sunset",
    year: 2024,
    medium: "AI + post",
    tags: ["landscape", "experiments"],
    aspectRatio: 1.6,
    src: "/images/art/wine-country-sunset.jpg",
    alt: "Rolling hills at sunset with warm golden light filtering through vineyard rows",
    description: "A meditation on the golden hour in wine country, where time seems to slow and the world glows.",
    dominantHex: "#D2691E"
  },
  {
    id: "philosophical-portrait",
    title: "Philosophical Portrait",
    year: 2024,
    medium: "AI + post",
    tags: ["figurative", "experiments"],
    aspectRatio: 0.8,
    src: "/images/art/philosophical-portrait.jpg",
    alt: "Contemplative figure in soft lighting with thoughtful expression",
    description: "A study in introspection, capturing the quiet moments of deep thought and reflection.",
    dominantHex: "#2F4F4F"
  },
  {
    id: "fire-and-wine",
    title: "Fire and Wine",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.4,
    src: "/images/art/fire-and-wine.jpg",
    alt: "Abstract representation of fire and wine with deep reds and warm oranges",
    description: "The elemental dance between fire and wine, two forces that bring people together.",
    dominantHex: "#DC143C"
  },
  {
    id: "conversation-circles",
    title: "Conversation Circles",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.0,
    src: "/images/art/conversation-circles.jpg",
    alt: "Interlocking circular forms representing the flow of conversation and connection",
    description: "Visualizing the organic flow of meaningful conversation, where ideas circle and connect.",
    dominantHex: "#8B7355"
  },
  {
    id: "slow-living-moments",
    title: "Slow Living Moments",
    year: 2024,
    medium: "AI + post",
    tags: ["landscape", "experiments"],
    aspectRatio: 1.8,
    src: "/images/art/slow-living-moments.jpg",
    alt: "Peaceful domestic scene with soft morning light and simple pleasures",
    description: "Capturing the essence of slow living through quiet, contemplative moments.",
    dominantHex: "#F5DEB3"
  },
  {
    id: "community-gathering",
    title: "Community Gathering",
    year: 2024,
    medium: "AI + post",
    tags: ["figurative", "experiments"],
    aspectRatio: 1.3,
    src: "/images/art/community-gathering.jpg",
    alt: "Group of people gathered around a warm fire in an intimate setting",
    description: "The warmth of community, where strangers become friends around shared stories and fire.",
    dominantHex: "#CD853F"
  },
  {
    id: "wine-stained-thoughts",
    title: "Wine Stained Thoughts",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.1,
    src: "/images/art/wine-stained-thoughts.jpg",
    alt: "Abstract composition with wine-colored stains and flowing organic shapes",
    description: "Thoughts that flow like wine, leaving traces of color and meaning on the canvas of memory.",
    dominantHex: "#722F37"
  },
  {
    id: "philosophical-landscape",
    title: "Philosophical Landscape",
    year: 2024,
    medium: "AI + post",
    tags: ["landscape", "experiments"],
    aspectRatio: 1.7,
    src: "/images/art/philosophical-landscape.jpg",
    alt: "Vast landscape with philosophical undertones, mountains meeting sky",
    description: "A landscape that invites contemplation, where the horizon becomes a question mark.",
    dominantHex: "#4682B4"
  },
  {
    id: "digital-embrace",
    title: "Digital Embrace",
    year: 2024,
    medium: "AI + post",
    tags: ["figurative", "experiments"],
    aspectRatio: 0.9,
    src: "/images/art/digital-embrace.jpg",
    alt: "Tender moment between figures rendered in soft digital brushstrokes",
    description: "The human connection that persists even in our digital age, rendered with warmth and care.",
    dominantHex: "#DDA0DD"
  },
  {
    id: "wine-dark-sea",
    title: "Wine Dark Sea",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.5,
    src: "/images/art/wine-dark-sea.jpg",
    alt: "Abstract seascape with deep wine-colored waters and flowing forms",
    description: "Homer's wine-dark sea reimagined through digital brushstrokes and contemporary vision.",
    dominantHex: "#4B0082"
  },
  {
    id: "conversation-flowers",
    title: "Conversation Flowers",
    year: 2024,
    medium: "AI + post",
    tags: ["abstract", "experiments"],
    aspectRatio: 1.0,
    src: "/images/art/conversation-flowers.jpg",
    alt: "Organic forms that bloom like flowers, representing the growth of ideas through conversation",
    description: "Ideas that bloom and grow through conversation, like flowers opening to the sun.",
    dominantHex: "#FF6347"
  }
];

// Helper function for future Supabase integration
export async function getArtworks(): Promise<Artwork[]> {
  // TODO: Replace with Supabase fetch when ready
  return artworks;
}

// Helper function to get artwork by ID
export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find(artwork => artwork.id === id);
}

// Helper function to get artworks by tag
export function getArtworksByTag(tag: string): Artwork[] {
  return artworks.filter(artwork => artwork.tags.includes(tag));
}

// Get all unique tags
export function getAllTags(): string[] {
  const allTags = artworks.flatMap(artwork => artwork.tags);
  return Array.from(new Set(allTags)).sort();
}
