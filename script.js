import { messages } from "./data/messages.js";
import { reminders } from "./data/reminders.js";
import { questions } from "./data/questions.js";

// DOM
const messageText = document.getElementById("messageText");
const reminderText = document.getElementById("reminderText");
const questionText = document.getElementById("questionText");
const answerInput = document.getElementById("answerInput");
const submitBtn = document.getElementById("submitBtn");
const feedbackText = document.getElementById("feedbackText");
const photo = document.getElementById("photo");

// Utils
function randomIndex(length) {
  return Math.floor(Math.random() * length);
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

// Date logic
const today = new Date();
const todayKey = today.toISOString().split("T")[0];
const month = today.getMonth() + 1;
const day = today.getDate();
const isBirthday = month === 4 && day === 21;

// Daily data
let dailyData;

// 🎂 Birthday override
if (isBirthday) {
  dailyData = {
    message: "生日快樂 🤍 今天只要開心就好，其他都交給我。",
    reminder: "今天什麼都可以慢慢來。",
    question: {
      question: "今天誰最愛你？(英文名字)",
      answer: "Andy"
    }
  };
} else {
  // 🔒 Normal daily lock
  dailyData = JSON.parse(localStorage.getItem("dailyCombo"));

  if (!dailyData || dailyData.date !== todayKey) {
    dailyData = {
      date: todayKey,
      messageIndex: randomIndex(messages.length),
      reminderIndex: randomIndex(reminders.length),
      questionIndex: randomIndex(questions.length)
    };
    localStorage.setItem("dailyCombo", JSON.stringify(dailyData));
  }
}

// Render content
if (isBirthday) {
  messageText.textContent = dailyData.message;
  reminderText.textContent = dailyData.reminder;
  questionText.textContent = dailyData.question.question;
} else {
  messageText.textContent = messages[dailyData.messageIndex];
  reminderText.textContent = reminders[dailyData.reminderIndex];
  questionText.textContent = questions[dailyData.questionIndex].question;
}

// Handle answer
submitBtn.addEventListener("click", () => {
  const userAnswer = answerInput.value;

  const correctAnswer = isBirthday
    ? dailyData.question.answer
    : questions[dailyData.questionIndex].answer;

  if (normalize(userAnswer) === normalize(correctAnswer)) {
    feedbackText.textContent = "";
    showRandomPhoto();
  } else {
    feedbackText.textContent = isBirthday
      ? "不對喔 😌 再想一下，今天很重要。"
      : "錯了 😌 快去打給 Andy，他會提示你。";
  }
});

// Photos
function showRandomPhoto() {
  if (isBirthday) {
    photo.src = "photos/birthday.jpg";
  } else {
    // Corrected: Removed the outer brackets []
    const photos = Array.from({ length: 67 }, (_, i) => `photos/us${i + 1}.jpg`);
    
    // Now photos.length is 65, and it picks one string
    const selected = photos[randomIndex(photos.length)];
    photo.src = selected;
  }

  photo.style.display = "block";
}

