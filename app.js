// Firebase configuration - YOU NEED TO REPLACE THESE WITH YOUR FIREBASE PROJECT CREDENTIALS
console.log('🚀 App.js is loading...');
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, onSnapshot, setDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

console.log('📦 Firebase modules imported successfully');

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC9laW6FnaFb3l822aFC5_hfGD5fcK_FRY",
    authDomain: "kids-rewards-d37a9.firebaseapp.com",
    projectId: "kids-rewards-d37a9",
    storageBucket: "kids-rewards-d37a9.firebasestorage.app",
    messagingSenderId: "600926409502",
    appId: "1:600926409502:web:149b577049950a07c7af0f"
};

console.log('🔧 Initializing Firebase...');
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log('✅ Firebase initialized successfully');

// Admin password (in production, use Firebase Auth instead)
const ADMIN_PASSWORD = "1234"; // CHANGE THIS PASSWORD!

// State
let isAdmin = false;
let children = [];
let tasks = [];
let prizes = [];
let prizeRequests = [];
let purchaseHistory = [];
let activityHistory = [];

// DOM Elements
const loginModal = document.getElementById('loginModal');
const adminPanel = document.getElementById('adminPanel');
const mainContent = document.getElementById('mainContent');
const adminToggle = document.getElementById('adminToggle');
const loginBtn = document.getElementById('loginBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const adminPassword = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');

// Initialize app
async function initApp() {
    console.log('🏁 Starting app initialization...');
    await initializeDatabase();
    loadData();
    setupEventListeners();
    console.log('✅ App initialization complete!');
}

// Initialize database with default data
async function initializeDatabase() {
    try {
        // Check if children exist
        const childrenSnapshot = await getDocs(collection(db, 'children'));
        if (childrenSnapshot.empty) {
            // Add Ofer and Bar
            await addDoc(collection(db, 'children'), {
                name: 'עופר',
                points: 0
            });
            await addDoc(collection(db, 'children'), {
                name: 'בר',
                points: 0
            });
            console.log('Children initialized');
        }

        // Check if default tasks exist
        const tasksSnapshot = await getDocs(collection(db, 'tasks'));
        if (tasksSnapshot.empty) {
            // Add household tasks
            const defaultTasks = [
                { name: 'פינוי מדיח', points: 3 },
                { name: 'לשים כלים במדיח', points: 4 },
                { name: 'ניקוי חול חתולים', points: 2 },
                { name: 'תליית כביסה', points: 3 },
                { name: 'קיפול כביסה', points: 4 },
                { name: 'השקיית אדניות', points: 3 },
                { name: 'לשים אוכל ומים לחתולים', points: 1 },
                { name: 'להרוג יתוש', points: 5 }
            ];
            for (const task of defaultTasks) {
                await addDoc(collection(db, 'tasks'), task);
            }
            console.log('Tasks initialized');
        }

        // Check if default prizes exist
        const prizesSnapshot = await getDocs(collection(db, 'prizes'));
        if (prizesSnapshot.empty) {
            // Add prize shop items
            const defaultPrizes = [
                { name: 'ביטול שנת צהריים', cost: 10, icon: '😴' },
                { name: 'עשרה שקלים דמי כיס', cost: 10, icon: '💰' },
                { name: 'להזמין ממסעדה', cost: 100, icon: '🍔' },
                { name: 'לבחור סרט', cost: 7, icon: '🎬' },
                { name: 'להחליט על משחק', cost: 25, icon: '🎮' },
                { name: 'להתנגד למשחק או עשרה שקלים', cost: 10, icon: '🚫' }
            ];
            for (const prize of defaultPrizes) {
                await addDoc(collection(db, 'prizes'), prize);
            }
            console.log('Prizes initialized');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Load data from Firebase
function loadData() {
    // Listen to children changes
    onSnapshot(collection(db, 'children'), (snapshot) => {
        children = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderKidsPoints();
        renderChildSelect();
    });

    // Listen to tasks changes
    onSnapshot(collection(db, 'tasks'), (snapshot) => {
        tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTasks();
        renderTaskSelect();
        renderAdminTasks();
    });

    // Listen to prizes changes
    onSnapshot(collection(db, 'prizes'), (snapshot) => {
        prizes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPrizes();
        renderAdminPrizes();
    });

    // Listen to prize requests changes (legacy)
    onSnapshot(collection(db, 'prizeRequests'), (snapshot) => {
        prizeRequests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPrizeRequests();
        renderAdminPrizeRequests();
    });

    // Listen to purchase history changes
    onSnapshot(collection(db, 'purchaseHistory'), (snapshot) => {
        purchaseHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPurchaseHistory();
        if (isAdmin) {
            showNewPurchaseNotification();
        }
    });

    // Listen to activity history changes
    onSnapshot(collection(db, 'activityHistory'), (snapshot) => {
        activityHistory = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderActivityHistory();
        renderPublicActivityHistory();
    });
}

// Setup event listeners
function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    adminToggle.addEventListener('click', () => {
        if (isAdmin) {
            logout();
        } else {
            loginModal.classList.remove('hidden');
        }
    });

    loginBtn.addEventListener('click', login);
    cancelLoginBtn.addEventListener('click', () => {
        loginModal.classList.add('hidden');
        loginError.classList.add('hidden');
        adminPassword.value = '';
    });

    logoutBtn.addEventListener('click', logout);

    // Admin actions
    document.getElementById('awardPointsBtn').addEventListener('click', awardPoints);
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('addPrizeBtn').addEventListener('click', addPrize);

    // Allow Enter key to submit password
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            login();
        }
    });

    // Navigation between screens
    document.getElementById('goToShop').addEventListener('click', () => showScreen('shop'));
    document.getElementById('goToTasks').addEventListener('click', () => showScreen('tasks'));
    document.getElementById('backFromShop').addEventListener('click', () => showScreen('home'));
    document.getElementById('backFromTasks').addEventListener('click', () => showScreen('home'));
}

