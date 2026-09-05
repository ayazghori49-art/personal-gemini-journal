const fs = require('fs');
const file = 'src/components/layout/Sidebar.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/import { Home, MessageSquare, Compass, User as UserIcon, Plus, Settings, BarChart2 } from 'lucide-react';/,
"import { Home, MessageSquare, Compass, User as UserIcon, Plus, Settings, BarChart2, Bookmark } from 'lucide-react';");

code = code.replace(/    { id: 'history', label: 'Chat History', icon: MessageSquare },/,
"    { id: 'history', label: 'Chat History', icon: MessageSquare },\n    { id: 'saved_moments', label: 'Saved Moments', icon: Bookmark },");

fs.writeFileSync(file, code);

const file2 = 'src/components/layout/Drawer.tsx';
let code2 = fs.readFileSync(file2, 'utf8');
code2 = code2.replace(/import { Home, MessageSquare, Compass, User as UserIcon, Plus, Settings, X, BarChart2 } from 'lucide-react';/,
"import { Home, MessageSquare, Compass, User as UserIcon, Plus, Settings, X, BarChart2, Bookmark } from 'lucide-react';");

code2 = code2.replace(/    { id: 'history', label: 'Chat History', icon: MessageSquare },/,
"    { id: 'history', label: 'Chat History', icon: MessageSquare },\n    { id: 'saved_moments', label: 'Saved Moments', icon: Bookmark },");

fs.writeFileSync(file2, code2);
