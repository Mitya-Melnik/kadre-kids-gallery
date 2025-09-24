import { useState } from "react";

interface KindergartenResponsiveImageProps {
  imageNumber: number;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onClick?: () => void;
}

export const KindergartenResponsiveImage = ({ 
  imageNumber, 
  alt, 
  className = "", 
  loading = "lazy",
  onClick 
}: KindergartenResponsiveImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [currentFormat, setCurrentFormat] = useState<'webp' | 'jpg'>('webp');

  const basePath = `/kindergarten-gallery/${imageNumber}`;
  
  // Generate srcSet for responsive images
  const getSrcSet = (format: 'webp' | 'jpg') => {
    return [
      `${basePath}-mobile.${format} 800w`,
      `${basePath}.${format} 1200w`
    ].join(', ');
  };

  const handleImageError = () => {
    if (currentFormat === 'webp') {
      // Try JPG format
      setCurrentFormat('jpg');
      setImageError(false);
    } else {
      // Both formats failed
      setImageError(true);
    }
  };

  if (imageError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Изображение недоступно</span>
      </div>
    );
  }

  return (
    <img
      src={`${basePath}.${currentFormat}`}
      srcSet={getSrcSet(currentFormat)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt={alt}
      className={className}
      loading={loading}
      onError={handleImageError}
      onClick={onClick}
    />
  );
};