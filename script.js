// ========================================
// PORTGEN - FINAL SYNC SCRIPT
// ========================================

var resumeInput = document.getElementById("resumeInput");
var uploadButton = document.getElementById("uploadButton");
var uploadStatus = document.getElementById("uploadStatus");

if (uploadButton && resumeInput) {
    uploadButton.onclick = () => resumeInput.click();
    resumeInput.onchange = uploadResume;
}

async function uploadResume() {
    var file = resumeInput.files[0];
    if (!file) return;

    uploadButton.disabled = true;
    uploadButton.textContent = "Analyzing...";
    uploadStatus.textContent = "Gemini AI is processing your resume...";

    var formData = new FormData();
    formData.append("resume", file);

    try {
        var response = await fetch("/upload", { method: "POST", body: formData });
        var result = await response.json();
        if (!response.ok) throw new Error(result.error || "Upload failed");

        var data = result.data || {};
        
        // 1. Basic Fields
        document.getElementById("editName").value = data.name || "";
        document.getElementById("editEmail").value = data.email || "";
        document.getElementById("editPhone").value = data.phone || "";
        document.getElementById("editAbout").value = data.about || "";
        document.getElementById("editSkills").value = Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || "");
        document.getElementById("editEducation").value = Array.isArray(data.education) ? data.education.join("\n") : (data.education || "");
        document.getElementById("editExperience").value = Array.isArray(data.experience) ? data.experience.join("\n") : (data.experience || "");

        // 2. Clear and Load Projects
        var projContainer = document.getElementById("projectsContainer");
        projContainer.innerHTML = ""; // Clear old boxes
        if (Array.isArray(data.projects)) {
            data.projects.forEach(proj => {
                // If AI gives just a string, convert to object
                var p = typeof proj === 'string' ? {title: proj, description: ""} : proj;
                addProject(p.title || p.name, p.description);
            });
        }

        uploadStatus.textContent = "Data extracted! Review below and click Generate. ✓";
        document.getElementById("editSection").scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        uploadStatus.textContent = "Error: " + error.message;
    } finally {
        uploadButton.disabled = false;
        uploadButton.textContent = "📄 Upload Resume";
    }
}

// Updated Add Project to accept AI data
function addProject(title = "", desc = "") {
    var container = document.getElementById("projectsContainer");
    var div = document.createElement("div");
    div.className = "project-input";
    div.innerHTML = `
        <h3>Project</h3>
        <input type="text" class="project-title" placeholder="Project Name" value="${title}">
        <textarea class="project-description" rows="3" placeholder="Description">${desc}</textarea>
        <button type="button" class="remove-project-btn" onclick="this.parentElement.remove()">Remove</button>
    `;
    container.appendChild(div);
}

// Function to collect data and go to portfolio
function generatePortfolio() {
    // Collect projects from the dynamic boxes
    var projectsList = [];
    document.querySelectorAll(".project-input").forEach(el => {
        var t = el.querySelector(".project-title").value;
        if (t) projectsList.push({ title: t, description: el.querySelector(".project-description").value });
    });

    var portfolioData = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editPhone").value,
        about: document.getElementById("editAbout").value,
        skills: document.getElementById("editSkills").value,
        education: document.getElementById("editEducation").value,
        experience: document.getElementById("editExperience").value,
        projects: projectsList,
        // Socials
        linkedin: document.getElementById("editLinkedin")?.value || "",
        github: document.getElementById("editGithub")?.value || "",
        website: document.getElementById("editWebsite")?.value || "",
        background: document.getElementById("editBackground")?.value || ""
    };

    localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
    window.location.href = "/portfolio.html";
}

function createManually() {
    document.getElementById("editSection").scrollIntoView({ behavior: "smooth" });
}

function selectDesign(num) {
    localStorage.setItem("selectedDesign", num);
    document.getElementById("selectedDesignText").textContent = "✓ Design " + num + " selected";
}