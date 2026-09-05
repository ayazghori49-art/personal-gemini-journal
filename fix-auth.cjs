const fs = require('fs');

function removeAuth(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  // Remove import
  code = code.replace(/import { auth } from '..\/..\/lib\/firebase';/g, '');
  
  // Replace user = auth.currentUser with a mock user
  code = code.replace(/const user = auth\.currentUser;/g, 'const user = { displayName: "Demo User", email: "user@example.com", photoURL: null };');
  
  // Analytics Insights View specifically uses auth
  if (file.includes('AnalyticsInsightsView.tsx')) {
    code = code.replace(/if \(!auth\.currentUser \|\| entries\.length === 0\) return;/g, 'if (entries.length === 0) return;');
    code = code.replace(/const token = await auth\.currentUser\.getIdToken\(\);/g, 'const token = "mock-token";');
  }
  
  fs.writeFileSync(file, code);
}

removeAuth('src/components/views/ProfileView.tsx');
removeAuth('src/components/views/ChatView.tsx');
removeAuth('src/components/views/HomeView.tsx');
removeAuth('src/components/views/AnalyticsInsightsView.tsx');
