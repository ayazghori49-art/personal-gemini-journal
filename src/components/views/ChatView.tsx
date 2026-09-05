import { auth } from '../../lib/firebase';
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, JournalEntry } from '../../types';
import { Mic, MicOff, Paperclip, Send, X, Loader2, Sparkles, User as UserIcon, Plus, Image as ImageIcon, File as FileIcon, Video as VideoIcon, Bookmark, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';
import { useSavedMoments } from '../../hooks/useSavedMoments';


interface ChatViewProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string, attachments: any[]) => void;
  isRecording: boolean;
  onToggleMic: () => void;
  persona: string;
  hideHeader?: boolean;
}

export function ChatView({ messages, isLoading, onSendMessage, isRecording, onToggleMic, persona, hideHeader = false , lang = 'en'}: ChatViewProps & {lang?: string}) {
  const [input, setInput] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachments, setAttachments] = useState<{mimeType: string, data: string, name: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { savedMoments, saveMoment, removeMoment, getMomentId } = useSavedMoments();
  const [savingMoments, setSavingMoments] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let imageCount = attachments.filter(a => a.mimeType.startsWith('image/')).length;
    let videoCount = attachments.filter(a => a.mimeType.startsWith('video/')).length;

    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        if (imageCount >= 5) { alert('Maximum 5 images allowed.'); return; }
        imageCount++;
      } else if (file.type.startsWith('video/')) {
        if (videoCount >= 1) { alert('Maximum 1 video allowed.'); return; }
        if (file.size > 20 * 1024 * 1024) { alert('Video size must be less than 20MB.'); return; }
        videoCount++;
      } else if (file.type === 'application/pdf' || file.type.startsWith('text/')) {
        if (file.size > 10 * 1024 * 1024) { alert('Document size must be less than 10MB.'); return; }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setAttachments(prev => [...prev, { mimeType: file.type, data: reader.result as string, name: file.name }]);
      };
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;
    onSendMessage(input, attachments);
    setInput('');
    setAttachments([]);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      {/* Header */}
      {!hideHeader && (
        <div className="h-16 flex items-center justify-between px-6 shrink-0 bg-white/40 dark:bg-[#0D0D12]/60 backdrop-blur-2xl backdrop-blur-md z-10 sticky top-0 border-b border-stone-200/50 dark:border-stone-800/50">
          <div className="flex-1 flex items-center justify-center"><h2 className="font-medium text-slate-900 dark:text-slate-100">{persona}</h2></div><div className="w-10"></div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-8 custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && !hideHeader && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto px-4 opacity-60">
            <div className="w-16 h-16 bg-white dark:bg-[#1A1A24] shadow-sm border border-stone-100 dark:border-stone-800 rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-stone-400" />
            </div>
            <p className="font-serif text-xl font-medium text-slate-800 dark:text-slate-200 mb-2">A blank page awaits</p>
            <p className="text-stone-500">Share your thoughts, feelings, or ask a question. This is your safe space.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={cn("flex max-w-3xl mx-auto gap-4", m.role === 'user' ? "flex-row-reverse" : "")}>
            <div className="shrink-0 mt-1">
              {m.role === 'model' ? (
                <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-stone-100 dark:text-stone-900" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl overflow-hidden bg-stone-200 dark:bg-stone-800 border border-stone-100 dark:border-stone-800 flex items-center justify-center shadow-sm">
                  {user?.photoURL ? <img src={user.photoURL} alt="User" /> : <UserIcon className="w-5 h-5 text-stone-400" />}
                </div>
              )}
            </div>
            <div className={cn(
              "flex flex-col gap-2 max-w-[85%]",
              m.role === 'user' ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "px-6 py-4",
                m.role === 'user' 
                  ? "bg-violet-600 dark:bg-violet-500 text-white rounded-3xl rounded-tr-md shadow-sm" 
                  : "premium-card text-slate-800 dark:text-slate-200 rounded-tl-md"
              )}>
                {m.role === 'user' ? (
                   <div className="whitespace-pre-wrap text-[15px]">{m.text}</div>
                ) : (
                   <div className="flex flex-col gap-2">
                     <div className="markdown-body">
                       <ReactMarkdown>{m.text}</ReactMarkdown>
                     </div>
                     {m.text && messages[i-1] && messages[i-1].role === 'user' && (() => {
                       const userMsgText = messages[i-1].text;
                       const momentId = getMomentId(userMsgText, m.text);
                       const isSaved = momentId && savedMoments.some(s => s.id === momentId);
                       const isSaving = momentId && savingMoments[momentId];
                       return (
                         <button 
                           onClick={async () => {
                             if (!momentId) return;
                             setSavingMoments(prev => ({...prev, [momentId]: true}));
                             if (isSaved) {
                               await removeMoment(momentId);
                             } else {
                               await saveMoment(userMsgText, m.text);
                             }
                             setSavingMoments(prev => ({...prev, [momentId]: false}));
                           }}
                           disabled={isSaving}
                           className="flex items-center gap-1.5 px-3 py-1.5 mt-2 rounded-lg text-xs font-medium transition-colors border border-transparent shadow-sm bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 hover:border-stone-300 dark:hover:border-stone-600 disabled:opacity-50"
                         >
                           {isSaving ? (
                             <Loader2 className="w-3.5 h-3.5 animate-spin" />
                           ) : isSaved ? (
                             <>
                               <Check className="w-3.5 h-3.5 text-violet-500" />
                               <span className="text-violet-600 dark:text-violet-400">Saved</span>
                             </>
                           ) : (
                             <>
                               <Bookmark className="w-3.5 h-3.5" />
                               <span>Save</span>
                             </>
                           )}
                         </button>
                       );
                     })()}
                   </div>
                )}
                
                {m.attachments && m.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {m.attachments.map((att, idx) => (
                      att.mimeType.startsWith('image/') ? (
                        <img key={idx} src={att.data} alt="attachment" className="rounded-lg max-w-[200px] max-h-[200px] object-cover shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : att.mimeType.startsWith('video/') ? (
                        <video key={idx} src={att.data} controls className="rounded-lg max-w-[250px] shadow-sm border border-slate-200 dark:border-slate-700" />
                      ) : att.mimeType.startsWith('audio/') ? (
                        <audio key={idx} src={att.data} controls className="max-w-[200px] h-10" />
                      ) : (
                        <div key={idx} className="bg-white/20 rounded-lg p-2 px-3 text-xs flex items-center font-medium border border-slate-200/20">
                           📄 {att.name || 'Document'}
                        </div>
                      )
                    ))}
                  </div>
                )}
                {m.imageUrl && (
                  <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900 p-2">
                    <img src={m.imageUrl} alt="Generated visual" className="rounded-lg max-w-full shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex max-w-3xl mx-auto gap-4">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 dark:bg-stone-900 flex items-center justify-center shadow-sm shrink-0 mt-1">
              <Sparkles className="w-4 h-4 text-stone-100 dark:text-stone-900" />
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] border border-stone-100 dark:border-stone-800/50 shadow-xl shadow-stone-200/50 dark:shadow-none px-5 py-4 rounded-[1.5rem] px-6 py-4 rounded-3xl rounded-tl-md flex items-center gap-2 text-stone-500 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-sm font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="p-4 sm:p-6 bg-transparent pb-safe pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[1.5rem] px-6 py-4 p-2 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-all flex flex-col gap-2">
            
            {attachments.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 border-b border-slate-200 dark:border-slate-800/50">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 pr-3 max-w-[200px] shadow-sm">
                    {att.mimeType.startsWith('image/') ? (
                      <img src={att.data} alt="attachment" className="w-7 h-7 object-cover rounded mr-2" />
                    ) : (
                      <div className="w-7 h-7 bg-slate-100 dark:bg-slate-700 text-stone-500 rounded mr-2 flex items-center justify-center text-[9px] font-bold">DOC</div>
                    )}
                    <span className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium">{att.name}</span>
                    <button 
                      onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -right-2 bg-red-500 text-stone-100 dark:text-stone-900 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-end gap-2">
              <div className="relative">
                <input type="file" multiple accept="image/*,video/*,application/pdf,text/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <button onClick={() => setShowAttachMenu(!showAttachMenu)} className="p-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors shrink-0 relative">
                  <Plus className={cn("w-5 h-5 transition-transform", showAttachMenu ? "rotate-45" : "")} />
                </button>
                {showAttachMenu && (
                  <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg p-2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
                    <button onClick={() => { fileInputRef.current?.setAttribute('accept', 'image/*'); fileInputRef.current?.click(); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                      <ImageIcon className="w-4 h-4" /> Image
                    </button>
                    <button onClick={() => { fileInputRef.current?.setAttribute('accept', 'application/pdf,text/*'); fileInputRef.current?.click(); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                      <FileIcon className="w-4 h-4" /> File
                    </button>
                    <button onClick={() => { fileInputRef.current?.setAttribute('accept', 'video/*'); fileInputRef.current?.click(); setShowAttachMenu(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
                      <VideoIcon className="w-4 h-4" /> Video
                    </button>
                  </div>
                )}
              </div>
              
              <button onClick={onToggleMic} className={cn(
                "p-2.5 rounded-xl transition-colors shrink-0",
                isRecording ? "bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400 animate-pulse" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800"
              )}>
                {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                }}
                placeholder={isRecording ? "Listening..." : "Write your thoughts here..."}
                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-3 px-2 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                rows={1}
              />

              <button 
                onClick={handleSend}
                disabled={(!input.trim() && attachments.length === 0) || isLoading}
                className="p-3 m-1 bg-violet-600 dark:bg-violet-500 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 shadow-md"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
