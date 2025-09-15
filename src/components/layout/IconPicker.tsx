import React, { useState } from 'react';
import { X } from 'lucide-react';
import {
  BookOpen24Regular,
  MusicNote124Regular,
  Briefcase24Regular,
  Heart24Regular,
  List24Regular,
  Home24Regular,
  Calendar24Regular,
  Star24Regular,
  Flag24Regular,
  Target24Regular,
  Trophy24Regular,
  Lightbulb24Regular,
  Camera24Regular,
  Gift24Regular,
  Airplane24Regular,
  Circle24Regular,
  Food24Regular,
  Games24Regular,
  ShoppingBag24Regular,
  Document24Regular,
  Folder24Regular,
  Mail24Regular,
  Phone24Regular,
  Clock24Regular,
  Water24Regular,
  Sport24Regular,
  VehicleBus24Regular,
  Building24Regular,
  Planet24Regular,
  AnimalCat24Regular,
  Emoji24Regular,
  Patient24Regular,
  Code24Regular,
  Calculator24Regular,
  Globe24Regular,
  Shield24Regular
} from '@fluentui/react-icons';

interface IconPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIcon: (iconName: string) => void;
  currentIcon?: string;
}

// Bộ sưu tập biểu tượng Microsoft Fluent UI
const availableIcons = [
  { name: 'BookOpen24Regular', component: BookOpen24Regular, label: 'Sách' },
  { name: 'MusicNote124Regular', component: MusicNote124Regular, label: 'Âm nhạc' },
  { name: 'Briefcase24Regular', component: Briefcase24Regular, label: 'Công việc' },
  { name: 'Heart24Regular', component: Heart24Regular, label: 'Trái tim' },
  { name: 'List24Regular', component: List24Regular, label: 'Danh sách' },
  { name: 'Home24Regular', component: Home24Regular, label: 'Nhà' },
  { name: 'Calendar24Regular', component: Calendar24Regular, label: 'Lịch' },
  { name: 'Star24Regular', component: Star24Regular, label: 'Ngôi sao' },
  { name: 'Flag24Regular', component: Flag24Regular, label: 'Cờ' },
  { name: 'Target24Regular', component: Target24Regular, label: 'Mục tiêu' },
  { name: 'Trophy24Regular', component: Trophy24Regular, label: 'Cúp' },
  { name: 'Lightbulb24Regular', component: Lightbulb24Regular, label: 'Ý tưởng' },
  { name: 'Camera24Regular', component: Camera24Regular, label: 'Máy ảnh' },
  { name: 'Gift24Regular', component: Gift24Regular, label: 'Quà tặng' },
  { name: 'Airplane24Regular', component: Airplane24Regular, label: 'Du lịch' },
  { name: 'Circle24Regular', component: Circle24Regular, label: 'Vòng tròn' },
  { name: 'Food24Regular', component: Food24Regular, label: 'Đồ ăn' },
  { name: 'Games24Regular', component: Games24Regular, label: 'Trò chơi' },
  { name: 'ShoppingBag24Regular', component: ShoppingBag24Regular, label: 'Mua sắm' },
  { name: 'Document24Regular', component: Document24Regular, label: 'Tài liệu' },
  { name: 'Folder24Regular', component: Folder24Regular, label: 'Thư mục' },
  { name: 'Mail24Regular', component: Mail24Regular, label: 'Email' },
  { name: 'Phone24Regular', component: Phone24Regular, label: 'Điện thoại' },
  { name: 'Clock24Regular', component: Clock24Regular, label: 'Đồng hồ' },
  { name: 'Water24Regular', component: Water24Regular, label: 'Thời tiết' },
  { name: 'Sport24Regular', component: Sport24Regular, label: 'Thể thao' },
  { name: 'VehicleBus24Regular', component: VehicleBus24Regular, label: 'Xe cộ' },
  { name: 'Building24Regular', component: Building24Regular, label: 'Tòa nhà' },
  { name: 'Planet24Regular', component: Planet24Regular, label: 'Cây cối' },
  { name: 'AnimalCat24Regular', component: AnimalCat24Regular, label: 'Động vật' },
  { name: 'Emoji24Regular', component: Emoji24Regular, label: 'Biểu tượng cảm xúc' },
  { name: 'Patient24Regular', component: Patient24Regular, label: 'Nghệ thuật' },
  { name: 'Code24Regular', component: Code24Regular, label: 'Lập trình' },
  { name: 'Calculator24Regular', component: Calculator24Regular, label: 'Máy tính' },
  { name: 'Globe24Regular', component: Globe24Regular, label: 'Thế giới' },
  { name: 'Shield24Regular', component: Shield24Regular, label: 'Bảo mật' }
];

export function IconPicker({ isOpen, onClose, onSelectIcon, currentIcon }: IconPickerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  // Lọc biểu tượng theo từ khóa tìm kiếm
  const filteredIcons = availableIcons.filter(icon => 
    icon.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onSelectIcon(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Chọn biểu tượng</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Tìm kiếm biểu tượng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Icon Grid */}
        <div className="p-4 overflow-y-auto max-h-96">
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
            {filteredIcons.map((icon) => {
              const IconComponent = icon.component;
              const isSelected = currentIcon === icon.name;
              
              return (
                <button
                  key={icon.name}
                  onClick={() => handleIconSelect(icon.name)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-200
                    hover:bg-blue-50 hover:scale-105
                    ${isSelected 
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-blue-300'
                    }
                  `}
                  title={icon.label}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="text-xs mt-1 text-center leading-tight">
                    {icon.label}
                  </span>
                </button>
              );
            })}
          </div>
          
          {filteredIcons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Không tìm thấy biểu tượng nào phù hợp</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-600 text-center">
            Chọn một biểu tượng để thay đổi cho danh sách của bạn
          </p>
        </div>
      </div>
    </div>
  );
}