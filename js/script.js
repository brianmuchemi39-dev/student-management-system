// ===== DATA =====
let students = [];   // array of objects, one object per student
let nextId = 1;      // gives every student a unique id

const courses = [
  { name: "Software Development", desc: "Learn to build apps with code.", duration: "6 months", level: "Intermediate", fee: "KES 45,000" },
  { name: "Web Design", desc: "Create modern, responsive websites.", duration: "3 months", level: "Beginner", fee: "KES 25,000" },
  { name: "Data Analysis", desc: "Turn raw data into clear insights.", duration: "4 months", level: "Intermediate", fee: "KES 35,000" },
  { name: "Cyber Security", desc: "Protect systems from attacks.", duration: "5 months", level: "Advanced", fee: "KES 50,000" },
  { name: "Networking", desc: "Set up and manage computer networks.", duration: "4 months", level: "Intermediate", fee: "KES 30,000" },
  { name: "Graphic Design", desc: "Design logos, posters and more.", duration: "3 months", level: "Beginner", fee: "KES 20,000" },
  { name: "Digital Marketing", desc: "Grow brands on social media.", duration: "2 months", level: "Beginner", fee: "KES 18,000" },
  { name: "Computer Packages", desc: "Master Word, Excel and PowerPoint.", duration: "1 month", level: "Beginner", fee: "KES 8,000" }
];

const $ = id => document.getElementById(id);   // short helper to find elements

// ===== SHARED: mobile menu =====
$("menuBtn").onclick = () => $("nav").classList.toggle("open");

// ===== HELPERS =====
function getPerformance(marks) {
  if (marks >= 80) return "Excellent";
  if (marks >= 70) return "Very Good";
  if (marks >= 60) return "Good";
  if (marks >= 50) return "Average";
  return "Failed";
}

function showMessage(element, text, isError) {
  element.textContent = text;
  element.className = isError ? "error" : "success";
}

// ===== COURSES PAGE + COURSE DROPDOWN (same list, so names always match) =====
if ($("courseGrid")) {
  for (const c of courses) {
    $("courseGrid").innerHTML += `
      <div class="card">
        <h3>${c.name}</h3>
        <p>${c.desc}</p>
        <p>${c.duration} | ${c.level} | ${c.fee}</p>
        <a class="btn" href="index.html#register">Register now</a>
      </div>`;
  }
}
if ($("course")) {
  for (const c of courses) $("course").innerHTML += `<option>${c.name}</option>`;
}

// ===== HOME PAGE =====
if ($("studentForm")) {

  // Show the table (optionally only students matching the search text)
  function showStudents() {
    const text = $("search").value.toLowerCase();
    $("tableBody").innerHTML = "";
    let found = 0;

    for (const s of students) {
      if (!s.name.toLowerCase().includes(text)) continue;   // skip non-matches
      found++;
      const status = getPerformance(s.marks);
      $("tableBody").innerHTML += `
        <tr>
          <td>${s.name}</td><td>${s.age}</td><td>${s.gender}</td><td>${s.course}</td>
          <td>${s.marks}</td><td class="${status.split(" ")[0]}">${status}</td>
          <td>
            <button onclick="updateMarks(${s.id})">Update</button>
            <button onclick="deleteStudent(${s.id})">Delete</button>
          </td>
        </tr>`;
    }
    $("searchMessage").textContent = (text && found === 0) ? "No matching student found." : "";
    showStats();
  }

  // Dashboard numbers + performance summary
  function showStats() {
    let total = students.length, passed = 0, sum = 0;
    const counts = { "Excellent": 0, "Very Good": 0, "Good": 0, "Average": 0, "Failed": 0 };

    for (const s of students) {
      sum += s.marks;
      if (s.marks >= 50) passed++;
      counts[getPerformance(s.marks)]++;
    }
    $("total").textContent = total;
    $("passed").textContent = passed;
    $("failed").textContent = total - passed;
    $("average").textContent = total ? (sum / total).toFixed(1) : 0;

    $("summary").innerHTML = "";
    for (const level in counts) {
      $("summary").innerHTML += `<div class="card"><h3 class="${level.split(" ")[0]}">${counts[level]}</h3><p>${level}</p></div>`;
    }
  }

  // Register a student
  $("studentForm").onsubmit = function (e) {
    e.preventDefault();                       // stop the page from reloading
    const name = $("name").value.trim();
    const age = $("age").value;
    const gender = $("gender").value;
    const course = $("course").value;
    const marks = $("marks").value;

    if (!name || !age || !gender || !course || marks === "")
      return showMessage($("formMessage"), "Please fill in all fields.", true);
    if (isNaN(age) || age < 1 || age > 120)
      return showMessage($("formMessage"), "Age must be a valid number.", true);
    if (marks < 0 || marks > 100)
      return showMessage($("formMessage"), "Marks must be between 0 and 100.", true);

    students.push({ id: nextId++, name, age: Number(age), gender, course, marks: Number(marks) });
    $("studentForm").reset();
    showMessage($("formMessage"), "Student registered successfully!", false);
    showStudents();
  };

  // Update marks
  function updateMarks(id) {
    const input = prompt("Enter the new marks (0-100):");
    if (input === null) return;               // user pressed Cancel
    if (input.trim() === "" || isNaN(input) || input < 0 || input > 100)
      return alert("Marks must be a number between 0 and 100.");
    for (const s of students) if (s.id === id) s.marks = Number(input);
    showStudents();
  }

  // Delete a student (keep everyone except the one with this id)
  function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;
    students = students.filter(s => s.id !== id);
    showStudents();
  }

  $("search").oninput = showStudents;         // search as you type
  showStudents();
}

// ===== CONTACT PAGE =====
if ($("contactForm")) {
  $("contactForm").onsubmit = function (e) {
    e.preventDefault();
    const email = $("cEmail").value.trim();
    const msg = $("contactMessage");

    if (!$("cName").value.trim() || !email || !$("cSubject").value.trim() || !$("cMessage").value.trim())
      return showMessage(msg, "All fields are required.", true);
    if (!email.includes("@") || !email.includes("."))
      return showMessage(msg, "Enter a valid email address.", true);
    if ($("cMessage").value.trim().length < 10)
      return showMessage(msg, "Message must be at least 10 characters.", true);

    showMessage(msg, "Thank you, your message has been sent.", false);
    $("contactForm").reset();
  };
}
