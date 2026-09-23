// =========================
// MEMBER 3 FRONTEND JS
// =========================


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("loginMessage");

        if (username === "admin" && password === "admin123") {

            message.textContent = "Login successful!";

            setTimeout(function() {
                window.location.href = "dashboard.html";
            }, 500);

        } else {

            message.textContent = "Invalid username or password.";

        }

    });

}


// =========================
// DASHBOARD NAVIGATION
// =========================

function openJobs() {
    window.location.href = "jobs.html";
}

function openCandidates() {
    window.location.href = "candidates.html";
}

function openResults() {
    window.location.href = "results-member3.html";
}


// =========================
// JOB FORM
// =========================

const jobForm = document.getElementById("jobForm");

if (jobForm) {

    jobForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const title =
            document.getElementById("jobTitle").value.trim();

        const description =
            document.getElementById("jobDescription").value.trim();

        const skills =
            document.getElementById("requiredSkills").value.trim();


        if (
            title === "" ||
            description === "" ||
            skills === ""
        ) {

            alert("Please fill all job details.");
            return;

        }


        const jobItem = document.createElement("div");

        jobItem.className = "job-item";

        jobItem.innerHTML = `
            <div>
                <h3>${title}</h3>

                <p>${description}</p>

                <strong>Required Skills:</strong>

                <span>${skills}</span>
            </div>

            <button
                class="delete-btn"
                onclick="deleteJob(this)"
            >
                Delete
            </button>
        `;


        document
            .getElementById("jobsList")
            .appendChild(jobItem);


        alert("Job added successfully!");

        jobForm.reset();

    });

}


// =========================
// DELETE JOB
// =========================

function deleteJob(button) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this job?"
    );

    if (confirmDelete) {

        button.parentElement.remove();

    }

}


// =========================
// CANDIDATE FORM
// =========================

const candidateForm =
    document.getElementById("candidateForm");

if (candidateForm) {

    candidateForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("candidateName").value.trim();

        const email =
            document.getElementById("candidateEmail").value.trim();

        const resume =
            document.getElementById("resumeFilename").value.trim();

        const extractedText =
            document.getElementById("extractedText").value.trim();


        if (
            name === "" ||
            email === "" ||
            resume === "" ||
            extractedText === ""
        ) {

            alert("Please fill all candidate details.");
            return;

        }


        const candidateItem =
            document.createElement("div");

        candidateItem.className =
            "candidate-item";


        candidateItem.innerHTML = `
            <div class="candidate-info">

                <h3>${name}</h3>

                <p>
                    <strong>Email:</strong>
                    ${email}
                </p>

                <p>
                    <strong>Resume:</strong>
                    ${resume}
                </p>

                <p>
                    <strong>Extracted Text:</strong>
                    ${extractedText}
                </p>

            </div>

            <button
                class="delete-btn"
                onclick="deleteCandidate(this)"
            >
                Delete
            </button>
        `;


        document
            .getElementById("candidatesList")
            .appendChild(candidateItem);


        alert("Candidate added successfully!");

        candidateForm.reset();

    });

}


// =========================
// DELETE CANDIDATE
// =========================

function deleteCandidate(button) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this candidate?"
    );

    if (confirmDelete) {

        button.parentElement.remove();

    }

}


// =========================
// SCREENING RESULT FORM
// =========================

const resultForm =
    document.getElementById("resultForm");

if (resultForm) {

    resultForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const candidate =
            document.getElementById("resultCandidate").value.trim();

        const job =
            document.getElementById("resultJob").value.trim();

        const matchedSkills =
            document.getElementById("matchedSkills").value.trim();

        const score =
            document.getElementById("score").value;

        const rank =
            document.getElementById("rank").value;


        if (
            candidate === "" ||
            job === "" ||
            matchedSkills === "" ||
            score === "" ||
            rank === ""
        ) {

            alert("Please fill all result details.");
            return;

        }


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>
                <span class="rank-badge">
                    ${rank}
                </span>
            </td>

            <td>
                ${candidate}
            </td>

            <td>
                ${job}
            </td>

            <td>
                ${matchedSkills}
            </td>

            <td>
                <span class="score">
                    ${score}%
                </span>
            </td>
        `;


        document
            .getElementById("resultsTable")
            .appendChild(row);


        alert("Screening result added successfully!");

        resultForm.reset();

    });

}


// =========================
// DASHBOARD
// =========================

function goDashboard() {

    window.location.href =
        "dashboard-member3.html";

}


// =========================
// LOGOUT
// =========================

function logout() {

    window.location.href =
        "index.html";

}