import { t } from '../lib/i18n';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';

import { useJournalData } from '../hooks/useJournalData';
import { useChatData } from '../hooks/useChatData';
import { useSavedMoments } from '../hooks/useSavedMoments';
import { useSavedSummaries } from '../hooks/useSavedSummaries';
import { useChatApi } from '../hooks/useChatApi';
import { useUserSettings } from '../hooks/useUserSettings';
import { Sidebar } from './layout/Sidebar';
import { Drawer } from './layout/Drawer';
import { BottomNav } from './layout/BottomNav';
import { HomeView } from './views/HomeView';
import { ChatView } from './views/ChatView';
import { EmotionalLandscapeView } from './views/EmotionalLandscapeView';
import { AnalyticsInsightsView } from './views/AnalyticsInsightsView';
import { DiscoveriesView } from './views/DiscoveriesView';
import { MemoriesView } from './views/MemoriesView';
import { SummariesView } from './views/SummariesView';
import { SettingsView } from './views/SettingsView';
import { ProfileView } from './views/ProfileView';
import { EditProfileView } from './views/EditProfileView';
import { JournalRemindersView } from './views/JournalRemindersView';
import { HistoryView } from './views/HistoryView';
import { SavedMomentsView } from './views/SavedMomentsView';
import { ModeSelector } from './chat/ModeSelector';
import { ChatMessage } from '../types';
import { Loader2, Settings, Trash2, Menu } from 'lucide-react';
import { cn } from '../lib/utils';
import { Activity, BriefcaseBusiness, Code, Shield, Navigation, FileText, Lightbulb, MessageCircle, SquareSquare } from 'lucide-react';

