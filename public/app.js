const showLoginBtn = document.getElementById("showLogin");
const showRegisterBtn = document.getElementById("showRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const messageBox = document.getElementById("message");
const profile = document.getElementById("profile");
const profileText = document.getElementById("profileText");
const logoutBtn = document.getElementById("logoutBtn");

const TOKEN_KEY = "auth_token";

function showMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`.trim();
}

function switchTab(type) {
  const loginActive = type === "login";

  loginForm.classList.toggle("hidden", !loginActive);
  registerForm.classList.toggle("hidden", loginActive);
  showLoginBtn.classList.toggle("active", loginActive);
  showRegisterBtn.classList.toggle("active", !loginActive);
  showMessage("");
}

function setLoggedInView(user) {
  profile.classList.remove("hidden");
  profileText.textContent = `Hello ${user.name} (${user.email})`;
}

function setLoggedOutView() {
  profile.classList.add("hidden");
  profileText.textContent = "";
}

async function apiRequest(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message || "Request failed");
  }
  return payload;
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("Authenticating...");

  try {
    const payload = await apiRequest("/api/login", {
      email: document.getElementById("loginEmail").value,
      password: document.getElementById("loginPassword").value,
    });

    localStorage.setItem(TOKEN_KEY, payload.token);
    setLoggedInView(payload.user);
    showMessage(payload.message, "success");
  } catch (error) {
    showMessage(error.message, "error");
    setLoggedOutView();
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage("Creating account...");

  try {
    const payload = await apiRequest("/api/register", {
      name: document.getElementById("registerName").value,
      email: document.getElementById("registerEmail").value,
      password: document.getElementById("registerPassword").value,
    });

    localStorage.setItem(TOKEN_KEY, payload.token);
    setLoggedInView(payload.user);
    showMessage(payload.message, "success");
  } catch (error) {
    showMessage(error.message, "error");
    setLoggedOutView();
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(TOKEN_KEY);
  setLoggedOutView();
  showMessage("Logged out.", "success");
});

showLoginBtn.addEventListener("click", () => switchTab("login"));
showRegisterBtn.addEventListener("click", () => switchTab("register"));

async function restoreSession() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return;

  try {
    const response = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error();
    const payload = await response.json();
    setLoggedInView(payload.user);
    showMessage("Session restored.", "success");
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    setLoggedOutView();
  }
}

restoreSession();
