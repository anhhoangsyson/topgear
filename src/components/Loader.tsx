import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({
  size = 24,
  className,
}) => {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin ${className || ""}`} 
    />
  );
};