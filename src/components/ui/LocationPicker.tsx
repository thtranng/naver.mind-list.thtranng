import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Navigation } from 'lucide-react';

export interface LocationData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  provider_place_id?: string;
}

interface LocationPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: LocationData) => void;
  selectedLocation?: LocationData | null;
}

interface SearchResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  name?: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

export function LocationPicker({ isOpen, onClose, onSelectLocation, selectedLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState<SearchResult[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Get user's current location
  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lon: longitude });
          // Search for nearby locations
          searchNearbyLocations(latitude, longitude);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to default location (Hanoi, Vietnam)
          setUserLocation({ lat: 21.0285, lon: 105.8542 });
          searchNearbyLocations(21.0285, 105.8542);
        }
      );
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        searchLocations(searchQuery);
      }, 300);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchQuery]);

  const searchLocations = async (query: string) => {
    setIsLoading(true);
    try {
      // Using Nominatim API (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=vn`
      );
      
      if (response.ok) {
        const data: SearchResult[] = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const searchNearbyLocations = async (lat: number, lon: number) => {
    try {
      // Search for nearby places
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16&addressdetails=1`
      );
      
      if (response.ok) {
        const data = await response.json();
        // For demo purposes, we'll create some mock nearby locations
        const mockNearby: SearchResult[] = [
          {
            place_id: 'nearby_1',
            display_name: 'Vị trí hiện tại',
            lat: lat.toString(),
            lon: lon.toString(),
            name: 'Vị trí hiện tại'
          },
          {
            place_id: 'nearby_2', 
            display_name: 'Hồ Hoàn Kiếm, Hà Nội',
            lat: '21.0288',
            lon: '105.8522',
            name: 'Hồ Hoàn Kiếm'
          },
          {
            place_id: 'nearby_3',
            display_name: 'Văn Miếu, Hà Nội', 
            lat: '21.0267',
            lon: '105.8355',
            name: 'Văn Miếu'
          }
        ];
        setNearbyLocations(mockNearby);
      }
    } catch (error) {
      console.error('Nearby search error:', error);
    }
  };

  const handleSelectLocation = (result: SearchResult) => {
    const locationData: LocationData = {
      name: result.name || result.display_name.split(',')[0],
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      provider_place_id: result.place_id
    };
    
    onSelectLocation(locationData);
    onClose();
  };

  const handleRemoveLocation = () => {
    onSelectLocation({
      name: '',
      address: '',
      latitude: 0,
      longitude: 0
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chọn địa điểm</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm địa điểm..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-mind-list-primary-blue focus:ring-1 focus:ring-mind-list-primary-blue"
            />
            {isLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-mind-list-primary-blue"></div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {/* Current Selection */}
          {selectedLocation && selectedLocation.name && (
            <div className="p-4 border-b border-gray-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Địa điểm đã chọn</div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">{selectedLocation.name}</div>
                    <div className="text-sm text-gray-600">{selectedLocation.address}</div>
                  </div>
                </div>
                <button
                  onClick={handleRemoveLocation}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="p-4">
              <div className="text-sm font-medium text-gray-700 mb-3">Kết quả tìm kiếm</div>
              <div className="space-y-2">
                {searchResults.map((result) => (
                  <button
                    key={result.place_id}
                    onClick={() => handleSelectLocation(result)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {result.name || result.display_name.split(',')[0]}
                      </div>
                      <div className="text-sm text-gray-600 truncate">{result.display_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Locations */}
          {!searchQuery.trim() && nearbyLocations.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Navigation size={16} className="text-blue-600" />
                <span>Địa điểm gần đây</span>
              </div>
              <div className="space-y-2">
                {nearbyLocations.map((location) => (
                  <button
                    key={location.place_id}
                    onClick={() => handleSelectLocation(location)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-left transition-colors"
                  >
                    <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {location.name || location.display_name.split(',')[0]}
                      </div>
                      <div className="text-sm text-gray-600 truncate">{location.display_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {searchQuery.trim() && !isLoading && searchResults.length === 0 && (
            <div className="p-8 text-center">
              <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
              <div className="text-gray-500">Không tìm thấy địa điểm nào</div>
              <div className="text-sm text-gray-400 mt-1">Thử tìm kiếm với từ khóa khác</div>
            </div>
          )}

          {/* Empty State */}
          {!searchQuery.trim() && nearbyLocations.length === 0 && (
            <div className="p-8 text-center">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <div className="text-gray-500">Tìm kiếm địa điểm</div>
              <div className="text-sm text-gray-400 mt-1">Nhập tên địa điểm để bắt đầu tìm kiếm</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}