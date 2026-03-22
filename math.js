let score = 0;
let stars = 0;
let currentResult = 0;
let answered = false;
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

    // Always addition for now, result <= 10
    currentResult = Math.floor(Math.random() * 11); // 0 to 10
    num1 = Math.floor(Math.random() * (currentResult + 1));
    num2 = currentResult - num1;
    problemText = `${num1} + ${num2}`;

    document.getElementById('math-problem').textContent = problemText;
    document.getElementById('feedback').innerHTML = '&nbsp;';
    document.getElementById('feedback').className = 'feedback';

    // Generate 3 distractors
    const distractors = [];
    while (distractors.length < 3) {
        const d = Math.floor(Math.random() * 11);
        if (d !== currentResult && !distractors.includes(d)) {
            distractors.push(d);
        }
    }

    const options = shuffle([currentResult, ...distractors]);
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const button = document.createElement('div');
        button.className = 'option-button';
        button.textContent = option;

        button.onclick = () => {
            if (answered) return;

            if (option === currentResult) {
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
                attempts++;
                button.classList.add('wrong');
                document.getElementById('feedback').textContent = '❌ Försök igen!';
                document.getElementById('feedback').className = 'feedback wrong';

                setTimeout(() => {
                    button.classList.remove('wrong');
                }, 500);
            }
        };

        optionsContainer.appendChild(button);
    });
}

// Start the game
newRound();
