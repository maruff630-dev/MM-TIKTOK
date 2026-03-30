"use client";

import { useState } from "react";
import { ArrowLeft, Menu } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack = false }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  
  // Cleanly close menu
  const closeMenu = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 280); // Wait for CSS reverse animation to finish
  };

  const handleNav = (path: string) => {
    if (pathname === path) {
      closeMenu();
      return;
    }
    closeMenu();
    // Delay routing slightly to show the beautiful closure animation
    setTimeout(() => {
      router.push(path);
    }, 280);
  };

  return (
    <nav className="fixed top-0 inset-x-0 w-full flex items-center justify-between p-4 px-4 sm:px-6 z-[100] glass">
      <div className="flex-1 flex justify-start">
        {showBack ? (
          <button 
            onClick={() => router.back()} 
            className="p-2.5 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" />
          </button>
        ) : <div className="w-10"></div>}
      </div>
      
      {/* Title */}
      <div className="flex-[2] text-center flex justify-center">
        {title && <span className="font-[800] text-lg sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 tracking-wide">{title}</span>}
      </div>
      
      {/* Menu Area */}
      <div className="flex-1 flex justify-end relative">
        <button 
          onClick={() => isMenuOpen ? closeMenu() : setIsMenuOpen(true)}
          className="p-2.5 rounded-full hover:bg-black/5 transition-all text-gray-700 active:scale-95"
        >
          <Menu className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${isMenuOpen && !isMenuClosing ? "rotate-90 opacity-70" : "rotate-0 opacity-100"}`} />
        </button>
        
        {/* Dropdown Menu Portal */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[110] transition-opacity duration-300 ${isMenuClosing ? "opacity-0" : "opacity-100"}`} 
              onClick={closeMenu} 
            />
            
            {/* Menu Modal */}
            <div className={`fixed sm:absolute sm:top-full sm:mt-4 sm:right-4 top-20 left-4 right-4 sm:left-auto sm:w-64 glass-card p-2.5 sm:p-3 flex flex-col gap-1.5 z-[120] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/60 transition-all duration-300 transform sm:origin-top-right origin-top
              ${isMenuClosing ? "opacity-0 scale-95 translate-y-[-10px]" : "opacity-100 scale-100 translate-y-0"}
            `}>
              <button 
                onClick={() => handleNav('/')} 
                className={`w-full text-left px-5 py-4 sm:py-3.5 rounded-2xl font-bold transition-all text-base sm:text-sm
                  ${pathname === '/' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'}
                `}
              >
                Home / Download
              </button>
              
              <button 
                onClick={() => handleNav('/about')} 
                className={`w-full text-left px-5 py-4 sm:py-3.5 rounded-2xl font-bold transition-all text-base sm:text-sm
                  ${pathname === '/about' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'}
                `}
              >
                About Us
              </button>
              
              <button 
                onClick={() => handleNav('/policy')} 
                className={`w-full text-left px-5 py-4 sm:py-3.5 rounded-2xl font-bold transition-all text-base sm:text-sm
                  ${pathname === '/policy' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-blue-50/80 hover:text-blue-600'}
                `}
              >
                Privacy Policy
              </button>
              
              <div className="h-px bg-gray-200/50 my-2 mx-4" />
              <div className="px-5 py-2 text-[11px] font-[800] text-gray-400 text-center tracking-widest opacity-80">
                VER 1.0.1
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
