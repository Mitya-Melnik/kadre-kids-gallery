import { useState } from "react";

// Reusable ResponsiveImage component for optimized loading with mobile/desktop versions
export function ResponsiveImage({
  basePath,
  alt,
  className,
  loading = "lazy",
  type = "gallery",
}: {
  basePath: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  type?: "cover" | "gallery";
}) {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  // Create candidates for both mobile and desktop versions (square format)
  const mobileWebp = `${basePath}-mobile.webp`;
  const desktopWebp = `${basePath}.webp`;
  
  // Fallback sources if webp versions don't exist
  const fallbackSources = [
    `${basePath}.jpg`,
    `${basePath}.jpeg`, 
    `${basePath}.png`
  ];

  // Optimized sizes for square images: covers vs gallery photos
  const isCover = type === "cover";
  const mobileWidth = isCover ? "600w" : "600w";
  const desktopWidth = isCover ? "1000w" : "1000w";
  const mobileSizes = isCover ? "600px" : "600px";
  const desktopSizes = isCover ? "1000px" : "1000px";

  return (
    <img
      srcSet={`${mobileWebp} ${mobileWidth}, ${desktopWebp} ${desktopWidth}`}
      sizes={`(max-width: 768px) ${mobileSizes}, ${desktopSizes}`}
      src={desktopWebp}
      alt={alt}
      className={className}
      loading={loading}
      onError={(e) => {
        // Try fallback sources in sequence
        const currentSrc = e.currentTarget.src;
        const currentSrcSet = e.currentTarget.srcset;
        
        if (currentSrcSet && currentSrcSet.includes('-mobile.webp')) {
          // If srcset failed, try just the desktop webp
          e.currentTarget.srcset = '';
          e.currentTarget.src = desktopWebp;
        } else if (currentSrc.endsWith('.webp')) {
          // If webp failed, try other formats
          e.currentTarget.src = fallbackSources[0] || '/placeholder.svg';
        } else {
          // Try next fallback or hide
          const currentIndex = fallbackSources.indexOf(currentSrc);
          if (currentIndex < fallbackSources.length - 1) {
            e.currentTarget.src = fallbackSources[currentIndex + 1];
          } else {
            setHidden(true);
          }
        }
      }}
    />
  );
}