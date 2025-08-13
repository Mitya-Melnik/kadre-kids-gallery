export interface ImageInfo {
  width: number;
  height: number;
  orientation: 'vertical' | 'horizontal' | 'square';
}

export interface GalleryAnalysis {
  layoutType: 'grid' | 'masonry';
  verticalCount: number;
  horizontalCount: number;
  totalCount: number;
  verticalPercentage: number;
}

// Cache for image analysis results
const analysisCache = new Map<string, GalleryAnalysis>();

/**
 * Analyzes image orientation by loading it
 */
export const analyzeImageOrientation = (src: string): Promise<ImageInfo> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      let orientation: 'vertical' | 'horizontal' | 'square';
      
      if (height > width * 1.1) {
        orientation = 'vertical';
      } else if (width > height * 1.1) {
        orientation = 'horizontal';
      } else {
        orientation = 'square';
      }
      
      resolve({ width, height, orientation });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Analyzes all images in a gallery and determines optimal layout
 */
export const analyzeGalleryLayout = async (
  albumSlug: string,
  maxImages: number = 20
): Promise<GalleryAnalysis> => {
  // Check cache first
  const cacheKey = `${albumSlug}-${maxImages}`;
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  const imagePromises: Promise<ImageInfo | null>[] = [];
  
  // Try to analyze existing images
  for (let i = 1; i <= maxImages; i++) {
    const candidates = [
      `/galleries/${albumSlug}/${i}.webp`,
      `/galleries/${albumSlug}/${i}.jpg`,
      `/galleries/${albumSlug}/${i}.jpeg`,
      `/galleries/${albumSlug}/${i}.png`,
    ];
    
    // Try first candidate and analyze
    const promise = analyzeImageOrientation(candidates[0])
      .catch(() => null); // If image doesn't exist, return null
    
    imagePromises.push(promise);
  }

  try {
    const results = await Promise.all(imagePromises);
    const validResults = results.filter((result): result is ImageInfo => result !== null);
    
    let verticalCount = 0;
    let horizontalCount = 0;
    
    validResults.forEach(({ orientation }) => {
      if (orientation === 'vertical') {
        verticalCount++;
      } else {
        horizontalCount++;
      }
    });

    const totalCount = validResults.length;
    const verticalPercentage = totalCount > 0 ? (verticalCount / totalCount) * 100 : 0;
    
    // Use grid layout if 80% or more are vertical, otherwise use masonry
    const layoutType: 'grid' | 'masonry' = verticalPercentage >= 80 ? 'grid' : 'masonry';
    
    const analysis: GalleryAnalysis = {
      layoutType,
      verticalCount,
      horizontalCount,
      totalCount,
      verticalPercentage,
    };

    // Cache the result
    analysisCache.set(cacheKey, analysis);
    
    return analysis;
  } catch (error) {
    console.warn(`Failed to analyze gallery ${albumSlug}:`, error);
    
    // Fallback to masonry if analysis fails
    const fallbackAnalysis: GalleryAnalysis = {
      layoutType: 'masonry',
      verticalCount: 0,
      horizontalCount: 0,
      totalCount: 0,
      verticalPercentage: 0,
    };
    
    return fallbackAnalysis;
  }
};

/**
 * Clear analysis cache (useful for development or when gallery content changes)
 */
export const clearAnalysisCache = () => {
  analysisCache.clear();
};