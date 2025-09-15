import React from 'react';

interface CircularProgressProps {
  progress: number; // Giá trị từ 0 đến 100
  size?: number; // Kích thước vòng tròn (mặc định 60px)
  strokeWidth?: number; // Độ dày của vòng tròn (mặc định 4px)
  className?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size = 60,
  strokeWidth = 4,
  className = ''
}) => {
  // Tính toán các giá trị cho SVG
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Vòng nền (Track) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb" // Màu xám nhạt
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-30"
        />
        
        {/* Vòng tiến độ (Progress Ring) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10b981" // Màu xanh lá cây
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
          }}
        />
      </svg>
      
      {/* Hiển thị phần trăm ở trung tâm */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;