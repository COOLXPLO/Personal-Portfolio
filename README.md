<div align="center">

# ⚡ COMMAND_CENTER v3.0

**iamunknown77** · 17 · Offensive Security Researcher & FOSS Developer · 🇦🇪 UAE

[![TryHackMe](https://img.shields.io/badge/TryHackMe-i75400207-red?style=flat-square&logo=tryhackme)](https://tryhackme.com/p/i75400207)
[![GitHub](https://img.shields.io/badge/GitHub-COOLXPLO-green?style=flat-square&logo=github)](https://github.com/COOLXPLO)
[![Status](https://img.shields.io/badge/Status-Hunting%20Bugs-brightgreen?style=flat-square)](#)
[![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)](#license)

*"The quieter you become, the more you are able to hear."*

**[→ Live Site](https://coolxplo.github.io/Personal-Portfolio/)**

</div>

---

## 📸 Overview

A single-file personal cybersecurity portfolio and command center with a full hacker/terminal aesthetic. No frameworks, no build tools — just raw HTML, CSS, and JavaScript featuring neon glows, CRT scanlines, glitch effects, and fully interactive live widgets.

Built to showcase offensive security research, bug bounty findings, projects, and CTF achievements.

---

## ⚡ Features

### Sections

| Section | What's Inside |
|---|---|
| **Hero** | Animated terminal typewriter, identity card, quick stats |
| **About** | Bio, `whoami` output panel, metadata (age, location, specialties) |
| **Projects — The Forge** | 6 projects with status badges (ACTIVE / WIP / PRIVATE) |
| **Security Lab** | 7 real vulnerability findings with severity, timeline, and tags |
| **Threat Intel Feed** | Simulated live CVE feed with CVSS scores and severity filters |
| **Skills** | Animated progress bars — offensive tools and development |
| **Certifications** | 6 TryHackMe certificates, linked directly |
| **Timeline** | Origin story and journey milestones |
| **CTF Missions** | Completed rooms with star ratings and difficulty labels |
| **GitHub Activity** | Live stats pulled via the GitHub public API |
| **Security Tools** | In-browser payload encoder and password strength analyzer |
| **Contact** | Terminal-style prompt and social links |

### Interactive Widgets

| Widget | Description |
|---|---|
| 🕐 Live Clock | Real-time UAE (UTC+4) clock in the navbar |
| 📡 Oscilloscope | Canvas waveform animation via `requestAnimationFrame` |
| 🖥️ Hardware Oracle | Detects visitor platform, CPU cores, memory, DPR, timezone |
| 🌡️ Thermal Monitor | Simulated CPU temp with color-coded status (Nominal / Warm / Hot) |
| 📊 CPU Mini-Chart | Live-updating simulated CPU usage bar chart |
| 🔗 Signal Pings | Simulated latency to Cloudflare, Google, GitHub, TryHackMe |
| 🔐 Payload Encoder | Converts input to Base64, Hex, URL-encoded, and HTML entities |
| 🔑 Password Analyzer | Entropy calculator with estimated crack-time output |
| 📰 Tech Ticker | Scrolling marquee of security tools and keywords |
| 👁️ Scroll Reveal | `IntersectionObserver`-powered fade-in animations |

---

## 🛡️ Security Lab — Findings

Real-world vulnerability research documented on the site:

| # | Severity | Title | Target | Status |
|---|---|---|---|---|
| 01 | 🔴 CRITICAL | Stored XSS → Full Account Takeover Chain | E-Commerce SaaS — UAE Platform | Patched |
| 02 | 🟠 HIGH | IDOR — Unrestricted Object Reference on User Endpoints | API Platform — Multi-tenant App | Patched |
| 03 | 🟠 HIGH | SQL Injection in Authentication — Auth Bypass | Login Portal — Web Application | Patched |
| 04 | 🟠 HIGH | JWT "None" Algorithm — Privilege Escalation | JWT-based REST API | Patched |
| 05 | 🟡 MEDIUM | SSRF — Internal Network Port Scanning via Webhook | Internal Tool — Employee Portal | Patched |
| 06 | 🟡 MEDIUM | Open Redirect → Token Theft Phishing Chain | OAuth-enabled Application | Patched |
| 07 | 🟡 MEDIUM | Verbose Error Disclosure — Stack Traces & Path Enumeration | Web Application — Error Handling | Patched |

---

## 🧰 Skills

**Offensive Security**
```
Burp Suite Pro    ████████████████████ 95%
Nmap / Masscan    ██████████████████░░ 90%
SQLMap            █████████████████░░░ 85%
Metasploit        ████████████████░░░░ 82%
OWASP ZAP         ████████████████░░░░ 80%
Wireshark         ███████████████░░░░░ 76%
```

**Development**
```
Python            ██████████████████░░ 92%
Lua               █████████████████░░░ 88%
Bash / Shell      █████████████████░░░ 87%
JavaScript / TS   █████████████████░░░ 85%
AI / LLM Research ████████████████░░░░ 82%
Docker            ██████████████░░░░░░ 74%
```

---

## 📜 Certifications

All issued by **TryHackMe** · Profile: [i75400207](https://tryhackme.com/p/i75400207)

| Certificate | Date |
|---|---|
| Web Fundamentals | Apr 29, 2026 |
| Jr Penetration Tester | Apr 29, 2026 |
| Cyber Security 101 | Apr 25, 2026 |
| AI Security | Apr 22, 2026 |
| loveatfirstbreach | Feb 25, 2026 |
| Pre Security | Feb 22, 2026 |

---

## 🚀 Projects

| Project | Stack | Status | Description |
|---|---|---|---|
| **DP-HUB** | Lua | 🟢 Active | All-in-one Roblox script hub with powerful utilities for multiple games |
| **Privacy Toolkit** | JS, FOSS | 🟢 Active | Browser hardening, fingerprinting defense, and anonymity workflows |
| **CTF Writeups** | Multi | 🟢 Active | Web, binary exploitation, and forensics writeup collection |
| **AI Exploit Framework** | Python, AI | 🔵 WIP | Research framework for LLM vulnerabilities — prompt injection and jailbreaking |
| **Security Recon Tools** | Python | 🔒 Private | Custom browser fingerprinting and recon scripts for offensive workflows |
| **Web Vuln Scanner** | Python | 🔒 Private | Automated scanner with custom payloads for XSS, SQLi, and SSRF |

---

## 🎯 CTF Missions (Highlights)

| Room | Tags | Time | Difficulty | Stars |
|---|---|---|---|---|
| Object Injection | WEB, SSH | 28m 13s | EXPERT | ★★★★☆ |
| Blind Injection | WEB, SSH | 52m 23s | HARD | ★★★☆☆ |
| Hash Cracker | WEB, SSH | 1h 31m | HARD | ★★★☆☆ |

Full list of completed rooms available on the live site.

---

## 🛠️ Tech Stack

| Layer | Detail |
|---|---|
| Markup | HTML5 |
| Styling | Vanilla CSS — custom properties, grid, flexbox, keyframe animations |
| Logic | Vanilla JavaScript ES6+ |
| Fonts | Google Fonts: Orbitron, Rajdhani, Share Tech Mono |
| Icons | Font Awesome 6 |
| External API | GitHub REST API (public, unauthenticated) |

**Zero npm. Zero bundlers. Zero frameworks. One file.**

---

## 📦 Getting Started

```bash
git clone https://github.com/COOLXPLO/Personal-Portfolio.git
cd Personal-Portfolio
open index.html
```

No install step. No build step. Just open it in a browser.

### Deploy to GitHub Pages

1. Push `index.html` to your repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://i7540020.vercel.app/`

---

## ✏️ Customization

All content is defined in JavaScript arrays inside `index.html`. No need to touch the HTML structure — just edit the data.

### Update projects
```js
const projects = [
  {
    title:  'Your Project',
    desc:   'What it does.',
    tags:   ['Python', 'OSINT'],
    status: 'active', // 'active' | 'wip' | 'private'
    time:   'Ongoing'
  }
];
```

### Update security findings
```js
const findings = [
  {
    sev:      'critical',         // 'critical' | 'high' | 'medium'
    num:      '01',
    target:   'Target Platform',
    title:    'Vulnerability Title',
    desc:     'Full technical description...',
    outcome:  'Outcome: Patch deployed.',
    time:     '2h 30m',
    status:   'Patched',
    reporter: 'Direct',
    tags:     ['XSS', 'ATO Chain']
  }
];
```

### Update certifications
```js
const certs = [
  {
    type:   'Certificate',
    issuer: 'TryHackMe',
    name:   'Room Name',
    date:   'Jan 01, 2026',
    link:   'https://tryhackme.com/p/i75400207'
  }
];
```

### Update GitHub username
Find `refreshGH` in the script block and update the API call:
```js
fetch('https://api.github.com/users/COOLXPLO')
```

---

## 📄 License

MIT — fork it, adapt it, make it yours. Credit is appreciated.

---

<div align="center">

Built by [iamunknown77](https://github.com/COOLXPLO) · Offensive Security Researcher & FOSS Developer · 🇦🇪 UAE

```
> BREACH SUCCESSFUL. WELCOME, HUNTER.
```

</div>
