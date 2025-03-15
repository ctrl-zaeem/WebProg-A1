// Quiz data
const questions = [
    {
        question: "What does 'Never Eat Shredded Wheat' represent?",
        options: ["compass directions", "ancient grains", "Allied powers in World War II", "presidents on Mount Rushmore"],
        answer: "compass directions"
    },
    {
        question: "What does 'ROY G. BIV' represent?",
        options: ["what to do in case of a fire", "trigonometric functions", "colors of the rainbow", "organ systems of the human body"],
        answer: "colors of the rainbow"
    },
    {
        question: "What is the capital city of Pakistan?",
        options: ["Karachi", "Islamabad", "Lahore", "Peshawar"],
        answer: "Islamabad"
    },
    {
        question: "In which year did Pakistan gain independence from British rule?",
        options: ["1945", "1947", "1950", "1956"],
        answer: "1947"
    },
    {
        question: "What is the official language of Pakistan?",
        options: ["Punjabi", "Sindhi", "Urdu", "Pashto"],
        answer: "Urdu"
    },
    {
        question: "Which mountain, the second highest in the world, is located in Pakistan?",
        options: ["Everest", "K2", "Kangchenjunga", "Annapurna"],
        answer: "K2"
    },
    {
        question: "What is the national sport of Pakistan?",
        options: ["Cricket", "Hockey", "Football", "Squash"],
        answer: "Hockey"
    },
    {
        question: "Which river is the longest in Pakistan and a major water source for the country?",
        options: ["Ganges", "Indus", "Yamuna", "Brahmaputra"],
        answer: "Indus"
    },
    {
        question: "Who was the first Governor-General of Pakistan?",
        options: ["Liaquat Ali Khan", "Muhammad Ali Jinnah", "Ayub Khan", "Zulfikar Ali Bhutto"],
        answer: "Muhammad Ali Jinnah"
    },
    {
        question: "What is the national flower of Pakistan?",
        options: ["Rose", "Jasmine", "Sunflower", "Tulip"],
        answer: "Jasmine"
    },
    {
        question: "Which city is the largest by population in Pakistan?",
        options: ["Islamabad", "Lahore", "Karachi", "Faisalabad"],
        answer: "Karachi"
    },
    {
        question: "What is the meaning of the name 'Pakistan' in Urdu?",
        options: ["Land of Rivers", "Land of the Pure", "Land of Mountains", "Land of Peace"],
        answer: "Land of the Pure"
    },
    {
        question: "Who is the current captain of the Pakistan men's national cricket team in Test matches as of March 15, 2025?",
        options: ["Babar Azam", "Shan Masood", "Mohammad Rizwan", "Shaheen Shah Afridi"],
        answer: "Shan Masood"
    },
    {
        question: "Which Pakistani cricketer holds the record for the most runs scored in Test cricket as of March 15, 2025?",
        options: ["Javed Miandad", "Inzamam-ul-Haq", "Younis Khan", "Misbah-ul-Haq"],
        answer: "Younis Khan"
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;
let timer = null;
let timeLeft = 10; // Start with 10 seconds
let timeElapsed = 0; // Track elapsed time

const startPage = document.getElementById('start-page');
const quizPage = document.getElementById('quiz-page');
const resultsPage = document.getElementById('results-page');
const footerContainer = document.getElementById('footer-container');
const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const feedbackEl = document.getElementById('feedback');
const questionNumEl = document.getElementById('question-num');
const scoreDisplayEl = document.getElementById('score-display');
const timerDisplayEl = document.getElementById('timer-display');
const finalScoreEl = document.getElementById('final-score');
const finalPointsEl = document.getElementById('final-points');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');

function startTimer() {
    timeLeft = 10; // Reset to 10 seconds
    timeElapsed = 0; // Reset elapsed time
    timerDisplayEl.textContent = timeLeft;
    timerDisplayEl.classList.remove('warning');

    // Clear any existing timer
    if (timer) clearInterval(timer);

    // Start a new timer
    timer = setInterval(() => {
        timeElapsed++;
        timeLeft = Math.max(0, 10 - timeElapsed); // Decrement time left
        timerDisplayEl.textContent = timeLeft;

        // Turn red if time exceeds 10 seconds
        if (timeElapsed > 10) {
            timerDisplayEl.classList.add('warning');
        }
    }, 1000); // Update every second
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

function calculatePoints() {
    let points = 100; // Base points for a correct answer
    if (timeElapsed > 10) {
        const lateSeconds = timeElapsed - 10;
        const deduction = lateSeconds * 10; // Deduct 10 points per late second
        points = Math.max(0, points - deduction); // Ensure points don't go below 0
    }
    return points;
}

function loadQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    nextBtn.classList.add('d-none');
    feedbackEl.textContent = '';
    questionNumEl.textContent = currentQuestion + 1;
    scoreDisplayEl.textContent = score;

    q.options.forEach(option => {
        const div = document.createElement('div');
        div.classList.add('list-group-item', 'option');
        div.textContent = option;
        div.addEventListener('click', () => selectAndCheckAnswer(option, div));
        optionsEl.appendChild(div);
    });

    // Start the timer for the new question
    startTimer();
}

function selectAndCheckAnswer(option, element) {
    if (selectedAnswer) return; // Prevent multiple selections

    selectedAnswer = option;
    const options = optionsEl.getElementsByClassName('option');
    for (let opt of options) {
        opt.classList.remove('active');
    }
    element.classList.add('active');

    // Stop the timer when an answer is selected
    stopTimer();

    // Check the answer
    checkAnswer();
}

function checkAnswer() {
    const correctAnswer = questions[currentQuestion].answer;
    const options = optionsEl.getElementsByClassName('option');

    for (let opt of options) {
        if (opt.textContent === correctAnswer) {
            opt.classList.add('correct');
        }
        if (opt.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            opt.classList.add('incorrect');
        }
        opt.style.pointerEvents = 'none'; // Disable further clicks
    }

    if (selectedAnswer === correctAnswer) {
        const points = calculatePoints(); // Calculate points with time deduction
        score += points;
        feedbackEl.innerHTML = `<div class="alert alert-success">Correct! (+${points} points)</div>`;
    } else {
        feedbackEl.innerHTML = `<div class="alert alert-danger">Incorrect! The correct answer is ${correctAnswer}</div>`;
    }

    scoreDisplayEl.textContent = score;

    // Show the "Next" button after a short delay
    setTimeout(() => {
        nextBtn.classList.remove('d-none');
    }, 1000); // 1-second delay to show feedback
}

function nextQuestion() {
    currentQuestion++;
    selectedAnswer = null; // Reset selected answer
    if (currentQuestion < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizPage.classList.add('d-none');
    resultsPage.classList.remove('d-none');
    footerContainer.classList.remove('d-none');
    const scorePercentage = (score / 1400) * 100; // Calculate percentage based on max score
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.style.setProperty('--score', score / 100); // Set CSS variable for conic gradient
    finalScoreEl.textContent = score / 100; // Display number of correct answers
    finalPointsEl.textContent = score; // Display total points
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedAnswer = null;
    resultsPage.classList.add('d-none');
    quizPage.classList.remove('d-none');
    footerContainer.classList.remove('d-none');
    loadQuestion();
}

startBtn.addEventListener('click', () => {
    startPage.classList.add('d-none');
    quizPage.classList.remove('d-none');
    footerContainer.classList.remove('d-none');
    loadQuestion();
});

nextBtn.addEventListener('click', () => {
    nextQuestion();
});

playAgainBtn.addEventListener('click', () => {
    restartQuiz();
    startPage.classList.remove('d-none');
    resultsPage.classList.add('d-none');
    footerContainer.classList.add('d-none');
});