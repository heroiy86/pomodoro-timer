let time = 25 * 60; // 25分を秒に変換
let isRunning = false;
let timerId;
let currentMode = 'work';
let sessionCount = 1;
let workTime = 25; // 作業時間（分）
let isAutoMode = false; // 自動連続モードの状態

const timeDisplay = document.querySelector('.time-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const sessionCountElement = document.getElementById('session-count');
const modeButtons = document.querySelectorAll('.mode-btn');
const workTimeInput = document.getElementById('work-time-input');
const autoModeCheckbox = document.getElementById('auto-mode');

// 自動連続モードの切り替え
autoModeCheckbox.addEventListener('change', () => {
    isAutoMode = autoModeCheckbox.checked;
});

// 作業時間の変更を監視
workTimeInput.addEventListener('change', (e) => {
    const newTime = parseInt(e.target.value);
    if (newTime >= 1 && newTime <= 120) {
        workTime = newTime;
        if (currentMode === 'work') {
            time = workTime * 60;
            updateDisplay();
        }
    }
});

// モードと対応する時間（秒）
const modeTimes = {
    'work': workTime * 60,     // 作業モード: 設定された時間
    'short-break': 5 * 60,     // 短い休憩: 5分
    'long-break': 15 * 60      // 長い休憩: 15分
};

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

function updateDisplay() {
    timeDisplay.textContent = formatTime(time);
}

function updateSessionCount() {
    sessionCountElement.textContent = sessionCount;
}

function updateModeButtons() {
    modeButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.mode === currentMode) {
            button.classList.add('active');
        }
    });
}

function playNotificationSound() {
    const audio = document.getElementById('notification-sound');
    audio.currentTime = 0;
    audio.play().catch(error => {
        console.error('音声再生に失敗しました:', error);
    });
}

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timerId = setInterval(() => {
        if (time <= 0) {
            stopTimer();
            playNotificationSound();
            
            // 自動連続モードの処理
            if (isAutoMode) {
                if (currentMode === 'work') {
                    // 作業 → 短い休憩
                    switchMode('short-break');
                    startTimer(); // 自動的に開始
                } else if (currentMode === 'short-break') {
                    // 短い休憩 → 作業
                    switchMode('work');
                    startTimer(); // 自動的に開始
                }
                return;
            }
            
            alert('時間になりました！');
            if (currentMode === 'work') {
                sessionCount++;
                updateSessionCount();
            }
            return;
        }
        time--;
        updateDisplay();
    }, 1000);
}

function stopTimer() {
    if (!isRunning) return;
    
    clearInterval(timerId);
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    time = modeTimes[currentMode];
    updateDisplay();
    updateSessionCount();
}

function switchMode(mode) {
    if (isRunning) return;
    
    currentMode = mode;
    if (mode === 'work') {
        time = workTime * 60;
    } else {
        time = modeTimes[mode];
    }
    updateDisplay();
    updateModeButtons();
}

// イベントリスナーの設定
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        switchMode(button.dataset.mode);
    });
});

// 初期設定
updateDisplay();
updateSessionCount();
updateModeButtons();