// Navigation
function showScreen(screen) {
    const homeScreen = document.getElementById('homeScreen');
    const shopScreen = document.getElementById('shopScreen');
    const tasksScreen = document.getElementById('tasksScreen');

    homeScreen.classList.add('hidden');
    shopScreen.classList.add('hidden');
    tasksScreen.classList.add('hidden');

    switch(screen) {
        case 'home':
            homeScreen.classList.remove('hidden');
            break;
        case 'shop':
            shopScreen.classList.remove('hidden');
            break;
        case 'tasks':
            tasksScreen.classList.remove('hidden');
            break;
    }
}

// Authentication
function login() {
    const password = adminPassword.value;
    if (password === ADMIN_PASSWORD) {
        isAdmin = true;
        loginModal.classList.add('hidden');
        document.getElementById('homeScreen').classList.add('hidden');
        document.getElementById('shopScreen').classList.add('hidden');
        document.getElementById('tasksScreen').classList.add('hidden');
        adminPanel.classList.remove('hidden');
        adminToggle.textContent = 'חזרה למסך הראשי';
        adminPassword.value = '';
        loginError.classList.add('hidden');
    } else {
        loginError.classList.remove('hidden');
    }
}

function logout() {
    isAdmin = false;
    adminPanel.classList.add('hidden');
    showScreen('home');
    adminToggle.textContent = 'כניסה למנהל';
}

// Render kids points
function renderKidsPoints() {
    const container = document.getElementById('kidsPoints');
    container.innerHTML = children.map(child => `
        <div class="kid-card">
            <h3>${child.name}</h3>
            <div class="points">${child.points}</div>
            <div class="label">נקודות</div>
        </div>
    `).join('');
    renderSidebarPoints();
}

