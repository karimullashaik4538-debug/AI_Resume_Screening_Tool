// ========================================
// LOGIN
// ========================================

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const username =
                document.getElementById(
                    "username"
                ).value.trim();

            const password =
                document.getElementById(
                    "password"
                ).value.trim();

            const message =
                document.getElementById(
                    "loginMessage"
                );

            if (!username || !password) {

                message.textContent =
                    "Please enter username and password.";

                message.style.color = "red";

                return;
            }

            try {

                const response =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    message.textContent =
                        "Login successful!";

                    message.style.color =
                        "green";

                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        700
                    );

                } else {

                    message.textContent =
                        data.message ||
                        "Invalid login.";

                    message.style.color =
                        "red";
                }

            } catch (error) {

                message.textContent =
                    "Backend is not running.";

                message.style.color =
                    "red";
            }

        }
    );
}


// ========================================
// JOB DESCRIPTION
// ========================================

const jobDescriptionForm =
    document.getElementById(
        "jobDescriptionForm"
    );

if (jobDescriptionForm) {

    jobDescriptionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const title =
                document.getElementById(
                    "jobTitle"
                ).value.trim();

            const description =
                document.getElementById(
                    "jobDescription"
                ).value.trim();

            const skills =
                document.getElementById(
                    "requiredSkills"
                ).value.trim();

            const message =
                document.getElementById(
                    "jobMessage"
                );

            if (!title ||
                !description ||
                !skills) {

                message.textContent =
                    "Please fill all job details.";

                message.style.color =
                    "red";

                return;
            }

            try {

                const response =
                    await fetch(
                        "/api/jobs",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                title: title,
                                description:
                                    description,
                                required_skills:
                                    skills
                            })
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    message.textContent =
                        "Job saved successfully!";

                    message.style.color =
                        "green";

                    setTimeout(
                        function () {

                            window.location.href =
                                "resume-upload.html";

                        },
                        800
                    );

                } else {

                    message.textContent =
                        data.error ||
                        "Unable to save job.";

                    message.style.color =
                        "red";
                }

            } catch (error) {

                message.textContent =
                    "Backend is not running.";

                message.style.color =
                    "red";
            }

        }
    );
}


// ========================================
// RESUME UPLOAD
// ========================================

const resumeUploadForm =
    document.getElementById(
        "resumeUploadForm"
    );

if (resumeUploadForm) {

    const resumeFile =
        document.getElementById(
            "resumeFile"
        );

    const fileInfo =
        document.getElementById(
            "fileInfo"
        );

    const message =
        document.getElementById(
            "resumeMessage"
        );

    const extractedText =
        document.getElementById(
            "extractedText"
        );


    resumeFile.addEventListener(
        "change",
        function () {

            const file =
                resumeFile.files[0];

            if (!file) {

                fileInfo.textContent =
                    "";

                return;
            }

            fileInfo.textContent =
                "Selected file: " +
                file.name;
        }
    );


    resumeUploadForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const file =
                resumeFile.files[0];

            if (!file) {

                message.textContent =
                    "Please select a PDF resume.";

                message.style.color =
                    "red";

                return;
            }

            const extension =
                file.name
                    .toLowerCase()
                    .split(".")
                    .pop();

            if (extension !== "pdf") {

                message.textContent =
                    "Only PDF files are allowed.";

                message.style.color =
                    "red";

                return;
            }

            const maxSize =
                5 * 1024 * 1024;

            if (file.size > maxSize) {

                message.textContent =
                    "File size must be less than 5 MB.";

                message.style.color =
                    "red";

                return;
            }

            const formData =
                new FormData();

            formData.append(
                "resume",
                file
            );

            message.textContent =
                "Uploading and processing...";

            message.style.color =
                "black";

            try {

                const response =
                    await fetch(
                        "/upload",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();

                if (response.ok) {

                    message.textContent =
                        "Resume processed successfully!";

                    message.style.color =
                        "green";

                    if (extractedText) {

                        extractedText.value =
                            data.text || "";
                    }

                    localStorage.setItem(
                        "resumeText",
                        data.text || ""
                    );

                    localStorage.setItem(
                        "resumeFilename",
                        data.filename || ""
                    );

                } else {

                    message.textContent =
                        data.error ||
                        "Resume processing failed.";

                    message.style.color =
                        "red";
                }

            } catch (error) {

                message.textContent =
                    "Backend is not running.";

                message.style.color =
                    "red";
            }

        }
    );
}


// ========================================
// RESULTS / AI MATCHING
// ========================================

async function analyzeResumes() {

    const jobDescription =
        document.getElementById(
            "resultJobDescription"
        ).value.trim();

    const message =
        document.getElementById(
            "resultMessage"
        );

    if (!jobDescription) {

        message.textContent =
            "Please enter a job description.";

        message.style.color =
            "red";

        return;
    }


    const resumeText =
        localStorage.getItem(
            "resumeText"
        ) || "";


    if (!resumeText) {

        message.textContent =
            "Please upload a resume first.";

        message.style.color =
            "red";

        return;
    }


    const candidates = [
        {
            name: "Uploaded Candidate",
            resume_text: resumeText
        }
    ];


    message.textContent =
        "Analyzing resume...";

    message.style.color =
        "black";


    try {

        const response =
            await fetch(
                "/api/match",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        job_description:
                            jobDescription,
                        candidates:
                            candidates
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            message.textContent =
                data.error ||
                "Analysis failed.";

            message.style.color =
                "red";

            return;
        }


        displayResults(
            data.results || []
        );


        message.textContent =
            "Resume analysis completed!";

        message.style.color =
            "green";


    } catch (error) {

        message.textContent =
            "Backend is not running.";

        message.style.color =
            "red";
    }
}


// ========================================
// DISPLAY RESULTS
// ========================================

function displayResults(results) {

    const body =
        document.getElementById(
            "resultsBody"
        );

    const total =
        document.getElementById(
            "totalCandidates"
        );

    const highest =
        document.getElementById(
            "highestScore"
        );

    const top =
        document.getElementById(
            "topCandidate"
        );


    body.innerHTML = "";


    total.textContent =
        results.length;


    if (results.length === 0) {

        highest.textContent =
            "0%";

        top.textContent =
            "-";

        return;
    }


    highest.textContent =
        results[0].score + "%";


    top.textContent =
        results[0].name;


    results.forEach(
        function (result) {

            const row =
                document.createElement(
                    "tr"
                );


            const matched =
                result.matched_skills
                    .join(", ") || "-";


            const missing =
                result.missing_skills
                    .join(", ") || "-";


            row.innerHTML = `

                <td>
                    ${result.rank}
                </td>

                <td>
                    ${result.name}
                </td>

                <td>
                    <strong>
                        ${result.score}%
                    </strong>
                </td>

                <td>
                    ${matched}
                </td>

                <td>
                    ${missing}
                </td>

            `;


            body.appendChild(row);

        }
    );
}