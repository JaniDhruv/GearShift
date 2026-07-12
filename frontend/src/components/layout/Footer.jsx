import React from 'react';
import { Car } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-gray-950 text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Car className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold text-white">GearShift</span>
          <span className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-gray-400 cursor-pointer transition-colors">Support</span>
        </div>
      </div>
    </footer>
  );
}
