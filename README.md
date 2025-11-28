# Kids Rewards System / מערכת נקודות ופרסים

A simple web application for tracking children's tasks and rewarding them with points that can be redeemed for prizes.

מערכת אינטרנט פשוטה למעקב אחר משימות ילדים ותגמול שלהם בנקודות שניתן להמיר לפרסים.

## Features / תכונות

- ✅ Track points for Ofer and Bar / מעקב נקודות עבור עופר ובר
- ✅ Admin panel for awarding points / פאנל ניהול להענקת נקודות
- ✅ Manage tasks and prizes / ניהול משימות ופרסים
- ✅ Prize request and approval system / מערכת בקשות ואישור פרסים
- ✅ Hebrew RTL support / תמיכה בעברית RTL
- ✅ Real-time updates with Firebase / עדכונים בזמן אמת עם Firebase

## Setup Instructions / הוראות התקנה

### Step 1: Create Firebase Project / יצירת פרויקט Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" / לחץ על "הוסף פרויקט"
3. Enter project name (e.g., "kids-rewards") / הכנס שם פרויקט
4. Follow the setup wizard / עקוב אחר אשף ההתקנה
5. Once created, click on the "Web" icon (</>) to add a web app / לאחר היצירה, לחץ על אייקון "Web"

### Step 2: Get Firebase Configuration / קבלת תצורת Firebase

After adding a web app, you'll see a `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### Step 3: Enable Firestore Database / הפעלת Firestore

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for now) / בחר "התחל במצב בדיקה"
4. Select a location / בחר מיקום
5. Click "Enable"

**Important Security Rules / כללי אבטחה חשובים:**
After setting up, go to "Rules" tab and update to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: true;
      allow write: if request.auth != null || true; // CHANGE THIS IN PRODUCTION!
    }
  }
}
```

⚠️ **Note:** These rules allow anyone to read/write. In production, implement proper authentication!

### Step 4: Update app.js / עדכון app.js

Open `app.js` and replace the `firebaseConfig` section (lines 7-13) with YOUR Firebase configuration:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### Step 5: Change Admin Password / שינוי סיסמת מנהל

In `app.js` line 17, change the default password:

```javascript
const ADMIN_PASSWORD = "YOUR_SECURE_PASSWORD"; // Change from "1234"
```

### Step 6: Deploy to Firebase Hosting / פריסה ל-Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase in your project folder:
```bash
cd kids-rewards-app
firebase init
```

Select:
- Hosting
- Use existing project (select your project)
- Public directory: `.` (current directory)
- Single page app: No
- Don't overwrite files

4. Deploy:
```bash
firebase deploy
```

5. Your site will be live at: `https://your-project.firebaseapp.com`

### Step 7: Connect Custom Domain / חיבור דומיין מותאם

1. In Firebase Console, go to "Hosting"
2. Click "Add custom domain"
3. Enter `shaharmiller.com`
4. Follow the instructions to add DNS records to your Google Sites domain settings
5. Wait for verification (can take up to 24 hours)

**Note:** If your domain is managed by Google Sites, you may need to:
- Go to Google Domains or your domain registrar
- Add the DNS records as instructed by Firebase
- You might need to use a subdomain like `rewards.shaharmiller.com` if the main domain is used by Google Sites

## Usage / שימוש

### For Kids / לילדים

1. Visit the website / בקר באתר
2. See your points balance / ראה את יתרת הנקודות שלך
3. View available tasks and prizes / צפה במשימות ופרסים זמינים
4. Click "בקש פרס" (Request Prize) to request a prize / לחץ על "בקש פרס" לבקש פרס
5. Enter your name when prompted / הכנס את שמך כשמתבקש
6. Wait for parent approval / המתן לאישור הורה

### For Admin (Parent) / למנהל (הורה)

1. Click "כניסה למנהל" (Admin Login)
2. Enter password / הכנס סיסמה
3. In admin panel, you can:
   - Award points for completed tasks / הענק נקודות עבור משימות שהושלמו
   - Add/delete tasks / הוסף/מחק משימות
   - Add/delete prizes / הוסף/מחק פרסים
   - Approve/deny prize requests / אשר/דחה בקשות לפרסים

## Default Data / נתונים התחלתיים

The app comes with default data:

**Children / ילדים:**
- עופר (Ofer) - 0 points
- בר (Bar) - 0 points

**Tasks / משימות:**
- פינוי מדיח (Emptying dishwasher) - 3 points
- לשים כלים במדיח (Loading dishes in dishwasher) - 4 points
- ניקוי חול חתולים (Cleaning cat litter) - 2 points
- תליית כביסה (Hanging laundry) - 3 points
- קיפול כביסה (Folding laundry) - 4 points
- השקיית אדניות (Watering plants) - 3 points
- לשים אוכל ומים לחתולים (Feeding cats) - 1 point
- להרוג יתוש (Killing a mosquito) - 5 points

**Prizes / פרסים:**
- 😴 ביטול שנת צהריים (Cancel afternoon nap) - 10 points
- 💰 עשרה שקלים דמי כיס (10 shekels pocket money) - 10 points
- 🍔 להזמין ממסעדה (Order from restaurant) - 100 points
- 🎬 לבחור סרט (Choose a movie) - 7 points
- 🎮 להחליט על משחק (Decide on a game) - 25 points
- 🚫 להתנגד למשחק או עשרה שקלים (Object to a game or 10 shekels) - 10 points

You can modify or delete these in the admin panel!

## Troubleshooting / פתרון בעיות

### "Firebase not configured" error
- Make sure you replaced the Firebase config in `app.js`
- Check that your Firebase project is created
- Verify Firestore is enabled

### Can't write to database
- Check Firestore security rules
- Make sure you're in test mode or have proper rules set up

### Site not loading
- Check browser console for errors (F12)
- Make sure you're using HTTPS (Firebase requires it)
- Verify all Firebase services are enabled

## Security Notes / הערות אבטחה

⚠️ **Important:** This is a basic implementation. For production:

1. Use Firebase Authentication instead of simple password
2. Update Firestore security rules to restrict write access
3. Add rate limiting
4. Use environment variables for sensitive data
5. Enable Firebase App Check

## Support / תמיכה

For issues or questions:
- Check Firebase Console for errors
- Review browser console logs
- Verify Firebase configuration
- Check Firestore rules

Enjoy rewarding your kids! / תהנו מלתגמל את הילדים שלכם!