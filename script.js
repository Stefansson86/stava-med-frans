const words = [
    // Original 25 words
    { word: 'bil', emoji: '🚗' },
    { word: 'hund', emoji: '🐕' },
    { word: 'katt', emoji: '🐱' },
    { word: 'sol', emoji: '☀️' },
    { word: 'båt', emoji: '⛵' },
    { word: 'boll', emoji: '⚽' },
    { word: 'äpple', emoji: '🍎' },
    { word: 'hus', emoji: '🏠' },
    { word: 'träd', emoji: '🌳' },
    { word: 'fisk', emoji: '🐟' },
    { word: 'bok', emoji: '📖' },
    { word: 'fågel', emoji: '🐦' },
    { word: 'blomma', emoji: '🌸' },
    { word: 'glass', emoji: '🍦' },
    { word: 'mus', emoji: '🐭' },
    { word: 'ko', emoji: '🐮' },
    { word: 'get', emoji: '🐐' },
    { word: 'bröd', emoji: '🍞' },
    { word: 'ost', emoji: '🧀' },
    { word: 'penna', emoji: '✏️' },
    { word: 'buss', emoji: '🚌' },
    { word: 'cykel', emoji: '🚲' },
    { word: 'banan', emoji: '🍌' },
    { word: 'pizza', emoji: '🍕' },
    { word: 'måne', emoji: '🌙' },

    // 21 New words
    { word: 'tåg', emoji: '🚂' },
    { word: 'orm', emoji: '🐍' },
    { word: 'gris', emoji: '🐷' },
    { word: 'myra', emoji: '🐜' },
    { word: 'räv', emoji: '🦊' },
    { word: 'lejon', emoji: '🦁' },
    { word: 'björn', emoji: '🐻' },
    { word: 'tiger', emoji: '🐯' },
    { word: 'älg', emoji: '🦌' },
    { word: 'varg', emoji: '🐺' },
    { word: 'anka', emoji: '🦆' },
    { word: 'groda', emoji: '🐸' },
    { word: 'nyckel', emoji: '🔑' },
    { word: 'klocka', emoji: '⌚' },
    { word: 'sko', emoji: '👞' },
    { word: 'hatt', emoji: '🎩' },
    { word: 'säng', emoji: '🛏️' },
    { word: 'soffa', emoji: '🛋️' },
    { word: 'tårta', emoji: '🎂' },
    { word: 'ballong', emoji: '🎈' },
    { word: 'krona', emoji: '👑' }
];

const swedishAlphabet = 'abcdefghijklmnopqrstuvwxyzåäö'.split('');

let currentWord;
let currentSpelling = []; // Array of strings (letters)
let currentSlotIndex = 0; // Which letter we are guessing right now
let score = 0;
let stars = 0;
let attempts = 0;

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getRandomLetters(count, excludeLetters = []) {
    const randomLetters = [];
    while (randomLetters.length < count) {
        const randIndex = Math.floor(Math.random() * swedishAlphabet.length);
        const letter = swedishAlphabet[randIndex];
        if (!excludeLetters.includes(letter) && !randomLetters.includes(letter)) {
            randomLetters.push(letter);
        }
    }
    return randomLetters;
}

function renderSlots() {
    const slotsContainer = document.getElementById('word-slots');
    slotsContainer.innerHTML = '';

    for (let i = 0; i < currentWord.word.length; i++) {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'letter-slot';

        const placedLetter = currentSpelling[i];
        if (placedLetter) {
            slotDiv.textContent = placedLetter;
            slotDiv.classList.add('filled');
        }

        slotsContainer.appendChild(slotDiv);
    }
}

function renderLetterChoices() {
    const poolContainer = document.getElementById('letter-pool');
    poolContainer.innerHTML = '';

    // If word is complete, clear pool
    if (currentSlotIndex >= currentWord.word.length) {
        return;
    }

    const correctLetter = currentWord.word[currentSlotIndex];
    // Get 3 specific random distractors that are NOT the correct letter
    const wrongLetters = getRandomLetters(3, [correctLetter]);
    const choices = shuffle([correctLetter, ...wrongLetters]);

    choices.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-button';
        btn.textContent = letter;

        btn.onclick = () => {
            // Block click if container is validating/animating
            const slotsContainer = document.getElementById('word-slots');
            if (slotsContainer.classList.contains('wrong') || slotsContainer.classList.contains('correct')) return;

            handleLetterClick(letter, btn);
        };

        poolContainer.appendChild(btn);
    });
}

function handleLetterClick(clickedLetter, buttonElement) {
    const correctLetter = currentWord.word[currentSlotIndex];

    if (clickedLetter === correctLetter) {
        // Correct guess for this slot!
        currentSpelling[currentSlotIndex] = clickedLetter;
        currentSlotIndex++;

        renderSlots();
        renderLetterChoices();

        // Check if word is completely done
        if (currentSlotIndex === currentWord.word.length) {
            wordComplete();
        }
    } else {
        // Wrong guess for this slot
        attempts++;
        buttonElement.classList.add('wrong');
        const slotsContainer = document.getElementById('word-slots');
        slotsContainer.classList.add('wrong');

        document.getElementById('feedback').textContent = '❌ Försök igen!';
        document.getElementById('feedback').className = 'feedback wrong';

        // Clear warning after 500ms
        setTimeout(() => {
            buttonElement.classList.remove('wrong');
            slotsContainer.classList.remove('wrong');
            document.getElementById('feedback').innerHTML = '&nbsp;';
            document.getElementById('feedback').className = 'feedback';
        }, 500);
    }
}

function newRound() {
    attempts = 0;
    currentWord = words[Math.floor(Math.random() * words.length)];
    currentSpelling = Array(currentWord.word.length).fill(null);
    currentSlotIndex = 0;

    document.getElementById('image').textContent = currentWord.emoji;
    document.getElementById('feedback').innerHTML = '&nbsp;'; // Keep height
    document.getElementById('feedback').className = 'feedback';

    const slotsContainer = document.getElementById('word-slots');
    slotsContainer.className = 'word-slots-container'; // reset states

    renderSlots();
    renderLetterChoices();
}


function wordComplete() {
    const slotsContainer = document.getElementById('word-slots');
    slotsContainer.classList.add('correct');

    // Calculate points based on attempts per WHOLE word
    // (If they made 0 mistakes, they get 10 pts. 1 mistake = 5, 2 = 2, else 1)
    let points = 0;
    if (attempts === 0) {
        points = 10;
        stars += 1;
    } else if (attempts === 1) {
        points = 5;
    } else if (attempts === 2) {
        points = 2;
    } else {
        points = 1;
    }

    score += points;

    document.getElementById('feedback').textContent = '🎉 Rätt! +' + points + ' poäng!';
    document.getElementById('feedback').className = 'feedback correct';
    document.getElementById('score').textContent = score;
    document.getElementById('stars').textContent = stars;

    // Load next word after 1.5s
    setTimeout(() => {
        newRound();
    }, 1500);
}

// Start the game
newRound();
