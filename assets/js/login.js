const LOGIN_USERNAME = "Entertainment";
const LOGIN_PASSWORD = "Pass";
const REMEMBER_KEY = "bdtv_remembered_login_v2";
const FAIL_KEY = "bdtv_login_fail_count_v2";
const LOCK_UNTIL_KEY = "bdtv_login_lock_until_v2";

function isLocked() {
  const lockUntil = parseInt(localStorage.getItem(LOCK_UNTIL_KEY) || "0", 10);
  if (!lockUntil) return false;
  const now = Date.now();
  if (now < lockUntil) return (lockUntil - now) / 1000;
  localStorage.removeItem(LOCK_UNTIL_KEY);
  localStorage.removeItem(FAIL_KEY);
  return false;
}

function recordFailure() {
  const count = parseInt(localStorage.getItem(FAIL_KEY) || "0", 10) + 1;
  localStorage.setItem(FAIL_KEY, String(count));
  if (count >= 5) {
    const lockUntil = Date.now() + 30_000;
    localStorage.setItem(LOCK_UNTIL_KEY, String(lockUntil));
  }
}

function resetFailures() {
  localStorage.removeItem(FAIL_KEY);
  localStorage.removeItem(LOCK_UNTIL_KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("loginOverlay");
  const form = document.getElementById("loginForm");
  const userInput = document.getElementById("loginUser");
  const passInput = document.getElementById("loginPass");
  const remember = document.getElementById("loginRemember");
  const errorEl = document.getElementById("loginError");

  if (!overlay || !form) return;

  // Skip login if remembered
  const remembered = localStorage.getItem(REMEMBER_KEY) === "true";
  if (remembered && !isLocked()) {
    overlay.classList.add("hidden");
    return;
  }

  overlay.classList.remove("hidden");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const lockLeft = isLocked();
    if (lockLeft) {
      errorEl.textContent = `Too many attempts. Try again in ${Math.ceil(lockLeft)}s.`;
      return;
    }

    const u = userInput.value.trim();
    const p = passInput.value;

    if (u === LOGIN_USERNAME && p === LOGIN_PASSWORD) {
      resetFailures();
      if (remember.checked) {
        localStorage.setItem(REMEMBER_KEY, "true");
      }
      errorEl.textContent = "";
      overlay.classList.add("hidden");
    } else {
      recordFailure();
      errorEl.textContent = "Invalid username or password.";
    }
  });
});