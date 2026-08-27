# Password Strength Analyzer

## Andropedia Technical Recruitment 2026 – Round 1

A browser-based Password Strength Analyzer built with HTML, CSS and vanilla JavaScript.

## Core Features
- Hidden password input with Show/Hide control
- Length analysis
- Uppercase/lowercase detection
- Number and special-character detection
- Repeated-character detection
- Predictable sequence detection
- Common-password detection
- Weak / Medium / Strong classification
- Improvement suggestions
- Empty and simple-password edge cases

## Bonus Features
- Strong password generator
- Configurable length and character types
- Copy generated password
- Responsive web interface

## Scoring Methodology
The score is capped between 0 and 100.

- Length: 30 points for 16+, 25 for 12–15, 15 for 8–11, 5 below 8
- Uppercase: +10
- Lowercase: +10
- Numbers: +10
- Special characters: +15
- No excessive repetition: +10, otherwise -10
- No predictable sequence: +10, otherwise -10
- Not a common password: +10, otherwise -20

Classification:
- 0–39: Weak
- 40–69: Medium
- 70–100: Strong

This is a transparent heuristic for the recruitment task, not a guarantee of real-world security.

## Edge Cases
The analyzer handles empty input, short passwords, numbers-only passwords, letters-only passwords, repeated characters, sequential patterns and common passwords.

## Technologies
- HTML5
- CSS3
- Vanilla JavaScript

## How to Run
1. Keep `index.html`, `style.css`, `script.js`, and `README.md` in the same folder.
2. Open `index.html` with Chrome, Edge, Firefox, or another modern browser.
3. Enter a test password and click the generator to test the application.

No server or package installation is required.

## Important Assumptions
- Analysis is performed locally in the browser.
- The common-password list is small and intended for demonstration.
- Do not enter passwords you actually use.

## Submission Checklist
- Source code
- README
- Scoring methodology
- Screenshots/demo
- Additional feature list
