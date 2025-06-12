# QuizBuilder

A full-stack quiz management web application built using HTML, CSS, JavaScript, and Firebase. The application allows users to:

- Sign up and log in securely.
- Create quizzes dynamically (admin only).
- Store quizzes in Firebase Firestore.
- Render quizzes dynamically for users to play.
- Track scores in real-time.

---

## Features

- **User Authentication:** Secure signup and login using Firebase Authentication.
- **Admin Role:** Admins can create quizzes, while users can attempt quizzes.
- **Dynamic Quiz Creation:** Admins can add multiple questions, multiple options per question, and define correct answers.
- **Firestore Integration:** All quizzes are stored and loaded from Firebase Firestore.
- **Dynamic Quiz Rendering:** Quizzes are loaded dynamically based on Firestore data.
- **Real-Time Scoring:** Users receive instant feedback and score updates while taking quizzes.
- **Countdown Animation:** A 5-second countdown animation before quizzes start.
- **Responsive UI:** Clean and modern UI with CSS animations and transitions.

---

## Project Structure

📁 Project Root  
│  
├── index.html          # Dashboard displaying available quizzes  
├── create-quiz.html    # Admin quiz creation page  
├── login.html          # Login page  
├── signup.html         # Signup page  
├── quiz1.html          # Static sample quiz (old method)  
├── quizzes/  
│   └── Quiz1/  
│       └── render-quiz.html # Dynamic quiz rendering page  
│  
├── js/  
│   ├── main.js         # Global reusable functions (typewriter, logout)  
│   ├── auth.js         # Handles Firebase Auth state management  
│   ├── create-quiz.js  # Handles quiz creation logic  
│   ├── login.js        # Login functionality  
│   ├── signup.js       # Signup functionality  
│  
├── render-quiz.js      # Dynamic quiz rendering logic  
│  
├── style.css           # Main global stylesheet  
├── stylequiz1.css      # Styling for quiz display pages  
└── images/             # App logo and assets

---

## Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend (Serverless):** Firebase
  - Authentication
  - Firestore Database
- **Animation:** CSS Keyframes, UIiverse astronauts

---

## Firebase Configuration

The app uses Firebase for authentication and database storage. The configuration is consistent across all JS files:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAzx1KvETDa9GBBhCCCd1yaEf4w7v9PAp4",
  authDomain: "quizzer-ad291.firebaseapp.com",
  databaseURL: "https://quizzer-ad291-default-rtdb.firebaseio.com",
  projectId: "quizzer-ad291",
  storageBucket: "quizzer-ad291.appspot.com",
  messagingSenderId: "731021085710",
  appId: "1:731021085710:web:16af2a9d6f160b57d7405f",
  measurementId: "G-4194RW8C20"
};
```

> ⚠ Make sure your Firebase project has Firestore and Authentication enabled.

---

## How It Works

### Authentication

- **auth.js** handles the Firebase initialization and listens for authentication state changes.
- If user is not logged in, redirects to login.
- Admin status is determined based on custom claims (future extensibility).

### Quiz Creation (Admin)

- Admin clicks "Create Quiz" button (only visible for admin users).
- **create-quiz.html** loads **create-quiz.js**
- Admin dynamically adds questions, options, and selects correct answers.
- Quiz is saved into Firestore.

### Quiz Rendering

- **render-quiz.html** loads **render-quiz.js**
- Fetches quiz by ID from Firestore (via URL query parameter)
- Dynamically renders each question one by one.
- Shows real-time score after each question.
- Displays final score after quiz completion.

### Dashboard

- **index.html** loads all quizzes from Firestore using **index.js**.
- Supports search and filtering of quizzes.
- Admins see delete buttons to remove quizzes.

---

## Running Locally

1. Clone or download the project files.
2. Host it locally via Live Server or similar extension.
3. Make sure your Firebase project uses the same config.
4. Setup Firebase Authentication (Email/Password) and Firestore.
5. If you want to enable admin roles, you'll need to configure custom claims manually in Firebase Admin SDK.

---

## Future Improvements

- Admin panel to manage users and quizzes.
- Categories and tags for quizzes.
- Timed quizzes with countdown timers.
- Leaderboard and progress tracking.
- Quiz analytics and reports.
- Multi-page quiz creation wizard.

---

## Screenshots

*(Add your screenshots of login page, dashboard, quiz creation, quiz playing, etc.)*

---

## License

MIT License.

---

## Author

Developed by Fady Youssef and Team 🚀
