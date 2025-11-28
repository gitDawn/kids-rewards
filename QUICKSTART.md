# Quick Start Guide / מדריך התחלה מהירה

## Hebrew / עברית

### שלב 1: צור פרויקט Firebase
1. לך ל-https://console.firebase.google.com/
2. לחץ "הוסף פרויקט"
3. תן שם לפרויקט (לדוגמה: "kids-rewards")
4. עקוב אחר השלבים

### שלב 2: הפעל Firestore
1. בקונסול Firebase, לחץ על "Firestore Database"
2. לחץ "Create database"
3. בחר "Start in test mode"
4. בחר מיקום ולחץ "Enable"

### שלב 3: הוסף Web App
1. בדף הבית של הפרויקט, לחץ על אייקון "<>" (Web)
2. תן שם לאפליקציה
3. **העתק את הקוד של `firebaseConfig`** - תצטרך אותו!

### שלב 4: עדכן את הקוד
1. פתח את הקובץ `app.js`
2. בשורות 7-13, החלף את `firebaseConfig` בקוד שקיבלת מ-Firebase
3. בשורה 17, שנה את הסיסמה מ-"1234" לסיסמה שלך

### שלב 5: פרוס את האתר

**אופציה א': Firebase Hosting (מומלץ)**
```bash
npm install -g firebase-tools
firebase login
cd kids-rewards-app
firebase init hosting
firebase deploy
```

**אופציה ב': בדיקה מקומית**
1. פתח את `index.html` בדפדפן
2. אם יש שגיאות CORS, השתמש בשרת מקומי:
```bash
python -m http.server 8000
# או
npx serve
```

### שלב 6: חבר דומיין (אופציונלי)
1. בקונסול Firebase, לך ל-"Hosting"
2. לחץ "Add custom domain"
3. הכנס `shaharmiller.com` או `rewards.shaharmiller.com`
4. עקוב אחר ההוראות להוספת רשומות DNS

---

## English

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name your project (e.g., "kids-rewards")
4. Follow the setup steps

### Step 2: Enable Firestore
1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode"
4. Select location and click "Enable"

### Step 3: Add Web App
1. On project homepage, click "</>" icon (Web)
2. Give your app a name
3. **Copy the `firebaseConfig` code** - you'll need it!

### Step 4: Update Code
1. Open `app.js` file
2. On lines 7-13, replace `firebaseConfig` with your Firebase config
3. On line 17, change password from "1234" to your password

### Step 5: Deploy

**Option A: Firebase Hosting (Recommended)**
```bash
npm install -g firebase-tools
firebase login
cd kids-rewards-app
firebase init hosting
firebase deploy
```

**Option B: Local Testing**
1. Open `index.html` in browser
2. If CORS errors occur, use a local server:
```bash
python -m http.server 8000
# or
npx serve
```

### Step 6: Connect Custom Domain (Optional)
1. In Firebase Console, go to "Hosting"
2. Click "Add custom domain"
3. Enter `shaharmiller.com` or `rewards.shaharmiller.com`
4. Follow instructions to add DNS records

---

## What to Change in app.js

Find these lines and update them:

**Lines 7-13:** Your Firebase Config
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",  // Change this
    authDomain: "YOUR_PROJECT.firebaseapp.com",  // Change this
    projectId: "YOUR_PROJECT_ID",  // Change this
    storageBucket: "YOUR_PROJECT.appspot.com",  // Change this
    messagingSenderId: "YOUR_SENDER_ID",  // Change this
    appId: "YOUR_APP_ID"  // Change this
};
```

**Line 17:** Admin Password
```javascript
const ADMIN_PASSWORD = "YOUR_PASSWORD";  // Change from "1234"
```

---

## Testing Locally Without Deployment

If you just want to test locally before deploying:

1. Update `app.js` with your Firebase config
2. Use a local server (required for ES modules):
   ```bash
   # If you have Python:
   python -m http.server 8000

   # Or use Node.js:
   npx serve
   ```
3. Open http://localhost:8000 in your browser

---

## Default Login

**Username:** Just click "כניסה למנהל" (Admin Login)
**Password:** `1234` (CHANGE THIS in app.js!)

---

## Need Help?

Check `README.md` for detailed instructions and troubleshooting!