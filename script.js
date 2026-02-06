// Game state
let currentWords = [];
let currentWordIndex = 0;
let startTime = null;
let isTestActive = false;
let correctChars = 0;
let totalCharsTyped = 0;
let intervalId = null;
let wordElements = [];
let currentLanguage = 'eng'; // 'eng' or 'pl'
let wordsToGenerate = 10; // Domyślna liczba słów

// DOM elements
const wordsDisplay = document.getElementById('wordsDisplay');
const hiddenInput = document.getElementById('hiddenInput');
const restartBtn = document.getElementById('restartBtn');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');
const statsContainer = document.querySelector('.stats');
const progressElement = document.getElementById('progress');
const avgWpmElement = document.querySelector('.avg-wpm');
const languageOptions = document.querySelectorAll('.language-option');

// Word banks
let wordBankEng = [];
let wordBankPl = [];

// Load words from files
async function loadWords() {
    try {
        const responseEng = await fetch('words.txt');
        if (responseEng.ok) {
            const textEng = await responseEng.text();
            wordBankEng = textEng.split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length > 0);
        }
        
        const responsePl = await fetch('words2.txt');
        if (responsePl.ok) {
            const textPl = await responsePl.text();
            wordBankPl = textPl.split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length > 0);
        }
    } catch (error) {
        console.log('Error loading words:', error.message);
        wordBankEng = ["monkey", "variable", "method", "english", "object", "layout", "speed", "function", "accuracy", "test"];
        wordBankPl = ["pies", "kot", "dom", "las", "woda", "niebo", "ziemia", "ogień", "powietrze", "kamień"];
    }
}

function getCurrentWordBank() {
    return currentLanguage === 'eng' ? wordBankEng : wordBankPl;
}

// Initialize the game
async function init() {
    await loadWords();
    
    // Language switcher
    languageOptions.forEach(option => {
        option.addEventListener('click', () => {
            setLanguage(option.dataset.lang);
        });
    });

    // OBSŁUGA WYBORU LICZBY SŁÓW (Naprawione 25 słów)
    document.querySelectorAll('.count-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.count-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            // Wymuszenie konwersji na liczbę, aby slice działał poprawnie
            wordsToGenerate = Number(option.dataset.count); 
            restartTest();
        });
    });
    
    generateWords();
    
    hiddenInput.addEventListener('input', handleInput);
    hiddenInput.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            restartTest();
        }
        if (e.key === ' ') {
            e.preventDefault();
            handleSpace();
        }
        if (e.key === 'Backspace') {
            handleBackspace();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#restartBtn') && !e.target.closest('.language-option') && !e.target.closest('.count-option')) {
            hiddenInput.focus();
        }
    });
    
    restartBtn.addEventListener('click', restartTest);
    
    const avgWpm = calculateAverageWpm();
    avgWpmElement.textContent = `avg: ${avgWpm}wpm`;
    
    hiddenInput.focus();
}

function setLanguage(lang) {
    if (currentLanguage === lang) return;
    currentLanguage = lang;
    languageOptions.forEach(option => {
        option.classList.toggle('active', option.dataset.lang === lang);
    });
    restartTest();
}

function generateWords() {
    currentWordIndex = 0;
    currentWords = [];
    const wordBank = getCurrentWordBank();
    
    // Losowe mieszanie
    const shuffled = [...wordBank].sort(() => 0.5 - Math.random());
    
    // Pobranie wybranej liczby słów
    currentWords = shuffled.slice(0, wordsToGenerate);
    
    // Zabezpieczenie na wypadek małego pliku words.txt
    while (currentWords.length < wordsToGenerate && wordBank.length > 0) {
        currentWords.push(wordBank[Math.floor(Math.random() * wordBank.length)]);
    }
    
    renderWords();
    updateProgress();
}

function renderWords() {
    wordsDisplay.innerHTML = '';
    wordElements = [];
    
    currentWords.forEach((word, index) => {
        const wordElement = document.createElement('span');
        wordElement.className = 'word';
        wordElement.dataset.index = index;
        
        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.className = 'letter';
            letterSpan.textContent = word[i];
            letterSpan.style.color = '#CCB499'; // Tekst nie napisany
            wordElement.appendChild(letterSpan);
        }
        
        wordsDisplay.appendChild(wordElement);
        if (index < currentWords.length - 1) {
            wordsDisplay.appendChild(document.createTextNode(' '));
        }
        wordElements.push(wordElement);
    });
    
    if (wordElements[0]) {
        wordElements[0].classList.add('active');
        updateCursorPosition(0, wordElements[0]);
    }
}

function updateProgress() {
    progressElement.textContent = `${currentWordIndex + 1}/${currentWords.length}`;
}

function handleInput(e) {
    const input = hiddenInput.value;
    if (!isTestActive && input.length > 0) {
        startTest();
    }
    if (!isTestActive) return;

    const currentWord = currentWords[currentWordIndex];
    const currentWordElement = wordElements[currentWordIndex];
    
    if (input === currentWord && currentWordIndex === currentWords.length - 1) {
        completeCurrentWord(true);
        return;
    }
    
    updateLetterHighlighting(input, currentWord, currentWordElement);
    updateStats();
}

