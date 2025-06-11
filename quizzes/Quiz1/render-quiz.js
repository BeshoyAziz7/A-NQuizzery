    // Ensure Firebase is initialized
    if (!firebase.apps.length) {
      const firebaseConfig = {
        apiKey: "AIzaSyAzx1KvETDa9GBBhCCCd1yaEf4w7v9PAp4",
        authDomain: "quizzer-ad291.firebaseapp.com",
        databaseURL: "https://quizzer-ad291-default-rtdb.firebaseio.com",
        projectId: "quizzer-ad291",
        storageBucket: "quizzer-ad291.firebasestorage.app",
        messagingSenderId: "731021085710",
        appId: "1:731021085710:web:16af2a9d6f160b57d7405f",
        measurementId: "G-4194RW8C20"
      };
      firebase.initializeApp(firebaseConfig);
    }

    const db = firebase.firestore();
    let currentQuizData = null; // To store the loaded quiz data for submission
    let currentQuestionIndex = 0; // NEW: Track the current question
    let userScore = 0; // NEW: Track the user's total score

    // Function to get query parameters from URL
    function getQueryParam(param) {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(param);
    }

    // NEW: Function to display a specific question
    function displayQuestion(questionIndex) {
      const quizQuestionEl = document.getElementById('quizQuestion');
      const quizOptionsEl = document.getElementById('quizOptions');
      const submitBtn = document.getElementById('submitBtn');
      const nextBtn = document.getElementById('nextBtn'); // NEW: Next button reference
      const resultDiv = document.getElementById('result');
      const scoreDisplayDiv = document.getElementById('scoreDisplay');
      const quizProgressEl = document.getElementById('quizProgress'); // NEW: Progress display

      if (!currentQuizData || !currentQuizData.questions || currentQuizData.questions.length === 0) {
        quizQuestionEl.textContent = 'No quiz data loaded.';
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        return;
      }

      // Hide previous results and score
      resultDiv.style.display = 'none';
      scoreDisplayDiv.style.opacity = '0'; // Hide score display

      if (questionIndex < currentQuizData.questions.length) {
        // Display the current question
        const question = currentQuizData.questions[questionIndex];
        quizQuestionEl.textContent = question.questionText;
        quizOptionsEl.innerHTML = ''; // Clear existing options

        question.options.forEach((option, index) => {
          const label = document.createElement('label');
          label.className = 'option';
          label.innerHTML = `
            <input name="radio" type="radio" class="input" value="${option}">
            <span class="option-text">${option}</span>
          `;
          quizOptionsEl.appendChild(label);
        });

        // Enable options and submit button for the new question
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
          option.classList.remove('disabled-option');
        });
        submitBtn.disabled = false;
        submitBtn.style.display = 'block'; // Show submit button
        nextBtn.style.display = 'none'; // Hide next button until submitted

        // Update progress display
        quizProgressEl.textContent = `Question ${questionIndex + 1} of ${currentQuizData.questions.length}`;

      } else {
        // End of quiz
        quizQuestionEl.textContent = 'Quiz Completed!';
        quizOptionsEl.innerHTML = ''; // Clear options
        submitBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        resultDiv.style.display = 'none'; // Hide result div

        // Display final score
        scoreDisplayDiv.innerHTML = `🎉 Final Score: <span style="font-size: 1.5em">${userScore} / ${currentQuizData.questions.length * 100}</span> 🎉`;
        scoreDisplayDiv.style.opacity = '1'; // Keep opacity as it's part of the animation/transition
        scoreDisplayDiv.classList.add('final-score-display'); // ADD THIS LINE

        quizProgressEl.textContent = ''; // Clear progress
        // Optional: Add a button to go back to dashboard or restart
        const backToDashboardBtn = document.createElement('button');
        backToDashboardBtn.textContent = 'Back to Dashboard';
        backToDashboardBtn.onclick = () => window.location.href = '../../index.html';
        backToDashboardBtn.style.marginTop = '20px';
        quizOptionsEl.appendChild(backToDashboardBtn); // Append to options container for styling

      }
    }


    async function loadQuiz() {
      const quizId = getQueryParam('id');
      const quizTitleDisplay = document.getElementById('quizTitleDisplay');
      
      if (!quizId) {
        document.getElementById('quizQuestion').textContent = 'Error: Quiz ID not provided.';
        document.getElementById('submitBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
        return;
      }

      try {
        const quizDoc = await db.collection('quizzes').doc(quizId).get();

        if (!quizDoc.exists) {
          document.getElementById('quizQuestion').textContent = 'Error: Quiz not found.';
          document.getElementById('submitBtn').style.display = 'none';
          document.getElementById('nextBtn').style.display = 'none';
          return;
        }

        currentQuizData = quizDoc.data();
        quizTitleDisplay.textContent = `${currentQuizData.title} | QuizBuilder`;
        
        // Start displaying the first question
        currentQuestionIndex = 0; // Initialize index
        userScore = 0; // Reset score
        displayQuestion(currentQuestionIndex);

      } catch (error) {
        console.error("Error loading quiz:", error);
        document.getElementById('quizQuestion').textContent = `Error loading quiz: ${error.message}`;
        document.getElementById('submitBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
      }
    }

    // Submit button logic for dynamic quizzes
    document.getElementById('submitBtn').addEventListener('click', function() {
      const selectedOption = document.querySelector('input[name="radio"]:checked');
      const resultDiv = document.getElementById('result');
      const options = document.querySelectorAll('.option');
      const submitBtn = document.getElementById('submitBtn');
      const nextBtn = document.getElementById('nextBtn'); // NEW: Next button reference
      const scoreDisplayDiv = document.getElementById('scoreDisplay');
      
      if (!currentQuizData || !currentQuizData.questions || currentQuizData.questions.length === 0) {
          resultDiv.textContent = "Quiz data not loaded.";
          resultDiv.style.display = "block";
          resultDiv.className = "incorrect";
          return;
      }

      // Get the current question
      const currentQuestion = currentQuizData.questions[currentQuestionIndex];
      const correctAnswer = currentQuestion.correctAnswer;
      
      if (!selectedOption) {
          resultDiv.textContent = "Please select an answer!";
          resultDiv.style.display = "block";
          resultDiv.className = "incorrect";
          return;
      }
      
      const userAnswer = selectedOption.value;
      
      // Disable all options
      options.forEach(option => {
          option.classList.add('disabled-option');
        // Visually indicate correct answer
        if (option.querySelector('input').value === correctAnswer) {
          option.style.backgroundColor = 'rgba(0, 255, 0, 0.2)'; // Green for correct
        } else if (option.querySelector('input').value === userAnswer) {
          option.style.backgroundColor = 'rgba(255, 0, 0, 0.2)'; // Red for user's wrong answer
        }
      });
      
      // Disable submit button
      submitBtn.disabled = true;
      submitBtn.style.display = 'none'; // Hide submit button

      // Calculate score for THIS question
      if (userAnswer === correctAnswer) {
          resultDiv.textContent = "Correct!";
          resultDiv.className = "correct";
          userScore += 100; // Add points for correct answer
      } else {
          resultDiv.textContent = `Incorrect. The correct answer is "${correctAnswer}".`;
          resultDiv.className = "incorrect";
      }
      
      // Display current score (optional, could be final score only)
      scoreDisplayDiv.className = 'score-display';
      scoreDisplayDiv.innerHTML = `🎯 Current Score: <span style="font-size: 1.2em">${userScore}</span> 🎯`;
      scoreDisplayDiv.style.opacity = '1';
      scoreDisplayDiv.style.position = 'absolute'; // Restore original position
      scoreDisplayDiv.style.transform = 'translate(-50%, -50%)'; // Restore original transform

      resultDiv.style.display = "block";

      // Show Next Question button
      if (currentQuestionIndex < currentQuizData.questions.length - 1) {
          nextBtn.style.display = 'block';
      } else {
          // This was the last question, show option to finish quiz
          nextBtn.textContent = 'Finish Quiz';
          nextBtn.style.display = 'block';
      }
    });

    // NEW: Next Question button logic
    document.getElementById('nextBtn').addEventListener('click', function() {
        currentQuestionIndex++; // Move to the next question
        displayQuestion(currentQuestionIndex); // Display it
        document.getElementById('scoreDisplay').style.opacity = '0'; // Temporarily hide score
    });


    // Countdown functionality (from quiz1.html, ensure it's here)
    const countdownEl = document.getElementById('countdown');
    const numberEl = document.getElementById('countdown-number');
    
    let count = 5;
    const countdown = setInterval(() => {
      count--;
      numberEl.textContent = count;
      
      if (count <= 0) {
        clearInterval(countdown);
        countdownEl.style.opacity = '0';
        setTimeout(() => {
          countdownEl.classList.add('hidden');
        }, 500);
      }
    }, 1000);


    // Load the quiz when the page content is fully loaded
    document.addEventListener('DOMContentLoaded', loadQuiz);
