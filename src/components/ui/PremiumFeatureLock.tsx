import React from 'react';
import { Lock, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumFeatureLockProps {
  featureName: string;
  requiredItem: string;
  requiredItemName: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({
  featureName,
  requiredItem,
  requiredItemName,
  description,
  children,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleGoToShop = () => {
    // Navigate to shop page (we'll create this later)
    navigate('/shop');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-100 bg-opacity-90 rounded-lg z-10 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          {/* Lock Icon */}
          <div className="mb-4">
            <Lock className="w-12 h-12 text-gray-400 mx-auto" />
          </div>
          
          {/* Feature Name */}
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {featureName}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 max-w-sm">
            {description || `Sở hữu ${requiredItemName} để mở khóa tính năng này.`}
          </p>
          
          {/* Call to Action Button */}
          <button
            onClick={handleGoToShop}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            Đến Mind Gems Shop
          </button>
        </div>
      </div>
      
      {/* Disabled Content */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
};

export default PremiumFeatureLock;