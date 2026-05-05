# 🛡️ COMMAND_CENTER v3.0 — iamunknown77

> *"The quieter you become, the more you are able to hear."*

A personal cybersecurity portfolio and command center built as a single-file, no-framework HTML page. Designed with a hacker/terminal aesthetic featuring neon glows, glitch effects, and live interactive widgets.

---

## 🖥️ Preview

Dark, terminal-inspired UI with:
- Neon green / cyan / magenta color palette
- Scanline overlay and CRT-style effects
- Animated glitch typography
- Custom CSS cursor

---

## 📁 Structure

```
index.html   ← Everything: HTML + CSS + JS in one file
```

No build step. No dependencies to install. Just open it in a browser.

---

## ✨ Features

### Sections
| Section | Description |
|---|---|
| **Hero** | Name, role, animated terminal typewriter, quick stats |
| **About** | Bio, metadata (age, location, status), skill bars |
| **Projects (Forge)** | Cards pulled from a JS data array with tags & status badges |
| **Security Lab** | Vulnerability findings (Critical / High / Medium) with CVE-style cards |
| **Threat Intel Feed** | Live-simulated threat feed with filter buttons |
| **Skills** | Animated progress bars across offensive security domains |
| **Certifications** | Cert cards with issuer, date, and credential IDs |
| **Timeline** | Journey / history in a vertical timeline layout |
| **CTF Missions** | Completed TryHackMe/CTF challenges with star ratings and difficulty |
| **GitHub Activity** | Live GitHub stats pulled via the GitHub API |
| **Contact** | Links and a terminal-style contact prompt |

### Interactive Widgets
- **Live clock** — UAE (UTC+4) timezone displayed in navbar
- **Hardware Oracle panel** — Detects visitor's platform, CPU cores, memory, DPR, timezone
- **Oscilloscope canvas** — Animated waveform using `requestAnimationFrame`
- **CPU mini-chart** — Simulated real-time CPU usage bars
- **Thermal monitor** — Fluctuating temperature with color-coded status
- **Signal ping simulator** — Simulated latency to Cloudflare, Google, GitHub, TryHackMe
- **Tech ticker** — Scrolling marquee of security/tech keywords
- **Scroll reveal** — `IntersectionObserver`-based fade-in animations

---

## 🚀 Getting Started

No setup required.

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
# Open index.html in your browser
open index.html
```

Or deploy directly to **GitHub Pages**:

1. Push `index.html` to your repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 🔧 Customization

All content is defined in JavaScript arrays near the bottom of `index.html`. No need to touch the HTML structure.

### Update your projects
```js
const projects = [
  {
    title: 'Your Project',
    desc: 'What it does.',
    tags: ['Python', 'OSINT'],
    status: 'active', // 'active' | 'wip' | 'private'
    stars: 12,
    lang: 'Python',
    url: 'https://github.com/...'
  },
  // ...
];
```

### Update CTF missions
```js
const missions = [
  { name: 'Room Name', tags: ['WEB', 'SSH'], time: '1h 05m', stars: 4, diff: 3, desc: 'Description.' },
  // ...
];
```

### Update your GitHub username
Search for `refreshGH` in the script and update the fetch URL:
```js
fetch('https://api.github.com/users/YOUR_GITHUB_USERNAME')
```

---

## 🛠️ Tech Stack

| Layer | Used |
|---|---|
| Markup | HTML5 |
| Styling | Vanilla CSS (custom properties, animations, grid, flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Orbitron, Rajdhani, Share Tech Mono |
| Icons | Font Awesome 6 |
| API | GitHub REST API (public, no auth) |

Zero npm. Zero bundlers. Zero frameworks.

---

## 📄 License

This project is open source. Feel free to fork and adapt it for your own portfolio — just give credit where it's due.

---

<div align="center">
  <sub>Built by <a href="https://github.com/iamunknown77">iamunknown77</a> · 17yo Offensive Security Researcher & FOSS Developer · UAE 🇦🇪</sub>
</div>
