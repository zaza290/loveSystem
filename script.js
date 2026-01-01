import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getDatabase, ref as dbRef, push, onValue } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Floating hearts + stars
function createFloatingElements() {
    const container = document.getElementById('floating-elements');
    for (let i = 0; i < 60; i++) {
        const el = document.createElement('div');
        el.classList.add('floaty');
        el.innerHTML = Math.random() > 0.65 ? '✨' : Math.random() > 0.3 ? '💗' : '♡';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDelay = Math.random() * 14 + 's';
        el.style.fontSize = (14 + Math.random() * 28) + 'px';
        container.appendChild(el);
    }
}

// Countdown
function updateCountdown(anniversaryDate) {
    const el = document.getElementById('countdown');
    const next = new Date(anniversaryDate);
    const now = new Date();
    next.setFullYear(now.getFullYear());
    if (next < now) next.setFullYear(now.getFullYear() + 1);
    const days = Math.ceil((next - now) / (1000 * 60 * 60 * 24));
    el.textContent = `Days until our next anniversary: ${days}`;
}

// Music control
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
musicToggle.addEventListener('click', () => {
    if (bgMusic.paused || bgMusic.muted) {
        bgMusic.muted = false;
        bgMusic.play().catch(() => {});
        musicToggle.textContent = 'Pause Our Melody ♫';
    } else {
        bgMusic.pause();
        musicToggle.textContent = 'Play Our Melody ♫';
    }
});

// Tabs
document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Gift surprise
const messages = [
    "You still make my heart skip like it's our first moment together 💓",
    "Thank you for being my safe place, my joy, my everything",
    "I fall deeper in love with you with every sunrise",
    "You're still the best part of every single one of my days",
    "Forever with you still feels like the most beautiful promise"
];

const giftBox = document.getElementById('giftBox');
const surpriseEl = document.getElementById('surpriseMessage');
const resetBtn = document.getElementById('resetButton');

giftBox.addEventListener('click', () => {
    const msg = messages[Math.floor(Math.random() * messages.length)];
    surpriseEl.textContent = msg;
    giftBox.style.display = 'none';
    resetBtn.style.display = 'block';
});

resetBtn.addEventListener('click', () => {
    surpriseEl.textContent = '';
    giftBox.style.display = 'block';
    resetBtn.style.display = 'none';
});

// Memories (Firebase)
function loadMemories() {
    const list = document.getElementById('memoryList');
    onValue(dbRef(database, 'memories'), (snap) => {
        list.innerHTML = '';
        snap.forEach(child => {
            const li = document.createElement('li');
            li.textContent = child.val().message;
            list.appendChild(li);
        });
    });
}

document.getElementById('customForm').addEventListener('submit', e => {
    e.preventDefault();
    const msg = document.getElementById('customMessage').value.trim();
    if (msg) {
        push(dbRef(database, 'memories'), { message: msg, created: Date.now() });
        e.target.reset();
    }
});

// Init
window.addEventListener('load', () => {
    createFloatingElements();
    updateCountdown('2024-02-14'); // ← change to your real anniversary date
    loadMemories();
    // Music starts after first tap (mobile browsers)
    document.body.addEventListener('click', () => {
        if (bgMusic.muted) {
            bgMusic.muted = false;
            bgMusic.play().catch(() => {});
        }
    }, { once: true });
});