// Render sidebar points
function renderSidebarPoints() {
    const container = document.getElementById('sidebarPoints');
    if (!container) return;
    container.innerHTML = children.map(child => `
        <div class="sidebar-kid">
            <div class="sidebar-kid-name">${child.name}</div>
            <div class="sidebar-kid-points">${child.points}</div>
        </div>
    `).join('');
}

// Render tasks table
function renderTasks() {
    const container = document.getElementById('tasksList');
    if (tasks.length === 0) {
        container.innerHTML = '<p>אין משימות זמינות</p>';
        return;
    }
    container.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>משימה</th>
                    <th>נקודות</th>
                </tr>
            </thead>
            <tbody>
                ${tasks.map(task => `
                    <tr>
                        <td>${task.name}</td>
                        <td>${task.points}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Render prizes table
function renderPrizes() {
    const container = document.getElementById('prizesList');
    if (prizes.length === 0) {
        container.innerHTML = '<p>אין פרסים זמינים</p>';
        return;
    }
    container.innerHTML = `
        <div class="shop-grid">
            ${prizes.map(prize => `
                <div class="prize-card">
                    <div class="prize-icon">${prize.icon || '🎁'}</div>
                    <div class="prize-name">${prize.name}</div>
                    <div class="prize-cost">
                        <span class="cost-number">${prize.cost}</span>
                        <span class="cost-label">נקודות</span>
                    </div>
                    <button class="buy-btn" onclick="requestPrize('${prize.id}', '${prize.name}', ${prize.cost})">
                        🛒 קנה עכשיו!
                    </button>
                </div>
            `).join('')}
        </div>
    `;
}

// Buy prize (auto-deduct points with password protection)
window.requestPrize = async function(prizeId, prizeName, prizeCost) {
    const childName = prompt('מי קונה את הפרס? הכנס את שמך:');
    if (!childName) return;

    const child = children.find(c => c.name === childName);
    if (!child) {
        alert('שם לא נמצא במערכת');
        return;
    }

    // Password protection
    const password = prompt(`${child.name}, הכנס את הסיסמה שלך:`);
    const correctPassword = child.name === 'עופר' ? '1234' : '2014';

    if (password !== correctPassword) {
        alert('❌ סיסמה שגויה!');
        return;
    }

    if (child.points < prizeCost) {
        alert(`😢 אין מספיק נקודות!\nיש לך ${child.points} נקודות\nהפרס עולה ${prizeCost} נקודות\nעוד ${prizeCost - child.points} נקודות וזה שלך!`);
        return;
    }

    if (!confirm(`🛒 לקנות ${prizeName} עבור ${prizeCost} נקודות?\n\nיישאר לך: ${child.points - prizeCost} נקודות`)) {
        return;
    }

    try {
        // Deduct points immediately
        await updateDoc(doc(db, 'children', child.id), {
            points: child.points - prizeCost
        });

        const now = new Date();
        const timestampISO = now.toISOString();
        const date = now.toLocaleDateString('he-IL');
        const time = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

        // Create purchase history for admin
        await addDoc(collection(db, 'purchaseHistory'), {
            childId: child.id,
            childName: child.name,
            prizeId: prizeId,
            prizeName: prizeName,
            prizeCost: prizeCost,
            timestamp: timestampISO,
            date: date,
            time: time,
            viewed: false
        });

        // Log to activity history
        await addDoc(collection(db, 'activityHistory'), {
            type: 'prize_purchased',
            childId: child.id,
            childName: child.name,
            prizeId: prizeId,
            prizeName: prizeName,
            points: -prizeCost,
            timestamp: timestampISO,
            date: date,
            time: time
        });

        alert(`🎉 כל הכבוד ${child.name}!\n\nקנית: ${prizeName}\nנוכו: ${prizeCost} נקודות\nנשאר לך: ${child.points - prizeCost} נקודות`);
    } catch (error) {
        console.error('Error purchasing prize:', error);
        alert('אירעה שגיאה');
    }
}

// Render purchase history (public view - show recent purchases)
function renderPurchaseHistory() {
    const container = document.getElementById('prizeRequests');
    const recentPurchases = [...purchaseHistory].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    ).slice(0, 5);

    if (recentPurchases.length === 0) {
        container.innerHTML = '<p>עדיין לא נרכשו פרסים</p>';
        return;
    }

    container.innerHTML = recentPurchases.map(purchase => {
        const date = new Date(purchase.timestamp);
        const timeAgo = getTimeAgo(date);
        return `
        <div class="purchase-item animate-in">
            <div class="purchase-header">
                <div>
                    <strong>🎉 ${purchase.childName}</strong> קנה/תה: <strong>${purchase.prizeName}</strong>
                </div>
                <div class="time-ago">${timeAgo}</div>
            </div>
            <div class="purchase-details">
                <span class="points-badge">-${purchase.prizeCost} נקודות</span>
            </div>
        </div>
    `}).join('');
}

// Helper: Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'עכשיו';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `לפני ${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    const days = Math.floor(hours / 24);
    return `לפני ${days} ימים`;
}

// Show new purchase notification for admin
function showNewPurchaseNotification() {
    const newPurchases = purchaseHistory.filter(p => !p.viewed);
    if (newPurchases.length > 0 && isAdmin) {
        const badge = document.getElementById('purchaseBadge');
        if (badge) {
            badge.textContent = newPurchases.length;
            badge.style.display = 'inline-block';
        }
    }
}

// Legacy: Render prize requests (for backwards compatibility)
function renderPrizeRequests() {
    // Just call renderPurchaseHistory instead
    renderPurchaseHistory();
}

// Admin: Render child select
function renderChildSelect() {
    const select = document.getElementById('childSelect');
    select.innerHTML = '<option value="">בחר ילד</option>' +
        children.map(child => `<option value="${child.id}">${child.name}</option>`).join('');
    renderAdminChildren();
}

// Admin: Render children list
function renderAdminChildren() {
    const container = document.getElementById('adminChildrenList');
    if (!container) return;
    container.innerHTML = children.map(child => `
        <div class="admin-item">
            <span>${child.name} - ${child.points} נקודות</span>
            <button class="delete-btn" onclick="deleteChild('${child.id}')">מחק</button>
        </div>
    `).join('');
}

// Admin: Render task select
function renderTaskSelect() {
    const select = document.getElementById('taskSelect');
    select.innerHTML = '<option value="">בחר משימה</option>' +
        tasks.map(task => `<option value="${task.id}">${task.name} (${task.points} נקודות)</option>`).join('');
}

// Admin: Award points
async function awardPoints() {
    const childId = document.getElementById('childSelect').value;
    const taskId = document.getElementById('taskSelect').value;

    if (!childId || !taskId) {
        alert('נא לבחור ילד ומשימה');
        return;
    }

    const child = children.find(c => c.id === childId);
    const task = tasks.find(t => t.id === taskId);

    try {
        // Update child points
        await updateDoc(doc(db, 'children', childId), {
            points: child.points + task.points
        });

        // Log to activity history
        await addDoc(collection(db, 'activityHistory'), {
            type: 'points_awarded',
            childId: child.id,
            childName: child.name,
            taskId: task.id,
            taskName: task.name,
            points: task.points,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('he-IL'),
            time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        });

        alert(`${task.points} נקודות נוספו ל-${child.name}!`);
    } catch (error) {
        console.error('Error awarding points:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Add task
async function addTask() {
    const name = document.getElementById('taskName').value;
    const points = parseInt(document.getElementById('taskPoints').value);

    if (!name || !points) {
        alert('נא למלא את כל השדות');
        return;
    }

    try {
        await addDoc(collection(db, 'tasks'), { name, points });
        document.getElementById('taskName').value = '';
        document.getElementById('taskPoints').value = '';
        alert('משימה נוספה!');
    } catch (error) {
        console.error('Error adding task:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Add prize
async function addPrize() {
    const name = document.getElementById('prizeName').value;
    const cost = parseInt(document.getElementById('prizeCost').value);
    const icon = document.getElementById('prizeIcon').value || '🎁';

    if (!name || !cost) {
        alert('נא למלא את כל השדות');
        return;
    }

    try {
        await addDoc(collection(db, 'prizes'), { name, cost, icon });
        document.getElementById('prizeName').value = '';
        document.getElementById('prizeCost').value = '';
        document.getElementById('prizeIcon').value = '';
        alert('פרס נוסף!');
    } catch (error) {
        console.error('Error adding prize:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Render tasks list
function renderAdminTasks() {
    const container = document.getElementById('adminTasksList');
    container.innerHTML = tasks.map(task => `
        <div class="admin-item">
            <span>${task.name} - ${task.points} נקודות</span>
            <button class="delete-btn" onclick="deleteTask('${task.id}')">מחק</button>
        </div>
    `).join('');
}

// Admin: Render prizes list
function renderAdminPrizes() {
    const container = document.getElementById('adminPrizesList');
    container.innerHTML = prizes.map(prize => `
        <div class="admin-item">
            <span>${prize.icon || '🎁'} ${prize.name} - ${prize.cost} נקודות</span>
            <button class="delete-btn" onclick="deletePrize('${prize.id}')">מחק</button>
        </div>
    `).join('');
}

// Admin: Delete task
window.deleteTask = async function(taskId) {
    if (!confirm('האם למחוק את המשימה?')) return;
    try {
        await deleteDoc(doc(db, 'tasks', taskId));
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Delete prize
window.deletePrize = async function(prizeId) {
    if (!confirm('האם למחוק את הפרס?')) return;
    try {
        await deleteDoc(doc(db, 'prizes', prizeId));
    } catch (error) {
        console.error('Error deleting prize:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Delete child
window.deleteChild = async function(childId) {
    const child = children.find(c => c.id === childId);
    if (!confirm(`האם למחוק את ${child.name}?`)) return;
    try {
        await deleteDoc(doc(db, 'children', childId));
        alert(`${child.name} נמחק בהצלחה`);
    } catch (error) {
        console.error('Error deleting child:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Render prize requests
function renderAdminPrizeRequests() {
    const container = document.getElementById('adminPrizeRequests');

    const sortedPurchases = [...purchaseHistory].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    if (sortedPurchases.length === 0) {
        container.innerHTML = '<p>עדיין לא נרכשו פרסים</p>';
        return;
    }

    container.innerHTML = sortedPurchases.map(purchase => {
        const date = new Date(purchase.timestamp);
        const timeAgo = getTimeAgo(date);
        const isNew = !purchase.viewed;
        return `
        <div class="purchase-item ${isNew ? 'new-purchase' : ''} animate-in">
            <div class="purchase-header">
                <div>
                    ${isNew ? '<span class="new-badge">🆕 חדש!</span> ' : ''}
                    <strong>${purchase.childName}</strong> קנה/תה: <strong>${purchase.prizeName}</strong>
                </div>
                <div class="time-ago">${timeAgo}</div>
            </div>
            <div class="purchase-details">
                <span class="points-badge">-${purchase.prizeCost} נקודות</span>
                ${isNew ? `<button class="mark-viewed-btn" onclick="markAsViewed('${purchase.id}')">✓ סימן כנקרא</button>` : '<span class="viewed-label">✓ נצפה</span>'}
            </div>
        </div>
    `}).join('');
}

// Mark purchase as viewed
window.markAsViewed = async function(purchaseId) {
    try {
        await updateDoc(doc(db, 'purchaseHistory', purchaseId), {
            viewed: true
        });
    } catch (error) {
        console.error('Error marking as viewed:', error);
    }
}

function getStatusText(status) {
    switch(status) {
        case 'pending': return 'ממתין';
        case 'approved': return 'אושר';
        case 'denied': return 'נדחה';
        default: return status;
    }
}

// Admin: Approve request
window.approveRequest = async function(requestId, childId, prizeCost) {
    const child = children.find(c => c.id === childId);

    if (child.points < prizeCost) {
        alert('לילד אין מספיק נקודות!');
        return;
    }

    try {
        // Update request status
        await updateDoc(doc(db, 'prizeRequests', requestId), {
            status: 'approved'
        });

        // Deduct points
        await updateDoc(doc(db, 'children', childId), {
            points: child.points - prizeCost
        });

        alert('הבקשה אושרה והנקודות נוכו!');
    } catch (error) {
        console.error('Error approving request:', error);
        alert('אירעה שגיאה');
    }
}

// Admin: Deny request
window.denyRequest = async function(requestId) {
    if (!confirm('האם לדחות את הבקשה?')) return;

    try {
        await updateDoc(doc(db, 'prizeRequests', requestId), {
            status: 'denied'
        });
        alert('הבקשה נדחתה');
    } catch (error) {
        console.error('Error denying request:', error);
        alert('אירעה שגיאה');
    }
}

// Render activity history (admin panel - full history)
function renderActivityHistory() {
    const container = document.getElementById('activityHistoryList');

    if (!container) return;

    const sortedHistory = [...activityHistory].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    if (sortedHistory.length === 0) {
        container.innerHTML = '<p>אין פעילות עדיין</p>';
        return;
    }

    container.innerHTML = `
        <div class="history-container">
            ${sortedHistory.map(activity => {
                const icon = activity.type === 'points_awarded' ? '⭐' : '🎁';
                const actionText = activity.type === 'points_awarded'
                    ? `קיבל/ה ${activity.points} נקודות עבור: ${activity.taskName}`
                    : `קנה/תה את: ${activity.prizeName} (${activity.points} נקודות)`;
                const pointsClass = activity.type === 'points_awarded' ? 'points-positive' : 'points-negative';
                const pointsDisplay = activity.type === 'points_awarded'
                    ? `+${activity.points}`
                    : `${activity.points}`;

                return `
                    <div class="history-item">
                        <div class="history-icon">${icon}</div>
                        <div class="history-details">
                            <div class="history-main">
                                <strong>${activity.childName}</strong> ${actionText}
                            </div>
                            <div class="history-time">
                                📅 ${activity.date} | ⏰ ${activity.time}
                            </div>
                        </div>
                        <div class="history-points ${pointsClass}">
                            ${pointsDisplay}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render public activity history (tasks screen - recent 15 items)
function renderPublicActivityHistory() {
    const container = document.getElementById('publicActivityHistory');

    if (!container) return;

    const sortedHistory = [...activityHistory]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 15); // Show only recent 15 items

    if (sortedHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">אין פעילות עדיין - התחילו לצבור נקודות!</p>';
        return;
    }

    container.innerHTML = `
        <div class="history-container">
            ${sortedHistory.map(activity => {
                const icon = activity.type === 'points_awarded' ? '⭐' : '🎁';
                const actionText = activity.type === 'points_awarded'
                    ? `קיבל/ה ${activity.points} נקודות עבור: ${activity.taskName}`
                    : `קנה/תה את: ${activity.prizeName} (${activity.points} נקודות)`;
                const pointsClass = activity.type === 'points_awarded' ? 'points-positive' : 'points-negative';
                const pointsDisplay = activity.type === 'points_awarded'
                    ? `+${activity.points}`
                    : `${activity.points}`;

                return `
                    <div class="history-item">
                        <div class="history-icon">${icon}</div>
                        <div class="history-details">
                            <div class="history-main">
                                <strong>${activity.childName}</strong> ${actionText}
                            </div>
                            <div class="history-time">
                                📅 ${activity.date} | ⏰ ${activity.time}
                            </div>
                        </div>
                        <div class="history-points ${pointsClass}">
                            ${pointsDisplay}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Start the app
console.log('🌟 Starting Kids Rewards App...');
initApp();