# Baseline Method Quick Start Images

## Upload Instructions

1. Export your Canva design as high-quality PNG or JPG images
2. Name them sequentially:
   - `page-1.png` (or `.jpg`)
   - `page-2.png`
   - `page-3.png`
   - etc.

3. Upload all images to this folder: `/public/images/baseline-method/quickstart/`

4. Update the `quickstartPages` array in `src/app/baseline-method/quickstart/page.tsx` with your actual filenames

## Image Specifications

- **Format**: PNG or JPG
- **Aspect Ratio**: 8.5:11 (standard letter size)
- **Optimization**: Images will be automatically optimized by Next.js
- **Mobile**: Designed for phone viewing, will display beautifully on all devices

## Notes

- The first image (`page-1.png`) is used as the preview in the teaser section on the main Baseline Method page
- Make sure all images are in the same format (all PNG or all JPG)
- Keep file sizes reasonable (under 2MB per image recommended)