interface JournalAppProps { onLogout: () => void; user: any; }
export function JournalApp({ onLogout, user }: JournalAppProps) {
  const { entries, saveEntry, removeEntry, clearAllEntries, loading: journalLoading } = useJournalData();
  const { chats, saveChat, removeChat, clearAllChats, loading: chatLoading } = useChatData();
  const { savedMoments, loading: savedMomentsLoading } = useSavedMoments();
  const { savedSummaries, loading: savedSummariesLoading } = useSavedSummaries();
  const { sendMessage, isLoading } = useChatApi();
  const { settings, updateSettings, loading: settingsLoading } = useUserSettings();
  
  const [currentTab, setCurrentTab] = useState('home');
  const [refreshCounter, setRefreshCounter] = useState(0);
  const deletedIdsRef = useRef<Set<string>>(new Set());

  const handleExportData = () => {
    try {
      if (savedMomentsLoading || savedSummariesLoading) {
        alert("Data is still loading, please wait...");
        return;
      }
      if ((!savedMoments || savedMoments.length === 0) && (!savedSummaries || savedSummaries.length === 0)) {
        alert("No saved data to export.");
        return;
      }
      
      let textContent = "YOUR EXPORTED DATA\n=======================\n\n";
      
      if (savedMoments && savedMoments.length > 0) {
        textContent += "--- SAVED MOMENTS ---\n\n";
        savedMoments.forEach((moment) => {
          textContent += `[${new Date(moment.createdAt).toLocaleString()}]\n`;
          textContent += `Summary: ${moment.summary || 'Saved Reflection'}\n\n`;
          textContent += `YOU:\n${moment.userMessage}\n\n`;
          textContent += `AI:\n${moment.aiMessage}\n`;
          textContent += `\n----------------------------------------\n\n`;
        });
      }

      if (savedSummaries && savedSummaries.length > 0) {
        textContent += "--- SAVED SUMMARIES ---\n\n";
        savedSummaries.forEach((summary) => {
          textContent += `[${new Date(summary.createdAt).toLocaleString()}] - ${summary.timeRange}\n\n`;
          textContent += `${summary.summaryText}\n`;
          textContent += `\n----------------------------------------\n\n`;
        });
      }

      const blob = new Blob([textContent], { type: 'text/plain' });
      const dataUri = URL.createObjectURL(blob);
      const exportFileDefaultName = 'saved-data-export.txt';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.style.display = 'none';
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      
      setTimeout(() => {
        URL.revokeObjectURL(dataUri);
      }, 60000);
    } catch (err) {
      console.error("Export Error:", err);
      alert("Failed to export data: " + err);
    }
  };
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [title, setTitle] = useState('New Brainstorming Session');
  const [persona, setPersona] = useState('Default Journal mode');
  const [customInstruction, setCustomInstruction] = useState('');
  const [mood, setMood] = useState<string>('');
  
  const [isRecording, setIsRecording] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load entry
  useEffect(() => {
    if (activeId) {
      const entry = entries.find(e => e.id === activeId) || chats.find(c => c.id === activeId);
      if (entry) {
        setMessages(entry.messages || []);
        setTitle(entry.title);
        setPersona(entry.persona || 'Default Journal mode');
        setCustomInstruction(entry.customInstruction || '');
        setMood(entry.mood || '');
      }
    } else {
      setMessages([]);
      setTitle('New Brainstorming Session');
      setPersona('Default Journal mode');
      setCustomInstruction('');
      setMood('');
    }
  }, [activeId, entries, chats]);

  // Dark mode effect
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleNewSession = () => {
    setActiveId(null);
    setCurrentTab('journal');
  };

  const handleOpenEntry = (id: string) => {
    setActiveId(id);
    setCurrentTab('journal');
  };

  const handleDeleteActiveEntry = async () => {
    if (!activeId) return;
    if (confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      const targetId = activeId;
      deletedIdsRef.current.add(targetId); // Prevent autosaves
      
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        
        const uid = user.uid;
        const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries', 'discoveries'];
        const deletePromises = [];
        const errors = [];
        
        for (const collectionName of collectionsToClear) {
          try {
            const q = query(collection(db, collectionName), where('userId', '==', uid));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(docSnap => {
              if (docSnap.id === targetId) {
                deletePromises.push(
                  deleteDoc(docSnap.ref).catch(e => {
                    errors.push(`Failed to delete ${docSnap.id} in ${collectionName}: ${e.message}`);
                  })
                );
              }
            });
          } catch (e: any) {
             errors.push(`Failed to query ${collectionName}: ${e.message}`);
          }
        }
        
        await Promise.all(deletePromises);
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        
        // After successful Firestore deletion, immediately remove from local state
        if (activeId === targetId) {
          setActiveId(null);
          setMessages([]);
          setTitle('New Brainstorming Session');
          setCurrentTab('home');
        }
        
        alert('Chat deleted successfully');
        console.log("DELETE SUCCESS for ID:", targetId);
        setRefreshCounter(c => c + 1);
      } catch (err: any) {
        console.error("DELETE ERROR:", err);
        alert(`Delete failed: ${err.message}`);
        deletedIdsRef.current.delete(targetId);
      }
    }
  };

  const handleAction = (action: string) => {
    if (action.startsWith('open_entry_')) {
      handleOpenEntry(action.replace('open_entry_', ''));
    } else if (action === 'write') {
      handleNewSession();
    } else if (action === 'talk') {
      handleNewSession();
      // start recording logic could be added here
    } else if (action === 'ask_journal' || action === 'ask_my_journal') {
      handleNewSession();
      setPersona('Ask My Journal');
      setCustomInstruction('You are the "Ask My Journal" assistant. The user wants to ask questions about their own past journal entries, thoughts, and feelings. I have injected their recent journal history below. Answer their questions based ONLY on these provided journal entries. Do not invent details.');
    } else {
      handleNewSession();
    }
  };

  const handleUpdateEntryData = async (payload: any) => {
    if (!activeId || deletedIdsRef.current.has(activeId)) return;
    setIsSaving(true);
    const isEntry = entries.some(e => e.id === activeId);
    const isChat = chats.some(c => c.id === activeId);
    if (isEntry) {
      await saveEntry(activeId, { ...payload, updatedAt: Date.now() });
    } else if (isChat) {
      await saveChat(activeId, { ...payload, updatedAt: Date.now() });
    } else {
      await saveChat(activeId, { ...payload, updatedAt: Date.now() });
    }
    setIsSaving(false);
  };

  const handleSendMessage = (text: string, attachments: any[]) => {
    if (activeId && deletedIdsRef.current.has(activeId)) return;
    
    sendMessage(
      text,
      attachments,
      messages,
      persona,
      customInstruction,
      settings.memoryEnabled ? entries : [],
      (updatedMessages) => setMessages(updatedMessages),
      async (finalMessages, newTitle) => {
        const id = activeId || crypto.randomUUID();
        if (deletedIdsRef.current.has(id)) return; // DO NOT SAVE IF DELETED
        
        setIsSaving(true);
        const isEntry = entries.some(e => e.id === id);
        const isChat = chats.some(c => c.id === id);
        
        const payload = {
            id: id,
            userId: user?.uid,
            title: newTitle || title,
            messages: finalMessages,
            persona,
            customInstruction,
            mood,
            createdAt: activeId ? undefined : Date.now(),
            updatedAt: Date.now()
        };

        if (isEntry) {
          await saveEntry(id, payload);
        } else if (isChat) {
          await saveChat(id, payload);
        } else {
          await saveChat(id, payload);
        }
        
        if (!activeId && !deletedIdsRef.current.has(id)) setActiveId(id);
        setIsSaving(false);
      }
    );
  };

  const handleSelectMode = (newMode: string) => {
    setActiveId(null);
    setPersona(newMode);
    setCurrentTab('journal');
    
    // Update recent modes
    const currentRecent = settings.recentModes || [];
    const newRecent = [newMode, ...currentRecent.filter(m => m !== newMode)].slice(0, 5);
    updateSettings({ recentModes: newRecent });
  };

  const handleToggleMic = async () => {
    if (isRecording) {
      if ((window as any).mediaRecorder) {
        (window as any).mediaRecorder.stop();
      }
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          handleSendMessage('', [{
            mimeType: 'audio/webm',
            data: reader.result as string,
            name: 'Voice_Message.webm'
          }]);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      (window as any).mediaRecorder = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error accessing microphone', err);
      alert('Could not access microphone.');
    }
  };

  if (settingsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-transparent overflow-hidden text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        {currentTab === 'home' && (
          <HomeView lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} 
            profileName={user?.displayName || "there"}
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            isRecording={isRecording}
            onToggleMic={() => setIsRecording(!isRecording)}
            persona={persona}
            entries={entries}
            onStartReflection={() => handleSelectMode('Default Journal mode')}
            onSelectMode={handleSelectMode}
            onOpenEntry={handleOpenEntry}
            onSetMood={setMood}
            onViewAllJournals={() => setCurrentTab('emotional_landscape')}
          />
        )}
        
        {currentTab === 'journal' && (
          <div className="flex-1 flex flex-col h-full relative">
            <ModeSelector currentMode={persona} onSelectMode={handleSelectMode} recentModes={settings.recentModes} />
            
            {/* Journal Header tools (Mood & Settings Toggle) */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <button 
                onClick={() => { setActiveId(null); setCurrentTab('home'); }}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border border-slate-200 dark:border-slate-800"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700 dark:text-slate-300"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm border border-slate-200 dark:border-slate-800"
              >
                <Menu className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>
            <div className="absolute top-16 right-4 z-20 flex gap-2">
              {persona === 'Default Journal mode' && (
                <select
                  value={mood}
                  onChange={(e) => {
                    setMood(e.target.value);
                    if (activeId) handleUpdateEntryData({ mood: e.target.value });
                  }}
                  className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1.5 text-sm font-medium focus:outline-none shadow-sm"
                >
                  <option value="">{t('log_mood', settings.language)}</option>
                  <option value="😊 Happy">😊 Happy</option>
                  <option value="😢 Sad">😢 Sad</option>
                  <option value="😠 Angry">😠 Angry</option>
                  <option value="😨 Anxious">😨 Anxious</option>
                  <option value="😌 Calm">😌 Calm</option>
                  <option value="😵 Exhausted">😵 Exhausted</option>
                </select>
              )}
              {activeId && (
                <button
                  onClick={handleDeleteActiveEntry}
                  className="p-2 rounded-lg backdrop-blur-sm border transition-colors shadow-sm bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40"
                  title="Delete Entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setShowSettings(!showSettings)} 
                className={cn(
                  "p-2 rounded-lg backdrop-blur-sm border transition-colors shadow-sm", 
                  showSettings ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" : "bg-white/80 dark:bg-slate-900/80 text-slate-500 border-slate-200 dark:border-slate-800"
                )}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {showSettings && (
              <div className="absolute top-28 right-4 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-30 flex flex-col gap-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Entry Title</label>
                   <input
                     type="text"
                     value={title}
                     onChange={(e) => {
                       setTitle(e.target.value);
                       if (activeId) handleUpdateEntryData({ title: e.target.value });
                     }}
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Custom Instructions</label>
                   <input
                     type="text"
                     value={customInstruction}
                     onChange={(e) => {
                       setCustomInstruction(e.target.value);
                       if (activeId) handleUpdateEntryData({ customInstruction: e.target.value });
                     }}
                     placeholder="e.g. Be concise, act like a coach..."
                     className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
                   />
                 </div>
                 {isSaving && <div className="text-xs text-indigo-500 flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Saving...</div>}
              </div>
            )}

            <ChatView 
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              isRecording={isRecording}
              onToggleMic={handleToggleMic}
              persona={persona}
            />
          </div>
        )}
        
        {currentTab === 'saved_moments' && <SavedMomentsView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />}
        {currentTab === 'history' && (
          <HistoryView lang={settings.language} 
          entries={Array.from(new Map([...chats, ...entries].map(item => [item.id, item])).values()).filter(item => !deletedIdsRef.current.has(item.id))}
          onOpenEntry={(id) => {
            handleOpenEntry(id);
          }}
          onDeleteEntry={async (id) => {
      console.log("DELETE CLICKED in JournalApp for chat ID:", id);
      const targetId = id;
      deletedIdsRef.current.add(targetId); // Prevent autosaves
      
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        
        const uid = user.uid;
        const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries', 'discoveries'];
        const deletePromises = [];
        const errors = [];
        
        for (const collectionName of collectionsToClear) {
          try {
            const q = query(collection(db, collectionName), where('userId', '==', uid));
            const snapshot = await getDocs(q);
            snapshot.docs.forEach(docSnap => {
              if (docSnap.id === targetId) {
                deletePromises.push(
                  deleteDoc(docSnap.ref).catch(e => {
                    errors.push(`Failed to delete ${docSnap.id} in ${collectionName}: ${e.message}`);
                  })
                );
              }
            });
          } catch (e: any) {
             errors.push(`Failed to query ${collectionName}: ${e.message}`);
          }
        }
        
        await Promise.all(deletePromises);
        
        if (errors.length > 0) {
            throw new Error(errors.join('\n'));
        }
        
        // After successful Firestore deletion, immediately remove from local state
        if (activeId === targetId) {
          setActiveId(null);
          setMessages([]);
          setTitle('New Brainstorming Session');
          setCurrentTab('home');
        }
        
        alert('Chat deleted successfully');
        console.log("DELETE SUCCESS for ID:", targetId);
        setRefreshCounter(c => c + 1);
      } catch (err: any) {
        console.error("DELETE ERROR:", err);
        alert(`Delete failed: ${err.message}`);
        deletedIdsRef.current.delete(targetId);
      }
    }}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onNavigateBack={() => setCurrentTab('home')}
        />
        )}
        
        {currentTab === 'emotional_landscape' && (
          <EmotionalLandscapeView lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} 
            entries={entries}
            onAction={handleAction}
            onNavigateBack={() => setCurrentTab('home')}
          />
        )}
        
        {currentTab === 'ai_insights' && (
          <AnalyticsInsightsView lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} 
            entries={entries}
            onAction={handleAction}
            onNavigateBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'discoveries' && (
          <DiscoveriesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'memories' && (
          <MemoriesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}

        {currentTab === 'summaries' && (
          <SummariesView onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} />
        )}
        
        {currentTab === 'profile' && (
          <ProfileView onLogout={onLogout} lang={settings.language} onOpenDrawer={() => setIsDrawerOpen(true)} onNavigateBack={() => setCurrentTab('home')} 
            profileName={user?.displayName || "there"}
            onNavigateToSettings={() => setCurrentTab('settings')}
            onNavigateToEditProfile={() => setCurrentTab('edit_profile')}
            onNavigateToReminders={() => setCurrentTab('journal_reminders')}
            onExportData={handleExportData}
          />
        )}
        
        {currentTab === 'edit_profile' && (
          <EditProfileView
            lang={settings.language}
            onNavigateBack={() => setCurrentTab('profile')}
          />
        )}
        
        {currentTab === 'journal_reminders' && (
          <JournalRemindersView
            lang={settings.language}
            settings={settings}
            updateSettings={updateSettings}
            onNavigateBack={() => setCurrentTab('profile')}
          />
        )}
        
        {currentTab === 'settings' && (
          <SettingsView onLogout={onLogout} onOpenDrawer={() => setIsDrawerOpen(true)}
            onNavigateBack={() => setCurrentTab('profile')}
            settings={settings}
            updateSettings={updateSettings}
            onClearHistory={async () => {
              try {
                await clearAllEntries();
                await clearAllChats();
                setActiveId(null);
                setMessages([]);
                setTitle('New Brainstorming Session');
                setMood('');
                setCustomInstruction('');
              } catch (err: any) {
                console.error('Delete error details:', err);
                alert(`Failed to clear history: ${err.message}`);
              }
            }}
            onClearAllData={async () => {
              const user = auth.currentUser;
              if (!user) throw new Error('Not authenticated');
              
              const uid = user.uid;
              const collectionsToClear = ['chats', 'entries', 'savedMoments', 'memories', 'weeklySummaries', 'summaries', 'discoveries'];
              const deletePromises = [];
              const errors = [];
            
              for (const collectionName of collectionsToClear) {
                try {
                  const q = query(collection(db, collectionName), where('userId', '==', uid));
                  const snapshot = await getDocs(q);
                  snapshot.docs.forEach(docSnap => {
                    deletePromises.push(
                      deleteDoc(docSnap.ref).catch(e => {
                        errors.push(`Failed to delete ${docSnap.id} in ${collectionName}: ${e.message}`);
                      })
                    );
                  });
                } catch (e: any) {
                  // If we get permission denied, bubble it up. If it's just 'not found' or similar, we might ignore, 
                  // but Firestore usually returns empty for non-existent collections.
                  errors.push(`Failed to query ${collectionName}: ${e.message}`);
                }
              }
            
              try {
                const userSettingsRef = doc(db, 'userSettings', uid);
                deletePromises.push(
                  deleteDoc(userSettingsRef).catch(e => {
                    if (e.code !== 'not-found') {
                       errors.push(`Failed to delete userSettings: ${e.message}`);
                    }
                  })
                );
              } catch (e: any) {
                errors.push(`Failed to delete userSettings: ${e.message}`);
              }
            
              await Promise.all(deletePromises);
              
              if (errors.length > 0) {
                throw new Error(errors.join('\n'));
              }
              
              // Clear UI state
              setActiveId(null);
              setMessages([]);
              setTitle('New Brainstorming Session');
              setCurrentTab('home');
            }} 
          />
        )}
        <Drawer lang={settings.language} 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          onNavigate={(tab) => {
            if (tab === 'history') setCurrentTab('history');
            else if (tab === 'saved_moments') setCurrentTab('saved_moments');
            else if (tab === 'saved_moments') setCurrentTab('saved_moments');
            else if (tab === 'new_chat') {
              handleNewSession();
            }
            else if (tab === 'settings') setCurrentTab('settings');
            else if (tab === 'profile') setCurrentTab('profile');
            else if (tab === 'home') {
              setActiveId(null);
              setCurrentTab('home');
            }
            else if (tab === 'journal') setCurrentTab('journal');
            else if (tab === 'emotional_landscape') setCurrentTab('emotional_landscape');
            else if (tab === 'ai_insights') setCurrentTab('ai_insights');
            else if (tab === 'discoveries') setCurrentTab('discoveries');
            else if (tab === 'memories') setCurrentTab('memories');
            else if (tab === 'summaries') setCurrentTab('summaries');
            else setCurrentTab(tab);
          }} 
        />
      </main>
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <BottomNav currentTab={currentTab} onNavigate={(tab) => {
            if (tab === 'history') setCurrentTab('history');
            else if (tab === 'new_chat') {
              handleNewSession();
            }
            else if (tab === 'settings') setCurrentTab('settings');
            else if (tab === 'profile') setCurrentTab('profile');
            else if (tab === 'home') {
              setActiveId(null);
              setCurrentTab('home');
            }
            else if (tab === 'journal') setCurrentTab('journal');
            else if (tab === 'emotional_landscape') setCurrentTab('emotional_landscape');
            else if (tab === 'ai_insights') setCurrentTab('ai_insights');
            else setCurrentTab(tab);
          }} />
        </div>

      
    </div>
  );
}
