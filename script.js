const passwordInput = document.getElementById("password");
const toggleBtn = document.getElementById("toggleBtn");
const meterFill = document.getElementById("meterFill");
const strengthEl = document.getElementById("strength");
const scoreEl = document.getElementById("score");
const checksEl = document.getElementById("checks");
const suggestionsEl = document.getElementById("suggestions");

const commonPasswords = new Set([
  "password", "password123", "123456", "123456789", "qwerty",
  "qwerty123", "admin", "letmein", "welcome", "abc123", "iloveyou"
]);

const sequences = [
  "123456", "234567", "345678", "abcdef", "bcdefg",
  "qwerty", "654321", "fedcba"
];

toggleBtn.addEventListener("click", () => {
  const hidden = passwordInput.type === "password";
  passwordInput.type = hidden ? "text" : "password";
  toggleBtn.textContent = hidden ? "Hide" : "Show";
});

passwordInput.addEventListener("input", () => analyze(passwordInput.value));

function getPoolSize(password) {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/[0-9]/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 33;
  return pool;
}

function formatCrackTime(seconds) {
  if (seconds < 1) return "Less than 1 second";
  if (seconds > 315576000000000) return "Extremely long";

  const units = [
    ["year", 31557600],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1]
  ];

  for (const [name, size] of units) {
    if (seconds >= size) {
      const value = Math.floor(seconds / size);
      return `${value.toLocaleString()} ${name}${value === 1 ? "" : "s"}`;
    }
  }
}

function analyze(password) {
  if (!password) {
    strengthEl.textContent = "Enter a password";
    scoreEl.textContent = "0/100";
    meterFill.style.width = "0";
    checksEl.innerHTML = "";
    suggestionsEl.innerHTML = "";
    return;
  }

  const repeated = /(.)\1\1/.test(password);
  const predictable = sequences.some(
    sequence => password.toLowerCase().includes(sequence)
  );
  const common = commonPasswords.has(password.toLowerCase());

  const tests = [
    ["At least 12 characters", password.length >= 12],
    ["Uppercase letters", /[A-Z]/.test(password)],
    ["Lowercase letters", /[a-z]/.test(password)],
    ["Numbers", /[0-9]/.test(password)],
    ["Special characters", /[^A-Za-z0-9]/.test(password)],
    ["No excessive repetition", !repeated],
    ["No predictable sequence", !predictable],
    ["Not a common password", !common]
  ];

  let score = password.length >= 16 ? 30 :
              password.length >= 12 ? 25 :
              password.length >= 8 ? 15 : 5;

  score += /[A-Z]/.test(password) ? 10 : 0;
  score += /[a-z]/.test(password) ? 10 : 0;
  score += /[0-9]/.test(password) ? 10 : 0;
  score += /[^A-Za-z0-9]/.test(password) ? 15 : 0;
  score += repeated ? -10 : 10;
  score += predictable ? -10 : 10;
  score += common ? -20 : 10;

  score = Math.max(0, Math.min(100, score));

  const strength = score >= 70 ? "STRONG" :
                   score >= 40 ? "MEDIUM" : "WEAK";

  strengthEl.textContent = `Password Strength: ${strength}`;
  scoreEl.textContent = `${score}/100`;
  meterFill.style.width = `${score}%`;
  meterFill.style.background =
    strength === "STRONG" ? "#22c55e" :
    strength === "MEDIUM" ? "#eab308" : "#ef4444";

  checksEl.innerHTML = tests.map(([label, ok]) =>
    `<div class="check ${ok ? "good" : "bad"}">${ok ? "✓" : "✗"} ${label}</div>`
  ).join("");

  const suggestions = [];
  if (password.length < 12) suggestions.push("Use at least 12 characters.");
  if (!/[A-Z]/.test(password)) suggestions.push("Add uppercase letters.");
  if (!/[a-z]/.test(password)) suggestions.push("Add lowercase letters.");
  if (!/[0-9]/.test(password)) suggestions.push("Add numbers.");
  if (!/[^A-Za-z0-9]/.test(password)) suggestions.push("Add special characters.");
  if (repeated) suggestions.push("Avoid long repeated characters.");
  if (predictable) suggestions.push("Avoid predictable sequences such as 123456 or abcdef.");
  if (common) suggestions.push("Avoid common passwords.");

  suggestionsEl.innerHTML = suggestions.length
    ? `<strong>Suggestions:</strong><ul>${suggestions.map(s => `<li>${s}</li>`).join("")}</ul>`
    : "<strong>Suggestions:</strong> Good job. Keep passwords unique and never reuse them.";
}

document.getElementById("generateBtn").addEventListener("click", () => {
  const length = Math.max(
    8,
    Math.min(32, Number(document.getElementById("length").value) || 16)
  );

  const sets = [];
  if (document.getElementById("upper").checked) sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
  if (document.getElementById("lower").checked) sets.push("abcdefghijkmnopqrstuvwxyz");
  if (document.getElementById("numbers").checked) sets.push("23456789");
  if (document.getElementById("symbols").checked) sets.push("!@#$%^&*()-_=+");

  if (!sets.length) {
    alert("Select at least one character type.");
    return;
  }

  const chars = sets.map(set => set[Math.floor(Math.random() * set.length)]);
  const all = sets.join("");

  while (chars.length < length) {
    chars.push(all[Math.floor(Math.random() * all.length)]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  document.getElementById("generatedPassword").value = chars.join("");
});

document.getElementById("copyBtn").addEventListener("click", async () => {
  const value = document.getElementById("generatedPassword").value;
  if (!value) return;

  try {
    await navigator.clipboard.writeText(value);
    document.getElementById("copyBtn").textContent = "Copied!";
    setTimeout(() => {
      document.getElementById("copyBtn").textContent = "Copy";
    }, 1200);
  } catch {
    alert("Copy is unavailable. Select and copy the generated password manually.");
  }
});
