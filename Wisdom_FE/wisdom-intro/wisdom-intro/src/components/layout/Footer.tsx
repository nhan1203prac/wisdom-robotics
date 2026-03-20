import React from 'react';
import { Bolt } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 py-10 px-4 bg-white mt-auto">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 opacity-80">
              <Bolt className="h-5 w-5 text-[#1132D4]" />
              <span className="text-sm font-bold uppercase tracking-widest text-slate-900">TechFeed</span>
            </div>
            <p className="text-xs text-slate-500 max-w-xs">
              The leading community for sharing technical insights, coding best practices, and industry trends.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product</span>
              <a href="#" className="text-xs text-slate-600 hover:text-[#1132D4]">Features</a>
              <a href="#" className="text-xs text-slate-600 hover:text-[#1132D4]">Integrations</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Legal</span>
              <a href="#" className="text-xs text-slate-500 hover:text-[#1132D4]">Privacy Policy</a>
              <a href="#" className="text-xs text-slate-500 hover:text-[#1132D4]">Terms of Service</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Social</span>
              <a href="#" className="text-xs text-slate-600 hover:text-[#1132D4]">Twitter</a>
              <a href="#" className="text-xs text-slate-600 hover:text-[#1132D4]">GitHub</a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center">
          <span className="text-[10px] font-medium text-slate-400">
            © {currentYear} TechFeed Inc. All rights reserved.
          </span>
          <div className="flex gap-4">
             {/* Icons có thể thêm ở đây */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;