// 初期設定
const INITIAL_WORK_TIME = 25; // デフォルトの作業時間（分）
const SHORT_BREAK_TIME = 5; // 短い休憩時間（分）
const LONG_BREAK_TIME = 15; // 長い休憩時間（分）

// 状態管理
let time = INITIAL_WORK_TIME * 60; // 現在の時間（秒）
let isRunning = false; // タイマーの実行状態
let timerId = null; // タイマーアイディー
let currentMode = 'work'; // 現在のモード
let sessionCount = 1; // セッション数
let workTime = INITIAL_WORK_TIME; // 作業時間（分）
let isAutoMode = false; // 自動連続モードの状態
// DOM要素
const timeDisplay = document.querySelector('.time-display');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const resetBtn = document.getElementById('reset');
const sessionCountElement = document.getElementById('session-count');
const modeButtons = document.querySelectorAll('.mode-btn');
const workTimeInput = document.getElementById('work-time-input');
const autoModeCheckbox = document.getElementById('auto-mode');

// モードと対応する時間（秒）
const modeTimes = {
    'work': workTime * 60,     // 作業モード: 設定された時間
    'short-break': SHORT_BREAK_TIME * 60,     // 短い休憩: 5分
    'long-break': LONG_BREAK_TIME * 60      // 長い休憩: 15分
};

// ユーティリティ関数
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

function startTimer() {
    if (isRunning) return;
    
    isRunning = true;
    timerId = setInterval(() => {
        if (time <= 0) {
            stopTimer();
            
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
    isRunning = false;
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = '開始';
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

// モードボタンのクリックイベント
modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const mode = button.dataset.mode;
        switchMode(mode);
        updateDisplay();
    });
});

// タイマーコントロールのイベントリスナー
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);

// タイマーカウントダウン
if (timerId) {
    clearInterval(timerId);
    timerId = setInterval(() => {
        if (time <= 0) {
            stopTimer();
            
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

// 初期設定
updateDisplay();
updateSessionCount();
updateModeButtons();
