// Login
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("loginMessage");

        if (username === "admin" && password === "admin123") {
            message.textContent = "Login successful!";

            setTimeout(function() {
                window.location.href = "dashboard-member3.html";
            }, 500);
        } else {
            message.textContent = "Invalid username or password.";
        }
    });
}


// Dashboard
function openJobs() {
    window.location.href = "jobs.html";
}

function openCandidates() {
    window.location.href = "candidates.html";
}

function openResults() {
    window.location.href = "results-member3.html";
}


// Logout
function logout() {
    window.location.href = "login.html";
}


// Add Job
if (document.getElementById("jobForm")) {
    document.getElementById("jobForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const title = document.getElementById("jobTitle").value.trim();
        const description = document.getElementById("jobDescription").value.trim();
        const skills = document.getElementById("requiredSkills").value.trim();

        if (title === "" || description === "" || skills === "") {
            alert("Please fill all job details.");
            return;
        }

        const jobList = document.getElementById("jobList");

        const jobItem = document.createElement("div");
        jobItem.className = "job-item";

        jobItem.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Required Skills:</strong> ${skills}</p>
            <button onclick="deleteJob(this)">Delete</button>
        `;

        jobList.appendChild(jobItem);

        alert("Job added successfully!");

        document.getElementById("jobForm").reset();
    });
}


// Delete Job
function deleteJob(button) {
    button.parentElement.remove();
}


// Add Candidate
if (document.getElementById("candidateForm")) {
    document.getElementById("candidateForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const name = document.getElementById("candidateName").value.trim();
        const email = document.getElementById("candidateEmail").value.trim();
        const resume = document.getElementById("resumeFilename").value.trim();
        const text = document.getElementById("extractedText").value.trim();

        if (name === "" || email === "" || resume === "" || text === "") {
            alert("Please fill all candidate details.");
            return;
        }

        const candidateList = document.getElementById("candidateList");

        const candidateItem = document.createElement("div");
        candidateItem.className = "candidate-item";

        candidateItem.innerHTML = `
            <h3>${name}</h3>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Resume:</strong> ${resume}</p>
            <p><strong>Extracted Text:</strong> ${text}</p>
            <button onclick="deleteCandidate(this)">Delete</button>
        `;

        candidateList.appendChild(candidateItem);

        alert("Candidate added successfully!");

        document.getElementById("candidateForm").reset();
    });
}


// Delete Candidate
function deleteCandidate(button) {
    button.parentElement.remove();
}


// Dashboard Navigation
function goDashboard() {
    window.location.href = "dashboard-member3.html";
}


// Add Screening Result
if (document.getElementById("resultForm")) {
    document.getElementById("resultForm").addEventListener("submit", function(event) {
        event.preventDefault();

        const candidate = document.getElementById("candidate").value.trim();
        const job = document.getElementById("job").value.trim();
        const matchedSkills = document.getElementById("matchedSkills").value.trim();
        const score = document.getElementById("score").value.trim();
        const rank = document.getElementById("rank").value.trim();

        if (
            candidate === "" ||
            job === "" ||
            matchedSkills === "" ||
            score === "" ||
            rank === ""
        ) {
            alert("Please fill all screening result details.");
            return;
        }

        const table = document.getElementById("resultsTable");

        const row = table.insertRow();

        row.innerHTML = `
            <td>${rank}</td>
            <td>${candidate}</td>
            <td>${job}</td>
            <td>${matchedSkills}</td>
            <td>${score}</td>
        `;

        alert("Screening result added successfully!");

        document.getElementById("resultForm").reset();
    });
}