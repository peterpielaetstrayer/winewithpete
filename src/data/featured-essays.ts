// Featured essays data structure
// Add your curated essay URLs here when ready

export interface FeaturedEssay {
  title: string;
  url: string;
  excerpt?: string;
  publishedDate?: string;
}

export const featuredEssays: FeaturedEssay[] = [
  // Add your featured essays here
  // Example:
  // {
  //   title: "The Art of Slow Conversation",
  //   url: "https://winewithpete.substack.com/p/art-of-slow-conversation",
  //   excerpt: "How we lost the art of deep dialogue and how to reclaim it...",
  //   publishedDate: "2024-01-15"
  // },
];

// Helper to check if we have featured essays
export const hasFeaturedEssays = featuredEssays.length > 0;

