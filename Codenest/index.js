"use strict";

/* ---------- Data ---------- */
const COURSES = [
  { id: "frontend", title: "Front-end Development", level: "Beginner", duration: "12 weeks", price: 50000,
    desc: "HTML, CSS and JavaScript from scratch. Build responsive websites." },
  { id: "fullstack", title: "Fullstack Web Development", level: "Intermediate", duration: "20 weeks", price: 100000,
    desc: "Front-end plus server-side programming and databases." },
  { id: "react", title: "ReactJS / NextJS", level: "Intermediate", duration: "8 weeks", price: 80000,
    desc: "Build modern single-page apps and production-ready React sites." },
  { id: "mobile", title: "Mobile App Development", level: "Intermediate", duration: "16 weeks", price: 100000,
    desc: "Create cross-platform mobile apps for Android and iOS." },
  { id: "data", title: "Data Science", level: "Intermediate", duration: "16 weeks", price: 110000,
    desc: "Python, data analysis, visualization and intro to machine learning." },
  { id: "design", title: "Product / Graphic Design", level: "Beginner", duration: "10 weeks", price: 50000,
    desc: "UI/UX principles, wireframing and graphic design tools." },
  { id: "literacy", title: "Computer Literacy", level: "Beginner", duration: "4 weeks", price: 20000,
    desc: "Computer basics, typing, office tools and safe internet use." }
];

const STORAGE_KEY = "academy_enrollments";

/* ---------- Helpers ---------- */
const $ = (id) => document.getElementById(id);
const naira = (n) => "\u20A6" + n.toLocaleString("en-NG");

function loadEnrollments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem("academy_session"));
  } catch {
    return null;
  }
}

/* ---------- Courses ---------- */
function renderCourses() {
  const query = $("search").value.trim().toLowerCase();
  const level = $("levelFilter").value;

  const filtered = COURSES.filter((c) =>
    (level === "all" || c.level === level) &&
    (c.title + " " + c.desc).toLowerCase().includes(query)
  );

  $("courseGrid").innerHTML = filtered.map((c) => `
    <article class="card">
      <h3>${c.title}</h3>
      <div class="meta"><span class="tag">${c.level}</span><span class="tag">${c.duration}</span></div>
      <p>${c.desc}</p>
      <div class="price">${naira(c.price)}</div>
      <a href="auth.html?mode=register&course=${c.id}" class="btn">Enroll</a>
    </article>`).join("");

  $("noCourses").classList.toggle("hidden", filtered.length > 0);
}

/* ---------- Stats ---------- */
function updateStats() {
  $("statCourses").textContent = COURSES.length;
  $("statStudents").textContent = loadEnrollments().length;
}

/* ---------- Init ---------- */
function init() {
  $("year").textContent = new Date().getFullYear();
  const levelFromUrl = new URLSearchParams(window.location.search).get("level");
  if (["Beginner", "Intermediate"].includes(levelFromUrl)) {
    $("levelFilter").value = levelFromUrl;
  }
  renderCourses();
  updateStats();
  const session = getSession();
  if (session && session.role === "student") {
    $("userGreeting").textContent = `Welcome back, ${session.name.split(" ")[0]}!`;
    $("userGreeting").classList.remove("hidden");
  }

  // Mobile menu
  $("menuBtn").addEventListener("click", () => {
    const open = $("navLinks").classList.toggle("open");
    $("menuBtn").setAttribute("aria-expanded", open);
  });
  $("navLinks").addEventListener("click", () => {
    $("navLinks").classList.remove("open");
    $("menuBtn").setAttribute("aria-expanded", "false");
  });

  // Course search / filter
  $("search").addEventListener("input", renderCourses);
  $("levelFilter").addEventListener("change", renderCourses);

}

document.addEventListener("DOMContentLoaded", init);
