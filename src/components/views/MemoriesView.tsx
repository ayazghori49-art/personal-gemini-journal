import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, Trash2, BrainCircuit, Loader2 } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { Memory } from '../../types';

export function MemoriesView({ onOpenDrawer, onNavigateBack }: { onOpenDrawer?: () => void, onNavigateBack?: () => void }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'memories'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Memory[];
      setMemories(mems);
      setLoading(false);
    }, (err) => {
      console.error(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'memories', id));
    } catch (error) {
      console.error("Failed to delete memory:", error);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-stone-50 dark:bg-[#0D0D12] text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">Memories</h1>
              <p className="text-stone-500">Things you've asked me to remember.</p>
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

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-fuchsia-500 animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-12 text-center shadow-sm border border-stone-100 dark:border-stone-800/50">
            <BrainCircuit className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No memories yet</h3>
            <p className="text-stone-500">Just say "Remember this..." in your chat to save facts and preferences.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {memories.map(memory => (
              <div key={memory.id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 shadow-sm border border-stone-100 dark:border-stone-800/50 flex items-start justify-between gap-4">
                <div>
                  <p className="text-slate-900 dark:text-slate-100 text-[15px] leading-relaxed mb-2">
                    {memory.content}
                  </p>
                  <p className="text-xs text-stone-400 font-medium">
                    {new Date(memory.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(memory.id)}
                  className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors shrink-0"
                  title="Delete memory"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
