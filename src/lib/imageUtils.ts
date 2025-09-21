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

// Cache for layout image counts
const layoutCountCache = new Map<string, number>();

/**
 * Counts existing images in a layout folder
 */
export const countLayoutImages = async (layoutSlug: string): Promise<number> => {
  console.log(`🔍 Checking images for layout: ${layoutSlug}`);
  
  // Check cache first
  if (layoutCountCache.has(layoutSlug)) {
    console.log(`📁 Using cached count for ${layoutSlug}: ${layoutCountCache.get(layoutSlug)}`);
    return layoutCountCache.get(layoutSlug)!;
  }

  let count = 0;
  const maxCheck = 50; // Check up to 50 images (reasonable limit)
  
  for (let i = 1; i <= maxCheck; i++) {
    const candidates = [
      `/layouts/${layoutSlug}/${i}.webp`,
      `/layouts/${layoutSlug}/${i}.jpg`,
      `/layouts/${layoutSlug}/${i}.jpeg`,
      `/layouts/${layoutSlug}/${i}.png`,
    ];
    
    console.log(`🔍 Checking image ${i} for ${layoutSlug}:`, candidates);
    
    try {
      // Try to load the first available format
      let imageExists = false;
      for (const src of candidates) {
        try {
          await loadImageAsync(src);
          console.log(`✅ Found image: ${src}`);
          imageExists = true;
          break;
        } catch (error) {
          console.log(`❌ Failed to load: ${src}`);
          continue;
        }
      }
      
      if (imageExists) {
        count = i; // Update count to current number (handles gaps in numbering)
      }
    } catch {
      // Continue checking next number
      continue;
    }
  }
  
  // Cache the result
  layoutCountCache.set(layoutSlug, count);
  console.log(`📊 Final count for ${layoutSlug}: ${count}`);
  return count;
};

/**
 * Helper function to load an image and check if it exists
 */
const loadImageAsync = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
};

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
  layoutCountCache.clear();
};