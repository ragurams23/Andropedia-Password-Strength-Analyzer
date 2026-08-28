const passwordInput = document.getElementById("passwordInput");
const toggleBtn = document.getElementById("toggleBtn");
const meterFill = document.getElementById("meterFill");
const strengthEl = document.getElementById("strengthEl");
const scoreEl = document.getElementById("scoreEl");
const checksEl = document.getElementById("checksEl");
const suggestionsEl = document.getElementById("suggestionsEl");

const commonPasswords = new Set([
  "password", "password123", "123456", "12345678", "qwerty", 
  "qwerty123", "admin", "letmein", "welcome", "123456789"
]);

const sequences = [
  "123456", "234567", "345678", "abcdef", "bcdefg",
  "qwerty", "654321", "fedcba"
];

// Toggle password visibility
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    toggleBtn.textContent = isPassword ? "Hide" : "Show";
  });
}

// Real-time input listener
if (passwordInput) {
  passwordInput.addEventListener("input", () => analyze(passwordInput.value));
}

function getPoolSize(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) pool += 33;
  return pool;
}

function analyze(password) {
  if (!password || password.trim() === "") {
    if (meterFill) {
      meterFill.style.width = "0%";
      meterFill.style.backgroundColor = "#e74c3c";
    }
    if (strengthEl) strengthEl.textContent = "Password Strength: NONE";
    if (scoreEl) scoreEl.textContent = "0/100";
    if (checksEl) {
      checksEl.innerHTML = `
        <div><span style="color:#e74c3c">✗</span> At least 12 characters</div>
        <div><span style="color:#e74c3c">✗</span> Uppercase letters</div>
        <div><span style="color:#e74c3c">✗</span> Lowercase letters</div>
        <div><span style="color:#e74c3c">✗</span> Numbers</div>
        <div><span style="color:#e74c3c">✗</span> Special characters</div>
        <div><span style="color:#2ecc71">✓</span> No excessive repetition</div>
        <div><span style="color:#2ecc71">✓</span> No predictable sequence</div>
        <div><span style="color:#2ecc71">✓</span> Not a common password</div>
      `;
    }
    if (suggestionsEl) suggestionsEl.innerHTML = "<li>Enter a password to begin analysis.</li>";
    return;
  }

  let score = 0;
  let suggestions = [];

  const hasLength = password.length >= 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  
  const lowerPass = password.toLowerCase();
  const isCommon = commonPasswords.has(lowerPass);
  const hasSequence = sequences.some(seq => lowerPass.includes(seq));
  const hasRepetition = /(.)\1{2,}/.test(password);

  if (hasLength) score += 25; else suggestions.push("Use at least 12 characters.");
  if (hasUpper) score += 15; else suggestions.push("Add uppercase letters.");
  if (hasLower) score += 15; else suggestions.push("Add lowercase letters.");
  if (hasNumber) score += 15; else suggestions.push("Add numbers.");
  if (hasSpecial) score += 15; else suggestions.push("Add special characters.");

  if (!hasRepetition) score += 5; else suggestions.push("Avoid long repeated characters.");
  if (!hasSequence) score += 5; else suggestions.push("Avoid sequential patterns (e.g., 1234, qwerty).");
  if (!isCommon) score += 5; else suggestions.push("This is a commonly used password.");

  if (!hasLength && score > 60) score = 60;
  if (isCommon) score = Math.min(score, 20);

  let status = "WEAK";
  let color = "#e74c3c";

  if (score >= 80) {
    status = "STRONG";
    color = "#2ecc71";
  } else if (score >= 50) {
    status = "MEDIUM";
    color = "#f39c12";
  }

  if (meterFill) {
    meterFill.style.width = `${score}%`;
    meterFill.style.backgroundColor = color;
  }
  if (strengthEl) strengthEl.textContent = `Password Strength: ${status}`;
  if (scoreEl) scoreEl.textContent = `${score}/100`;

  if (checksEl) {
    checksEl.innerHTML = `
      <div><span style="color:${hasLength ? '#2ecc71' : '#e74c3c'}">${hasLength ? '✓' : '✗'}</span> At least 12 characters</div>
      <div><span style="color:${hasUpper ? '#2ecc71' : '#e74c3c'}">${hasUpper ? '✓' : '✗'}</span> Uppercase letters</div>
      <div><span style="color:${hasLower ? '#2ecc71' : '#e74c3c'}">${hasLower ? '✓' : '✗'}</span> Lowercase letters</div>
      <div><span style="color:${hasNumber ? '#2ecc71' : '#e74c3c'}">${hasNumber ? '✓' : '✗'}</span> Numbers</div>
      <div><span style="color:${hasSpecial ? '#2ecc71' : '#e74c3c'}">${hasSpecial ? '✓' : '✗'}</span> Special characters</div>
      <div><span style="color:${!hasRepetition ? '#2ecc71' : '#e74c3c'}">${!hasRepetition ? '✓' : '✗'}</span> No excessive repetition</div>
      <div><span style="color:${!hasSequence ? '#2ecc71' : '#e74c3c'}">${!hasSequence ? '✓' : '✗'}</span> No predictable sequence</div>
      <div><span style="color:${!isCommon ? '#2ecc71' : '#e74c3c'}">${!isCommon ? '✓' : '✗'}</span> Not a common password</div>
    `;
  }

  if (suggestionsEl) {
    suggestionsEl.innerHTML = suggestions.length > 0 
      ? suggestions.map(item => `<li>${item}</li>`).join("")
      : "<li>Great job! Your password meets all core safety guidelines.</li>";
  }
}
