// Get saved reports from browser storage
let reports = JSON.parse(
    localStorage.getItem("campusReports") || "[]"
);

// PAGE NAVIGATION
function showPage(page) {

    document.querySelectorAll(".page").forEach(section => {
        section.classList.add("hidden");
    });

    document.getElementById(page).classList.remove("hidden");

    if (page === "dashboard") {
        updateDashboard();
    }

    if (page === "reports") {
        displayReports();
    }

    if (page === "profile") {
        displayProfile();
    }
}

// SUBMIT REPORT
document.getElementById("issueForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        let issue = {

            id: "CA" + Date.now(),

            studentName:
                document.getElementById("studentName").value,

            registerNumber:
                document.getElementById("registerNumber").value,

            course:
                document.getElementById("course").value,

            year:
                document.getElementById("year").value,

            email:
                document.getElementById("email").value,

            title:
                document.getElementById("title").value,

            location:
                document.getElementById("location").value,

            category:
                document.getElementById("category").value,

            priority:
                document.getElementById("priority").value,

            department:
                document.getElementById("department").value,

            description:
                document.getElementById("description").value,

            anonymous:
                document.getElementById("anonymous").checked,

            status: "Submitted",

            date: new Date().toLocaleDateString()
        };

        reports.push(issue);

        localStorage.setItem(
            "campusReports",
            JSON.stringify(reports)
        );

        alert("Your issue has been submitted successfully!");

        this.reset();

        showPage("reports");
    }
);

// DISPLAY REPORTS
function displayReports() {

    let list = document.getElementById("reportList");

    let search = document
        .getElementById("search")
        .value.toLowerCase();

    list.innerHTML = "";

    let filtered = reports.filter(issue => {

        let profile = JSON.parse(
            localStorage.getItem("campusStudent") || "{}"
        );

        return (
            (!profile.registerNumber ||
            issue.registerNumber === profile.registerNumber) &&
            (
                issue.title.toLowerCase().includes(search) ||
                issue.location.toLowerCase().includes(search)
            )
        );
    });

    if (filtered.length === 0) {
        list.innerHTML = "<p>No reports found.</p>";
        return;
    }

    filtered.forEach(issue => {

        list.innerHTML += `

            <div class="report-item">

                <h3>${escapeHTML(issue.title)}</h3>

                <p>Report ID: ${escapeHTML(issue.id)}</p>

                <p>Student:
                    ${issue.anonymous
                        ? "Anonymous"
                        : escapeHTML(issue.studentName)}
                </p>

                <p>Register Number:
                    ${issue.anonymous
                        ? "Hidden"
                        : escapeHTML(issue.registerNumber)}
                </p>

                <p>Location: ${escapeHTML(issue.location)}</p>

                <p>Category: ${escapeHTML(issue.category)}</p>

                <p>Priority: ${escapeHTML(issue.priority)}</p>

                <p>Department: ${escapeHTML(issue.department)}</p>

                <p>Description: ${escapeHTML(issue.description)}</p>

                <p>Date: ${escapeHTML(issue.date)}</p>

                <span class="status">
                    ${escapeHTML(issue.status)}
                </span>

            </div>
        `;
    });
}

// SAFELY DISPLAY USER TEXT
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

// DASHBOARD COUNTS
function updateDashboard() {

    reports = JSON.parse(
        localStorage.getItem("campusReports") || "[]"
    );

    document.getElementById("total").innerText =
        reports.length;

    document.getElementById("submitted").innerText =
        reports.filter(r => r.status === "Submitted").length;

    document.getElementById("progress").innerText =
        reports.filter(r => r.status === "In Progress").length;

    document.getElementById("resolved").innerText =
        reports.filter(r => r.status === "Resolved").length;

    let dashboard = document.getElementById("dashboardReports");

    dashboard.innerHTML = "";

    reports.slice(-5).reverse().forEach(issue => {

        dashboard.innerHTML += `
            <div class="report-item">
                <h3>${escapeHTML(issue.title)}</h3>
                <p>${escapeHTML(issue.location)}</p>
                <span class="status">${escapeHTML(issue.status)}</span>
            </div>
        `;
    });
}

// STUDENT PROFILE
function displayProfile() {

    let profile = JSON.parse(
        localStorage.getItem("campusStudent") || "{}"
    );

    document.getElementById("profileName").innerText =
        profile.studentName || "Student Name";

    document.getElementById("profileReg").innerText =
        "Register Number: " +
        (profile.registerNumber || "Not added");

    document.getElementById("profileCourse").innerText =
        "Course: " + (profile.course || "Not added");

    document.getElementById("profileEmail").innerText =
        "Email: " + (profile.email || "Not added");
}

// SAVE STUDENT PROFILE WHEN A REPORT IS SUBMITTED
document.getElementById("issueForm").addEventListener(
    "submit",
    function() {

        let profile = {
            studentName:
                document.getElementById("studentName").value,

            registerNumber:
                document.getElementById("registerNumber").value,

            course:
                document.getElementById("course").value,

            email:
                document.getElementById("email").value
        };

        localStorage.setItem(
            "campusStudent",
            JSON.stringify(profile)
        );
    }
);

// INITIALIZE WEBSITE
updateDashboard();