# 🍗 KFC Siam Customer Behavior Survey

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-survey.htunthihamyo.com-e4002b?style=for-the-badge)](https://survey.htunthihamyo.com/kfc/)

A modern, responsive web-based survey form built to collect customer behavior and dining preference data from KFC Siam (Siam University) visitors. Designed as an academic research project by Global Academy students.

> 🚀 **Final deployed version:** [https://survey.htunthihamyo.com/kfc/](https://survey.htunthihamyo.com/kfc/)

---

## 📋 Overview

This survey collects anonymous responses about:
- **Personal Information** – Occupation, faculty (if student)
- **Demographics** – Age, gender, nationality
- **Customer Behavior** – Visit frequency, dining type, order method, payment, budget
- **Menu Preferences** – Favorite category and add-ons
- **Promotions** – Preferred promotion types
- **Ratings** – Flavor quality and overall service experience

---

## 🗂️ Project Structure

```
kfc form/
├── index.html          # Main survey form (HTML structure)
├── style.css           # Styling and responsive design
├── survey.js           # Form logic, validation, and interactivity
├── kfc.png             # KFC favicon
├── kfc.svg             # KFC logo (SVG)
├── qr.png              # QR code asset
└── README.md           # This file
```

> **Note:** Personal photos (`thiha*.png/jpg`) and AI-generated images (`Gemini_Generated_Image_*.png`) are excluded from version control via `.gitignore`.

---

## ✨ Features

- **Interactive pill-style radio/checkbox inputs** – Styled toggle buttons for clean UX
- **Animated range sliders** – Dynamic gradient background that updates in real time
- **Searchable nationality dropdown** – Live-filter from a full country list
- **Faculty dropdown** – Conditionally shown only when "Student" is selected
- **Client-side validation** – Alerts user if required fields are missing before submit
- **Fully responsive** – Optimized for mobile, tablet, and desktop
- **Dark/modern theme** – KFC red accent color palette with glassmorphism card design

---

## 🌐 Deployment

The final deployed version of this survey is live at:

**[https://survey.htunthihamyo.com/kfc/](https://survey.htunthihamyo.com/kfc/)**

The site is hosted on a custom domain and serves the static files directly — no backend or build step required.

---

## 🚀 Getting Started

No build tools or dependencies required — this is a pure HTML/CSS/JS project.

### Run locally

Simply open `index.html` in any modern web browser:

```bash
# Option 1: Double-click index.html in File Explorer

# Option 2: Use VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

### Supported Browsers

| Browser | Status |
|---------|--------|
| Chrome 90+ | ✅ Fully supported |
| Firefox 88+ | ✅ Fully supported |
| Edge 90+ | ✅ Fully supported |
| Safari 14+ | ✅ Fully supported |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure and form elements |
| CSS3 | Styling, animations, responsive layout |
| Vanilla JavaScript | Form logic, validation, dynamic UI |
| Google Fonts (Inter) | Typography |

---

## 📊 Survey Sections

| # | Section | Type |
|---|---------|------|
| 1 | Personal Information | Radio (Occupation) |
| 2 | Faculty | Conditional dropdown |
| 3 | Demographics | Radio + Searchable dropdown |
| 4 | Customer Behavior | Animated slider |
| 5 | Visit Details | Radio (multiple questions) |
| 6 | Menu Preferences | Visual card grid + checkboxes |
| 7 | Promotions | Checkbox pills |
| 8 | Your Ratings | Animated rating sliders |

---

## 👥 Authors

- **Global Academy, Siam University** — Year 2, Semester 2 research project
- © 2026 KFC Siam · Customer Experience Team
