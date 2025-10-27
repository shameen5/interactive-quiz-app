// public/script.js
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');

const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionCounter = document.getElementById('question-counter');
const timerElement = document.getElementById('timer');
const scoreText = document.getElementById('score-text');

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// Fetch questions from the backend API
async function fetchQuestions() {
    try {
        const response = await fetch('http://localhost:3000/api/questions');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        questions = await response.json();
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        questionText.innerText = 'Failed to load questions. Please try again later.';
    }
}

function startQuiz() {
    startScreen.classList.add('hide');
    resultScreen.classList.add('hide');
    quizScreen.classList.remove('hide');
    currentQuestionIndex = 0;
    score = 0;
    nextBtn.classList.add('hide');
    showQuestion();
}

function showQuestion() {
    resetState();
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        questionText.innerText = question.question;
        questionCounter.innerText = `Question ${currentQuestionIndex + 1}/${questions.length}`;
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.innerText = option;
            button.classList.add('option');
            button.addEventListener('click', () => selectAnswer(button, option));
            optionsContainer.appendChild(button);
        });

        startTimer();
    } else {
        showResults();
    }
}

function startTimer() {
    timeLeft = 15;
    timerElement.innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeOut();
        }
    }, 1000);
}

function handleTimeOut() {
    // Automatically select a "wrong" answer
    const correctAnswer = questions[currentQuestionIndex].answer;
    Array.from(optionsContainer.children).forEach(button => {
        if (button.innerText === correctAnswer) {
            button.classList.add('correct');
        }
        button.classList.add('disabled');
    });
    nextBtn.classList.remove('hide');
}


function resetState() {
    clearInterval(timer);
    nextBtn.classList.add('hide');
    while (optionsContainer.firstChild) {
        optionsContainer.removeChild(optionsContainer.firstChild);
    }
}

function selectAnswer(selectedButton, selectedOption) {
    clearInterval(timer);
    const correctAnswer = questions[currentQuestionIndex].answer;

    if (selectedOption === correctAnswer) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('incorrect');
    }

    // Show correct answer and disable all options
    Array.from(optionsContainer.children).forEach(button => {
        if (button.innerText === correctAnswer) {
            button.classList.add('correct');
        }
        button.classList.add('disabled');
    });

    nextBtn.classList.remove('hide');
}

function showNextQuestion() {
    currentQuestionIndex++;
    showQuestion();
}

function showResults() {
    quizScreen.classList.add('hide');
    resultScreen.classList.remove('hide');
    scoreText.innerText = `You scored ${score} out of ${questions.length}!`;
}

// Event Listeners
startBtn.addEventListener('click', async () => {
    await fetchQuestions();
    if(questions.length > 0) {
        startQuiz();
    }
});

nextBtn.addEventListener('click', showNextQuestion);
restartBtn.addEventListener('click', startQuiz);