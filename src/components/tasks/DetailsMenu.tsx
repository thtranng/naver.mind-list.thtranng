import React, { useState } from 'react';
import { MapPin, Link, Image, File, Plus, X } from 'lucide-react';
import { LocationPicker, LocationData } from '../ui/LocationPicker';

interface DetailsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: LocationData) => void;
  onAddLink: (url: string, title?: string) => void;
  onAddPhoto: (file: File) => void;
  onAddFile: (file: File) => void;
  selectedLocation?: LocationData | null;
}

type MenuOption = 'location' | 'link' | 'photo' | 'file' | null;

export function DetailsMenu({ 
  isOpen, 
  onClose, 
  onAddLocation, 
  onAddLink, 
  onAddPhoto, 
  onAddFile,
  selectedLocation 
}: DetailsMenuProps) {
  const [activeOption, setActiveOption] = useState<MenuOption>(null);
  const [inputValue, setInputValue] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const handleOptionClick = (option: MenuOption) => {
    setActiveOption(option);
    setInputValue('');
    setLinkTitle('');
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;

    switch (activeOption) {
      case 'link':
        onAddLink(inputValue.trim(), linkTitle.trim() || undefined);
        break;
    }

    setInputValue('');
    setLinkTitle('');
    setActiveOption(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'file') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'photo') {
        onAddPhoto(file);
      } else {
        onAddFile(file);
      }
    }
    e.target.value = ''; // Reset input
  };

  if (!isOpen) return null;

  return (
    <>
    <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[280px]">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Add Details</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={14} className="text-gray-600" />
          </button>
        </div>

        {!activeOption ? (
          <div className="space-y-2">


            {/* Location */}
            <button
              onClick={() => setShowLocationPicker(true)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
            >
              <MapPin size={16} className="text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Location</div>
                <div className="text-xs text-gray-500">Add a location</div>
              </div>
            </button>

            {/* Link */}
            <button
              onClick={() => handleOptionClick('link')}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left"
            >
              <Link size={16} className="text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Link</div>
                <div className="text-xs text-gray-500">Attach a URL</div>
              </div>
            </button>

            {/* Photos */}
            <label className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left cursor-pointer">
              <Image size={16} className="text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Photos</div>
                <div className="text-xs text-gray-500">Upload images</div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'photo')}
                className="hidden"
              />
            </label>

            {/* Files */}
            <label className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left cursor-pointer">
              <File size={16} className="text-gray-600" />
              <div>
                <div className="text-sm font-medium text-gray-700">Files</div>
                <div className="text-xs text-gray-500">Attach files</div>
              </div>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, 'file')}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">


            {/* Selected Location Display */}
            {selectedLocation && selectedLocation.name && (
              <div className="mb-3 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-green-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{selectedLocation.name}</div>
                      <div className="text-xs text-gray-600">{selectedLocation.address}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddLocation({ name: '', address: '', latitude: 0, longitude: 0 })}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}

            {/* Link input */}
            {activeOption === 'link' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue text-sm"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Title (optional)
                  </label>
                  <input
                    type="text"
                    value={linkTitle}
                    onChange={(e) => setLinkTitle(e.target.value)}
                    placeholder="Link title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveOption(null)}
                className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim()}
                className="px-3 py-1.5 text-xs bg-mind-list-primary-blue text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
      
      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={(location) => {
          onAddLocation(location);
          setShowLocationPicker(false);
        }}
        selectedLocation={selectedLocation}
      />
    </>
  );
}