import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-white/60" />
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="
          w-64 pl-10 pr-4 py-2 rounded-lg
          bg-white/10 border border-white/20
          text-white placeholder-white/60
          focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40
          transition-colors
        "
      />
    </div>
  );
}