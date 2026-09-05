import React from 'react';
import { DiscoveriesWidget } from './DiscoveriesWidget';
import { Search, ArrowLeft, Menu } from 'lucide-react';

export function DiscoveriesView({ onOpenDrawer, onNavigateBack }: { onOpenDrawer?: () => void, onNavigateBack?: () => void }) {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-stone-50 dark:bg-[#0D0D12] text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Discoveries</h1>
              <p className="text-stone-500">Learn something new about yourself.</p>
            </div>
          </div>
          {onOpenDrawer && (
            <button
              onClick={onOpenDrawer}
              className="md:hidden p-2 rounded-xl hover:bg-stone-200/50 dark:hover:bg-white/5 transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>
          )}
        </div>
        
        {onNavigateBack && (
          <button
            onClick={onNavigateBack}
            className="mb-8 flex items-center gap-2 text-stone-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium text-[15px]"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}

        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] p-8 shadow-sm border border-stone-100 dark:border-stone-800">
          <DiscoveriesWidget />
        </div>
      </div>
    </div>
  );
}
