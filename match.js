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

let currentWord;
let score = 0;
let answered = false;
let streak = 0;
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

function newRound() {
    answered = false;
    attempts = 0;

    // Pick a random word
    currentWord = words[Math.floor(Math.random() * words.length)];

    // Get 3 random distractors that are not the current word
    const distractors = [];
    const availableDistractors = words.filter(w => w.word !== currentWord.word);

    while (distractors.length < 3) {
        const randomIndex = Math.floor(Math.random() * availableDistractors.length);
        const randomWord = availableDistractors[randomIndex].word;
        if (!distractors.includes(randomWord)) {
            distractors.push(randomWord);
        }
    }

    const options = shuffle([currentWord.word, ...distractors]);

    document.getElementById('image').textContent = currentWord.emoji;
    document.getElementById('feedback').innerHTML = '&nbsp;'; // Keep height
    document.getElementById('feedback').className = 'feedback';

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    let colorIndex = 1;
    options.forEach(option => {
        const button = document.createElement('div');
        button.className = 'option-button';
        button.textContent = option;

        button.onclick = () => {
            if (answered) return;

            if (option === currentWord.word) {
                // Rätt svar
                answered = true;

                let points = 0;
                if (attempts === 0) {
                    points = 10;
                    stars++;
                } else if (attempts === 1) {
                    points = 5;
                } else if (attempts === 2) {
                    points = 2;
                } else {
                    points = 1;
                }

                score += points;
                document.getElementById('score').textContent = score;
                document.getElementById('stars').textContent = stars;

                button.classList.add('correct');
                document.getElementById('feedback').textContent = '🎉 Rätt! +' + points + ' poäng!';
                document.getElementById('feedback').className = 'feedback correct';

                setTimeout(newRound, 1500);
            } else {
                // Fel svar
                attempts++;
                button.classList.add('wrong');
                document.getElementById('feedback').textContent = '❌ Försök igen!';
                document.getElementById('feedback').className = 'feedback wrong';

                // Clear the wrong animation/class after it plays
                setTimeout(() => {
                    button.classList.remove('wrong');
                }, 500);
            }
        };

        optionsContainer.appendChild(button);
        colorIndex++;
    });
}

// Start the game
newRound();
