import { Artwork, ArtworkSchema } from '../_data/artworks';
import { artworks } from '../_data/artworks';

// Validate artworks data in development
if (process.env.NODE_ENV === 'development') {
  artworks.forEach((artwork, index) => {
    try {
      ArtworkSchema.parse(artwork);
    } catch (error) {
      console.error(`Artwork validation error at index ${index}:`, error);
    }
  });
}

export interface GetArtworksOptions {
  sort?: 'curation' | 'year' | 'title';
  status?: 'published' | 'draft' | 'archived';
  tag?: string;
}

export async function getArtworks(options: GetArtworksOptions = {}): Promise<Artwork[]> {
  // TODO: Replace with Supabase fetch when ready
  // const { data } = await supabase
  //   .from('artworks')
  //   .select('*')
  //   .eq('status', options.status || 'published')
  //   .order(options.sort === 'curation' ? 'curation_score' : 'created_at', { ascending: false });

  let filteredArtworks = [...artworks];

  // Filter by status if provided
  if (options.status) {
    filteredArtworks = filteredArtworks.filter(artwork => artwork.status === options.status);
  } else {
    // Default to published only
    filteredArtworks = filteredArtworks.filter(artwork => artwork.status === 'published');
  }

  // Filter by tag if provided
  if (options.tag) {
    filteredArtworks = filteredArtworks.filter(artwork => 
      artwork.tags.includes(options.tag!.toLowerCase())
    );
  }

  // Sort by specified criteria
  switch (options.sort) {
    case 'curation':
      filteredArtworks.sort((a, b) => (b.curationScore || 0) - (a.curationScore || 0));
      break;
    case 'year':
      filteredArtworks.sort((a, b) => b.year - a.year);
      break;
    case 'title':
      filteredArtworks.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      // Default sort by year (newest first)
      filteredArtworks.sort((a, b) => b.year - a.year);
  }

  return filteredArtworks;
}

export async function getArtworkById(id: string): Promise<Artwork | null> {
  // TODO: Replace with Supabase fetch when ready
  // const { data } = await supabase
  //   .from('artworks')
  //   .select('*')
  //   .eq('id', id)
  //   .single();

  const artwork = artworks.find(artwork => artwork.id === id);
  return artwork || null;
}

export async function getArtworksByTag(tag: string): Promise<Artwork[]> {
  return getArtworks({ tag });
}

export async function getAllTags(): Promise<string[]> {
  const allTags = artworks.flatMap(artwork => artwork.tags);
  return Array.from(new Set(allTags)).sort();
}
