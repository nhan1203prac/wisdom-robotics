import React from 'react';
import { Bolt, Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = ({ user }:any) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo & Nav Links */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-[#1132D4] cursor-pointer">
            <Bolt className="h-6 w-6 fill-current" />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">TechFeed</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-sm font-semibold text-[#1132D4] border-b-2 border-[#1132D4] pb-1">Home</a>
            <a href="/explore" className="text-sm font-medium text-slate-600 hover:text-[#1132D4] transition-colors">Explore</a>
            <a href="/communities" className="text-sm font-medium text-slate-600 hover:text-[#1132D4] transition-colors">Communities</a>
          </nav>
        </div>
        
        {/* Search & User Actions */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden sm:flex max-w-xs flex-1 items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all">
            <Search className="h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search insights..." 
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile Dropdown */}
          <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-all">
            <div className="h-8 w-8 rounded-full border border-slate-200 overflow-hidden">
              <img 
                src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
                alt="Profile" 
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;