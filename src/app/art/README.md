# Art Wallboard - focusedart

A curated gallery showcasing digital experiments from focusedart, integrated into the Wine With Pete ecosystem.

## Overview

The Art Wallboard is a responsive, accessible gallery that displays digital artworks with filtering, lightbox viewing, and deep linking capabilities. Built with Next.js 14, TypeScript, and Tailwind CSS.

## File Structure

```
src/app/art/
├── page.tsx                    # Main art page with metadata and query params
├── _components/
│   ├── Gallery.tsx            # Main gallery component with filtering and deep linking
│   ├── Lightbox.tsx           # Accessible modal with future buy section
│   ├── Filters.tsx            # Tag-based filtering component
│   └── ArtworkCard.tsx        # Individual artwork card with hover effects
├── _data/
│   └── artworks.ts            # Artwork data with Zod validation
├── _lib/
│   └── getArtworks.ts         # Data fetching with Supabase hooks
└── README.md                  # This file

public/images/art/
└── *.jpg                      # Artwork images (placeholder SVGs)
```

## Adding New Artworks

### 1. Add Image
Place your artwork image in `public/images/art/` with a slug-safe filename:
```bash
public/images/art/my-new-artwork.jpg
```

### 2. Update Data
Add the artwork to the `artworks` array in `src/app/art/_data/artworks.ts`:

```typescript
{
  id: "my-new-artwork",           // slug-safe identifier
  title: "My New Artwork",        // display title
  year: 2024,                     // creation year
  medium: "AI + post",            // medium description
  tags: ["abstract", "experiments"], // filter tags
  aspectRatio: 1.2,               // width/height ratio for skeleton
  src: "/images/art/my-new-artwork.jpg", // image path
  alt: "Description of the artwork", // alt text for accessibility
  description: "Optional longer description...", // shown in lightbox
  dominantHex: "#8B4513",         // optional color for loading placeholder
  // Future-ready fields:
  status: "published",             // "draft" | "published" | "archived"
  curationScore: 0.85,            // 0 to 1, for sorting
  provenance: {                   // AI generation metadata
    seed: 42,
    model: "focusedart-v1",
    promptHash: "abc123"
  },
  sales: {                        // Future e-commerce
    printable: true,
    printSkus: ["8x10", "12x16"],
    nftMintable: false
  }
}
```

### 3. Add New Tags
If using a new tag, it will automatically appear in the filter options. Tags are case-sensitive and should be lowercase.

## Image Guidelines

- **Format**: JPG, PNG, or WebP
- **Aspect Ratios**: Vary for visual interest (0.8 to 1.8 recommended)
- **Sizing**: Images are responsive, but aim for 800-1200px on the long side
- **Optimization**: Next.js Image component handles optimization automatically
- **Alt Text**: Write descriptive alt text for accessibility

## Deep Linking

The gallery supports deep linking to individual artworks:
- URL format: `/art#artwork-id`
- Example: `/art#digital-dreams-01`
- Automatically opens the lightbox for the specified artwork
- Copy link button in lightbox generates shareable URLs
- Test deep link: `/art#test-deep-link`

## Query Parameters

The gallery supports URL query parameters for advanced filtering:
- `?sort=curation` - Sort by curation score (highest first)
- `?sort=year` - Sort by year (newest first)
- `?sort=title` - Sort alphabetically by title
- `?status=published` - Show only published artworks
- `?status=draft` - Show only draft artworks
- `?status=archived` - Show only archived artworks

Examples:
- `/art?sort=curation` - Show best curated pieces first
- `/art?status=draft` - Show only draft artworks
- `/art?sort=year&status=published` - Show published artworks sorted by year

## Accessibility Features

- **Keyboard Navigation**: Arrow keys for lightbox navigation, Enter/Space to open
- **Focus Management**: Proper focus trapping and restoration
- **Screen Readers**: ARIA labels and semantic HTML
- **Alt Text**: Descriptive alt text for all images
- **High Contrast**: Focus states and hover effects

## Performance

- **Lazy Loading**: Images load as they enter viewport
- **Priority Loading**: First 4 images load with priority
- **Skeleton Loading**: Aspect-ratio based placeholders prevent CLS
- **Image Optimization**: Next.js Image component with responsive sizing

## Future Enhancements

### Supabase Integration
The `getArtworks()` function in `_lib/getArtworks.ts` is ready for Supabase integration:

```typescript
// TODO: Replace with local data fetch
export async function getArtworks(options: GetArtworksOptions = {}): Promise<Artwork[]> {
  const { data } = await supabase
    .from('artworks')
    .select('*')
    .eq('status', options.status || 'published')
    .order(options.sort === 'curation' ? 'curation_score' : 'created_at', { ascending: false });
  return data || [];
}
```

### E-commerce Integration
The structure already supports:
- **Print Sales**: `sales.printable` and `sales.printSkus` fields
- **NFT Minting**: `sales.nftMintable` and `sales.nftRef` fields
- **Buy Section**: Hidden in lightbox, ready to be activated
- **Curation Scoring**: `curationScore` field for quality-based sorting

### AI Generation Metadata
The `provenance` field tracks:
- **Seed**: Random seed used for generation
- **Model**: AI model version (e.g., "focusedart-v1")
- **Prompt Hash**: Hash of the generation prompt

### Data Validation
Zod schema validates all artwork data in development:
- Type safety for all fields
- Runtime validation in dev mode
- Clear error messages for invalid data

## Styling

The gallery uses the existing Wine With Pete design system:
- **Colors**: Stone palette with ember accents
- **Typography**: Inter + Playfair Display
- **Spacing**: Consistent with site spacing scale
- **Animations**: Subtle hover effects and transitions

## Browser Support

- Modern browsers with CSS Grid support
- Touch devices with swipe navigation
- Screen readers and assistive technologies
- Keyboard-only navigation

## Troubleshooting

### Images Not Loading
- Check file paths in `artworks.ts`
- Verify images exist in `public/images/art/`
- Check browser console for 404 errors

### Filter Not Working
- Ensure tags match exactly (case-sensitive)
- Check that artwork has the correct tag in its `tags` array

### Lightbox Issues
- Verify artwork ID matches the hash in URL
- Check that artwork exists in the filtered results

## Maintenance

- **Regular Updates**: Add new artworks monthly
- **Image Optimization**: Compress images before adding
- **Tag Consistency**: Use consistent tag naming
- **Accessibility**: Test with screen readers periodically
