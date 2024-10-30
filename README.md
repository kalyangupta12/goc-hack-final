# 📊 Excelitest: Automated Test Creation Platform

**Excelitest** revolutionizes test creation for educators and trainers by transforming Excel files into dynamic, interactive MCQ quizzes. It automates grading, provides instant feedback, and offers customization options that simplify the test-taking experience. Built during the *Game of Codes Hackathon* organized by CCSA, Excelitest proudly won *2nd place* in a state-level competition in Assam.

---

## 🚀 Live Demo

[*Launch Excelitest*](https://excelitest.vercel.app)

---

## 🌟 Features at a Glance

### 📥 Effortless Test Creation
- **Excel to MCQ Conversion**: Instantly converts Excel files with questions, options, answers, and scores into interactive MCQs.
- **Advanced Test Settings**:
  - **Test Duration**: Sets a time limit with automatic submission at the end.
  - **Attempts Limit**: Controls how many attempts a student can make.
  - **Randomize Questions**: Shuffles questions to keep each attempt unique.
  - **Access Period**: Defines when tests are available.

### 👥 Dual User Roles
- **Teacher Dashboard**:
  - **Test Creation**: Drag-and-drop Excel files to create tests instantly.
  - **Code & QR Distribution**: Each test generates a unique code and QR for student access.
  - **Preview & Edit**: Modify questions, reorder, and adjust settings.
  - **Results Tracking**: Analyzes student performance on each test.
- **Student Dashboard**:
  - **Quick Join**: Access tests via a unique code or QR code.
  - **Instant Feedback**: View scores and feedback immediately after submission.
  - **Test History**: Track scores and review completed tests.

### ⏱ Real-Time Test Interaction
- **Timer**: Auto-submits tests when time expires, with countdown warnings.
- **Interactive Interface**: User-friendly layout for smooth test-taking.

### 🔧 Admin Dashboard
- **Test Management**: Teachers can add, edit, reorder, and manage questions with a preview interface.
- **Enhanced Question Editing**:
  - **Drag-and-Drop**: Easily reorder questions.
  - **Inline Editing**: Edit questions directly and add rows as needed.

### 💻 Tech Stack
- **Frontend**: Tailwind CSS, React, Next.js
- **Backend**: Express.js, MongoDB
- **Authentication**: Clerk
- **Excel Processing**: XLSX for handling Excel files

---

## 📋 Installation

To set up the project locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/kalyangupta12/goc-hack-final.git
   cd goc-hack-final
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:

   - Backend (`/backend/.env`):
     ```plaintext
     MONGODB_URI=<your_mongodb_uri>
     FRONTEND_URL=<your_frontend_url>
     PORT=<your_port>
     ```

   - Frontend (`.env.local`):
     ```plaintext
     NEXT_PUBLIC_CLERK_SIGN_IN_URL=<your_clerk_sign_in_url>
     CLERK_SECRET_KEY=<your_clerk_secret_key>
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
     NEXT_PUBLIC_CLERK_SIGN_UP_URL=<your_clerk_sign_up_url>
     ```

4. **Run the Backend**:
   ```bash
   cd backend
   npm install
   nodemon server.js
   ```

5. **Run the Frontend**:
   ```bash
   cd ..
   npm run dev
   ```

6. **Local API Setup**:
   Set up your own local API on `localhost:5000` as the app is configured to use a hosted API in the src/app files go check the GET and POST links.

---

## 📝 Usage

1. **Sign In / Sign Up**: Access through Clerk authentication.
2. **Create a Test**:
   - Go to "Create Test."
   - Enter details like name, duration, attempt limits, etc.
   - Upload a formatted Excel file in this format:
     | QuestionText         | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Marks |
     |----------------------|---------|---------|---------|---------|---------------|-------|
     | What is the capital of France? | Paris   | Berlin  | Madrid  | Rome    | A             | 1     |
   - Save to generate the test.
3. **Join & Take a Test**:
   - Students join with a code or QR.
   - Auto-submit responses when time expires, with instant results.
4. **View Results**: Teachers view analytics on student performance.

---

## 📊 Excel File Format

Upload Excel files with this format:

| QuestionText         | OptionA | OptionB | OptionC | OptionD | CorrectAnswer | Marks |
|----------------------|---------|---------|---------|---------|---------------|-------|
| What is the capital of France? | Paris   | Berlin  | Madrid  | Rome    | A             | 1     |

Each question and answer option should be filled accurately.

---

## 🔔 Notifications

- **Time Limit Alerts**: Countdown warnings with auto-submit when time runs out.
- **Toast Notifications**: Instant feedback on actions, errors, and success.

---

## 🔮 Future Enhancements

- Advanced analytics for teachers.
- Support for additional file formats.
- Adaptive difficulty and personalized feedback.

---

## 🤝 Contributing

Contributions are welcome! 

1. **Fork** the repository.
2. **Create a Branch** for new features or bug fixes.
3. **Commit** changes.
4. **Open a Pull Request** with a description.

---

## 📜 License

This project is licensed under the MIT License.

---

*Excelitest* makes test automation seamless, empowering educators and students with an efficient online assessment platform.
