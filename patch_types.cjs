const fs = require('fs');
const file = 'src/types.ts';
let code = fs.readFileSync(file, 'utf8');

const newTypes = `export interface SavedMoment {
  id: string;
  userId: string;
  createdAt: number;
  userMessage: string;
  aiMessage: string;
  summary: string;
}

export interface ChatSession {`;

code = code.replace('export interface ChatSession {', newTypes);
fs.writeFileSync(file, code);
