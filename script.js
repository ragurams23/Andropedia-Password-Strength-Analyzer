    document.addEventListener("DOMContentLoaded", () => {
  // Matched HTML IDs
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("toggleBtn");
  const meterFill = document.getElementById("meterFill");
  const strengthEl = document.getElementById("strength");
  const scoreEl = document.getElementById("score");
  const checksEl = document.getElementById("checks");
  const suggestionsEl = document.getElementById("suggestions");

  // Generator Controls
  const lengthInput = document.getElementById("length");
  const upperCheck = document.getElementById("upper");
  const lowerCheck = document.getElementById("lower");
  const numbersCheck = document.getElementById("numbers");
  const symbolsCheck = document.getElementById("symbols");
  const generateBtn = document.getElementById("generateBtn");
  const generatedPasswordInput = document.getElementById("generatedPassword");
  const copyBtn = document.getElementById("copyBtn");

  const commonPasswords = new Set([
    "password", "password123", "123456", "12345678", "qwerty", 
    "qwerty123", "admin", "letmein", "welcome", "123456789"
  ]);

  const sequences = [
    "123456", "234567", "345678", "abcdef", "bcdefg",
    "qwerty", "654321", "fedcba"
  ];

  // 1. Toggle Show/Hide Password
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener("click", () => {
      const isPassword = passwordInput.type === "password";
      passwordInput.type = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "Hide" : "Show";
    });
  }

  // 2. Real-time Analysis Listener
  if (passwordInput) {
    passwordInput.addEventListener("input", () => analyze(passwordInput.value));
  }

  // 3. Password Analyzer Logic
  function analyze(password) {
    if (!password || password.trim() === "") {
      if (meterFill) {
        meterFill.style.width = "0%";
        meterFill.style.backgroundColor = "#e74c3c";
      }
      if (strengthEl) strengthEl.textContent = "Enter a password";
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
      if (suggestionsEl) suggestionsEl.innerHTML = "";
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
    if (!hasSequence) score += 5; else suggestions.push("Avoid sequential patterns.");
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
        ? suggestions.map(item => `<div>• ${item}</div>`).join("")
        : "<div style='color:#2ecc71;'>✓ Great job! Your password meets all core safety guidelines.</div>";
    }
  }

  // 4. Generator Functionality
  if (generateBtn) {
    generateBtn.addEventListener("click", () => {
      const length = parseInt(lengthInput.value) || 16;
      let chars = "";
      if (upperCheck.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (lowerCheck.checked) chars += "abcdefghijklmnopqrstuvwxyz";
      if (numbersCheck.checked) chars += "0123456789";
      if (symbolsCheck.checked) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

      if (!chars) {
        alert("Select at least one character type!");
        return;
      }

      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      generatedPasswordInput.value = result;
    });
  }

  // 5. Copy Button Functionality
  if (copyBtn && generatedPasswordInput) {
    copyBtn.addEventListener("click", () => {
      if (!generatedPasswordInput.value) return;
      navigator.clipboard.writeText(generatedPasswordInput.value).then(() => {
        const origText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = origText), 1500);
      });
    });
  }
});
