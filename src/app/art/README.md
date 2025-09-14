# Art Wallboard - focusedart

A curated gallery showcasing digital experiments from focusedart, integrated into the Wine With Pete ecosystem.

## Overview

The Art Wallboard is a responsive, accessible gallery that displays digital artworks with filtering, lightbox viewing, and deep linking capabilities. Built with Next.js 14, TypeScript, and Tailwind CSS.

## File Structure

```
src/app/art/
├── page.tsx                    # Main art page with metadata
├── _components/
│   ├── Gallery.tsx            # Main gallery component with filtering
│   ├── Lightbox.tsx           # Accessible modal for artwork viewing
│   ├── Filters.tsx            # Tag-based filtering component
│   └── ArtworkCard.tsx        # Individual artwork card with hover effects
├── _data/
│   └── artworks.ts            # Artwork data and helper functions
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
  dominantHex: "#8B4513"          // optional color for loading placeholder
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
The `getArtworks()` function is ready for Supabase integration:

```typescript
// TODO: Replace with Supabase fetch
export async function getArtworks(): Promise<Artwork[]> {
  const { data } = await supabase
    .from('artworks')
    .select('*')
    .order('created_at', { ascending: false });
  return data || [];
}
```

### Pagination
Server function ready for pagination:

```typescript
// Future pagination support
export async function getArtworksPaginated(page: number, limit: number) {
  // Implementation for paginated loading
}
```

### E-commerce Integration
The structure supports adding:
- Print availability
- NFT minting
- Purchase buttons
- Price display

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
