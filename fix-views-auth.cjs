const fs = require('fs');

function restoreAuth(file) {
  if (!fs.existsSync(file)) return;
  let code = fs.readFileSync(file, 'utf8');
  
  // Replace the mock user with auth.currentUser
  code = code.replace(/const user = \{ displayName: "Demo User", email: "user@example\.com", photoURL: null \};/g, 'const user = auth.currentUser;');
  
  // Add the import back if not present
  if (!code.includes("import { auth }") && code.includes("auth.currentUser")) {
    code = `import { auth } from '../../lib/firebase';\n` + code;
  }
  
  // AnalyticsInsightsView specific
  if (file.includes('AnalyticsInsightsView.tsx')) {
    code = code.replace(/if \(entries\.length === 0\) return;/g, 'if (!auth.currentUser || entries.length === 0) return;');
    code = code.replace(/const token = "mock-token";/g, 'const token = await auth.currentUser.getIdToken();');
  }
  
  fs.writeFileSync(file, code);
}

restoreAuth('src/components/views/ProfileView.tsx');
restoreAuth('src/components/views/ChatView.tsx');
restoreAuth('src/components/views/HomeView.tsx');
restoreAuth('src/components/views/AnalyticsInsightsView.tsx');
