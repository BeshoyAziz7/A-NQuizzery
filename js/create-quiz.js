// Ensure Firebase is initialized (this is also in auth.js, but good to ensure Firestore is available)
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

let questionCounter = 0; // To keep track of questions

// Function to add a new question block to the form
function addQuestion() {
  questionCounter++;
  const questionsContainer = document.getElementById('questionsContainer');
  const questionBlock = document.createElement('div');
  questionBlock.className = 'question-block';
  questionBlock.dataset.questionId = questionCounter; // Unique ID for this question

  questionBlock.innerHTML = `
    <h3>Question ${questionCounter}</h3>
    <button type="button" class="remove-question-btn" onclick="removeQuestion(${questionCounter})">
      <span class="material-icons">close</span>
    </button>
    <div class="form-group">
      <label for="questionText${questionCounter}">Question Text:</label>
      <textarea id="questionText${questionCounter}" placeholder="Enter your question here" required></textarea>
    </div>
    <div class="form-group">
      <label>Options:</label>
      <div id="optionsContainer${questionCounter}">
        </div>
      <button type="button" class="add-option-btn" onclick="addOption(${questionCounter})">
        <span class="material-icons">add</span> Add Option
      </button>
    </div>
    <div class="form-group">
      <label for="correctAnswer${questionCounter}">Correct Answer (Select):</label>
      <div id="correctAnswerRadios${questionCounter}"></div>
    </div>
  `;
  questionsContainer.appendChild(questionBlock);

  // Add initial options (at least two)
  addOption(questionCounter);
  addOption(questionCounter);
}

// Function to add an option to a specific question
function addOption(questionId) {
  const optionsContainer = document.getElementById(`optionsContainer${questionId}`);
  const optionId = `q${questionId}option${optionsContainer.children.length + 1}`; // Unique ID for the option

  const optionGroup = document.createElement('div');
  optionGroup.className = 'option-group';
  optionGroup.innerHTML = `
    <input type="text" id="${optionId}" placeholder="Option Text" required>
    <button type="button" class="remove-option-btn" onclick="removeOption(this, ${questionId})">
      <span class="material-icons">remove_circle_outline</span>
    </button>
  `;
  optionsContainer.appendChild(optionGroup);

  // Update correct answer radio buttons
  updateCorrectAnswerRadios(questionId);
}

// Function to remove an option
function removeOption(button, questionId) {
  const optionGroup = button.closest('.option-group');
  optionGroup.remove();
  updateCorrectAnswerRadios(questionId); // Update correct answer radios after removal
}

// Function to remove a question
function removeQuestion(questionId) {
  const questionBlock = document.querySelector(`[data-question-id="${questionId}"]`);
  if (questionBlock) {
    questionBlock.remove();
  }
}

// Function to update the correct answer radio buttons
function updateCorrectAnswerRadios(questionId) {
  const optionsContainer = document.getElementById(`optionsContainer${questionId}`);
  const correctAnswerRadiosDiv = document.getElementById(`correctAnswerRadios${questionId}`);
  correctAnswerRadiosDiv.innerHTML = ''; // Clear existing radios

  Array.from(optionsContainer.children).forEach((optionGroup, index) => {
    const optionInput = optionGroup.querySelector('input[type="text"]');
    if (optionInput) {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `correctAnswerQ${questionId}`;
      radio.value = optionInput.id; // Store the ID of the option as its value
      radio.id = `correctAnswerRadio${optionInput.id}`; // Unique ID for the radio

      const label = document.createElement('label');
      label.htmlFor = radio.id;
      label.textContent = optionInput.value || `Option ${index + 1}`; // Use option text or generic
      label.prepend(radio);
      correctAnswerRadiosDiv.appendChild(label);

      // Add an event listener to update the label text when option text changes
      optionInput.addEventListener('input', () => {
        label.textContent = optionInput.value || `Option ${index + 1}`;
        label.prepend(radio); // Re-prepend radio as textContent overwrites
      });
    }
  });
}


// Event listener for form submission
document.getElementById('createQuizForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const quizTitle = document.getElementById('quizTitle').value;
  const quizImage = document.getElementById('quizImage').value;
  const quizActivities = parseInt(document.getElementById('quizActivities').value) || 0;

  const questions = [];
  const questionBlocks = document.querySelectorAll('.question-block');

  for (const block of questionBlocks) {
    const questionText = block.querySelector('textarea').value;
    const options = [];
    const optionInputs = block.querySelectorAll('.option-group input[type="text"]');
    optionInputs.forEach(input => options.push(input.value));

    const selectedCorrectAnswerRadio = block.querySelector(`input[name="correctAnswerQ${block.dataset.questionId}"]:checked`);
    let correctAnswerText = '';

    if (selectedCorrectAnswerRadio) {
      // Find the text content of the selected option
      const correctAnswerOptionInput = document.getElementById(selectedCorrectAnswerRadio.value);
      if (correctAnswerOptionInput) {
        correctAnswerText = correctAnswerOptionInput.value;
      }
    } else {
      alert(`Please select a correct answer for Question ${block.dataset.questionId}.`);
      return; // Stop form submission
    }

    if (!questionText || options.some(opt => !opt) || !correctAnswerText) {
      alert("Please fill all question and option fields, and select a correct answer.");
      return; // Stop form submission
    }

    questions.push({
      questionText: questionText,
      options: options,
      correctAnswer: correctAnswerText
    });
  }

  if (questions.length === 0) {
    alert("Please add at least one question.");
    return;
  }

  const quizData = {
    title: quizTitle,
    imageUrl: quizImage,
    activities: quizActivities,
    questions: questions,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    createdBy: firebase.auth().currentUser ? firebase.auth().currentUser.email : 'anonymous'
  };

  try {
    // Add the new quiz to the 'quizzes' collection
    const docRef = await db.collection('quizzes').add(quizData);
    console.log("Quiz added with ID: ", docRef.id);
    alert('Quiz created successfully!');
    document.getElementById('createQuizForm').reset(); // Clear form
    document.getElementById('questionsContainer').innerHTML = ''; // Clear questions
    questionCounter = 0; // Reset counter
  } catch (error) {
    console.error("Error adding quiz: ", error);
    alert(`Error creating quiz: ${error.message}`);
  }
});


// Add initial question when page loads
document.addEventListener('DOMContentLoaded', addQuestion);

// Make functions globally accessible for onclick attributes
window.addQuestion = addQuestion;
window.addOption = addOption;
window.removeOption = removeOption;
window.removeQuestion = removeQuestion;