function handleSpace() {
    if (!isTestActive || hiddenInput.value.length === 0) return;
    
    const currentWord = currentWords[currentWordIndex];
    const input = hiddenInput.value;
    const currentWordElement = wordElements[currentWordIndex];
    
    let correctInWord = 0;
    for (let i = 0; i < Math.min(input.length, currentWord.length); i++) {
        if (input[i] === currentWord[i]) correctInWord++;
    }
    
    correctChars += correctInWord;
    totalCharsTyped += Math.max(input.length, currentWord.length);
    
    if (input === currentWord) {
        currentWordElement.classList.add('completed');
        currentWordElement.style.color = '#EBEFEE'; // Tekst napisany
    } else {
        currentWordElement.classList.add('incorrect-word');
        currentWordElement.style.color = '#BB6C43'; // Zły tekst
    }
    
    if (currentWordIndex === currentWords.length - 1) {
        finishTest();
    } else {
        moveToNextWord();
    }
}

function handleBackspace() {
    if (!isTestActive) return;
    updateLetterHighlighting(hiddenInput.value, currentWords[currentWordIndex], wordElements[currentWordIndex]);
}

function startTest() {
    isTestActive = true;
    startTime = Date.now();
    correctChars = 0;
    totalCharsTyped = 0;
    intervalId = setInterval(updateStats, 100);
}

// STABILNY KURSOR (nie przesuwa liter)
function updateCursorPosition(cursorPos, wordElement) {
    const oldCursor = document.querySelector('.cursor');
    if (oldCursor) oldCursor.remove();
    
    const letters = wordElement.querySelectorAll('.letter');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    
    if (letters.length > 0) {
        if (cursorPos < letters.length) {
            const targetLetter = letters[cursorPos];
            cursor.style.left = targetLetter.offsetLeft + "px";
            cursor.style.top = targetLetter.offsetTop + "px";
        } else {
            const lastLetter = letters[letters.length - 1];
            cursor.style.left = (lastLetter.offsetLeft + lastLetter.offsetWidth) + "px";
            cursor.style.top = lastLetter.offsetTop + "px";
        }
    }
    wordElement.appendChild(cursor);
}

function updateLetterHighlighting(input, correctWord, wordElement) {
    const letters = wordElement.querySelectorAll('.letter');
    
    for (let i = 0; i < Math.max(input.length, correctWord.length); i++) {
        if (i < letters.length) {
            const letter = letters[i];
            if (i < input.length) {
                if (input[i] === correctWord[i]) {
                    letter.className = 'letter typed';
                    letter.style.color = '#EBEFEE';
                } else {
                    letter.className = 'letter incorrect';
                    letter.style.color = '#BB6C43';
                }
            } else {
                letter.className = 'letter';
                letter.style.color = '#CCB499';
            }
        } else if (i < input.length) {
            // Obsługa dodatkowych liter
            const extraLetter = document.createElement('span');
            extraLetter.className = 'letter incorrect extra';
            extraLetter.textContent = input[i];
            extraLetter.style.color = '#BB6C43';
            wordElement.appendChild(extraLetter);
        }
    }
    
    // Usuwanie nadmiarowych liter extra
    const allLetters = wordElement.querySelectorAll('.letter');
    for (let i = allLetters.length - 1; i >= correctWord.length; i--) {
        if (i >= input.length) {
            wordElement.removeChild(allLetters[i]);
        }
    }
    
    updateCursorPosition(input.length, wordElement);
}

function completeCurrentWord(isLastWord = false) {
    const currentWord = currentWords[currentWordIndex];
    correctChars += currentWord.length;
    totalCharsTyped += currentWord.length;
    wordElements[currentWordIndex].classList.add('completed');
    wordElements[currentWordIndex].style.color = '#EBEFEE';
    
    if (isLastWord) finishTest();
    else moveToNextWord();
}

function moveToNextWord() {
    wordElements[currentWordIndex].classList.remove('active');
    const oldCursor = wordElements[currentWordIndex].querySelector('.cursor');
    if (oldCursor) oldCursor.remove();
    
    hiddenInput.value = '';
    currentWordIndex++;
    wordElements[currentWordIndex].classList.add('active');
    updateCursorPosition(0, wordElements[currentWordIndex]);
    updateProgress();
}

function updateStats() {
    if (!startTime || !isTestActive) return;
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const wpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;
    const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
    
    wpmElement.textContent = wpm;
    accuracyElement.textContent = `${accuracy}%`;
}

function calculateAverageWpm() {
    const history = JSON.parse(localStorage.getItem('typeshitHistory') || '[]');
    if (history.length === 0) return 0;
    return Math.round(history.reduce((a, b) => a + b, 0) / history.length);
}

function finishTest() {
    isTestActive = false;
    clearInterval(intervalId);
    
    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const finalWpm = Math.round((correctChars / 5) / timeElapsed);
    
    const history = JSON.parse(localStorage.getItem('typeshitHistory') || '[]');
    history.push(finalWpm);
    localStorage.setItem('typeshitHistory', JSON.stringify(history.slice(-100)));
    
    avgWpmElement.textContent = `avg: ${calculateAverageWpm()}wpm`;
    statsContainer.classList.add('show');
    progressElement.textContent = `Test completed!`;
}

function restartTest() {
    isTestActive = false;
    startTime = null;
    clearInterval(intervalId);
    hiddenInput.value = '';
    generateWords();
    statsContainer.classList.remove('show');
    updateProgress();
    hiddenInput.focus();
}

document.addEventListener('DOMContentLoaded', init);