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

// Cache for layout image numbers (stores actual found image numbers)
const layoutNumbersCache = new Map<string, number[]>();

/**
 * Finds existing images in a layout folder and returns their numbers
 */
export const getLayoutImageNumbers = async (layoutSlug: string): Promise<number[]> => {
  console.log(`🔍 Finding image numbers for layout: ${layoutSlug}`);
  
  // Check cache first
  if (layoutNumbersCache.has(layoutSlug)) {
    const cached = layoutNumbersCache.get(layoutSlug)!;
    console.log(`📁 Using cached numbers for ${layoutSlug}:`, cached);
    return cached;
  }

  const foundNumbers: number[] = [];
  const maxCheck = 30; // Check up to 30 images (reasonable limit)
  
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
        foundNumbers.push(i);
        console.log(`✅ Added image number ${i} to list`);
      }
    } catch {
      // Continue checking next number
      continue;
    }
  }
  
  // Cache the result
  layoutNumbersCache.set(layoutSlug, foundNumbers);
  console.log(`📊 Found image numbers for ${layoutSlug}:`, foundNumbers);
  return foundNumbers;
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
 * Legacy function for backward compatibility - returns count of layout images
 */
export const countLayoutImages = async (layoutSlug: string): Promise<number> => {
  const numbers = await getLayoutImageNumbers(layoutSlug);
  return numbers.length;
};

/**
 * Helper function to check if an image exists without loading it fully
 */
const checkImageExists = async (src: string): Promise<boolean> => {
  try {
    await loadImageAsync(src);
    return true;
  } catch {
    return false;
  }
};

/**
 * Finds existing images in kindergarten gallery folder and returns their numbers
 */
export const getKindergartenGalleryNumbers = async (): Promise<number[]> => {
  const cacheKey = 'kindergarten-gallery';
  
  if (layoutNumbersCache.has(cacheKey)) {
    return layoutNumbersCache.get(cacheKey)!;
  }

  const numbers: number[] = [];
  
  // Check for images numbered 1-50 (reasonable limit)
  for (let i = 1; i <= 50; i++) {
    // Check for WebP first, then JPG
    const webpExists = await checkImageExists(`/kindergarten-gallery/${i}.webp`);
    const jpgExists = await checkImageExists(`/kindergarten-gallery/${i}.jpg`);
    
    if (webpExists || jpgExists) {
      numbers.push(i);
    }
  }
  
  layoutNumbersCache.set(cacheKey, numbers);
  return numbers;
};

/**
 * Analyzes kindergarten gallery images and determines optimal layout
 */
export const analyzeKindergartenGallery = async (maxImages: number = 20): Promise<GalleryAnalysis> => {
  const cacheKey = 'kindergarten-gallery-analysis';
  
  if (analysisCache.has(cacheKey)) {
    return analysisCache.get(cacheKey)!;
  }

  try {
    const imageNumbers = await getKindergartenGalleryNumbers();
    const imagesToAnalyze = imageNumbers.slice(0, maxImages);
    
    if (imagesToAnalyze.length === 0) {
      const fallbackAnalysis: GalleryAnalysis = {
        layoutType: 'grid',
        verticalCount: 0,
        horizontalCount: 0,
        totalCount: 0,
        verticalPercentage: 0
      };
      analysisCache.set(cacheKey, fallbackAnalysis);
      return fallbackAnalysis;
    }

    const analysisPromises = imagesToAnalyze.map(num => {
      // Try WebP first, fallback to JPG
      const webpSrc = `/kindergarten-gallery/${num}.webp`;
      const jpgSrc = `/kindergarten-gallery/${num}.jpg`;
      
      return analyzeImageOrientation(webpSrc).catch(() => 
        analyzeImageOrientation(jpgSrc)
      );
    });

    const results = await Promise.allSettled(analysisPromises);
    
    let verticalCount = 0;
    let horizontalCount = 0;
    let successfulAnalyses = 0;

    results.forEach(result => {
      if (result.status === 'fulfilled') {
        successfulAnalyses++;
        if (result.value.orientation === 'vertical') {
          verticalCount++;
        } else {
          horizontalCount++;
        }
      }
    });

    const totalCount = imagesToAnalyze.length;
    const verticalPercentage = successfulAnalyses > 0 ? (verticalCount / successfulAnalyses) * 100 : 0;
    
    // Use masonry for mixed orientations, grid for uniform orientations
    const layoutType = verticalPercentage > 20 && verticalPercentage < 80 ? 'masonry' : 'grid';

    const analysis: GalleryAnalysis = {
      layoutType,
      verticalCount,
      horizontalCount,
      totalCount,
      verticalPercentage
    };

    analysisCache.set(cacheKey, analysis);
    return analysis;
  } catch (error) {
    console.error('Error analyzing kindergarten gallery:', error);
    
    // Fallback analysis
    const fallbackAnalysis: GalleryAnalysis = {
      layoutType: 'grid',
      verticalCount: 0,
      horizontalCount: 16, // Assume horizontal for fallback
      totalCount: 16,
      verticalPercentage: 0
    };
    
    analysisCache.set(cacheKey, fallbackAnalysis);
    return fallbackAnalysis;
  }
};

/**
 * Clear analysis cache (useful for development or when gallery content changes)
 */
export const clearAnalysisCache = () => {
  analysisCache.clear();
  layoutNumbersCache.clear();
};