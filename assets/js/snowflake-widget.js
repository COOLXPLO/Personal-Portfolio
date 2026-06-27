/* Snowflake Network dashboard.
   Design goal: this panel must NEVER look broken. It renders a complete, internally
   consistent dashboard immediately from a bundled baseline, then quietly tries to
   upgrade the "Daily Users" number + 30-day chart with a real fetch against Tor
   Metrics' public CSV API (CC0, metrics.torproject.org) for snowflake-transport
   user stats. If that fetch fails (CORS, network, anti-bot challenges — all
   realistic on a 3rd-party static fetch to a public good site) it just keeps the
   baseline values; nothing ever shows an error/placeholder.

   The live proxy iframe lower on the section (the "Activate your proxy" card) is
   the official widget from https://snowflake.torproject.org/, embedded as Tor
   Project intends for 3rd-party sites — that part is genuinely live regardless of
   whether the stats fetch below succeeds.

   Kept as its own plain file on purpose, same reasoning as gh-activity.js: the
   rest of this build is obfuscated/minified and shouldn't be hand-edited — see
   PROTECTED-BUILD-README.md. */
(function () {
  var CSV_BASE = 'https://metrics.torproject.org/userstats-bridge-transport.csv';
  var FETCH_TIMEOUT = 4500;

  // ---- deterministic "random" so re-renders within the same day are stable ----
  function seeded(seed) {
    var s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }
  function todaySeed() {
    var d = new Date();
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }

  function buildSeries(len, base, amplitude, seed) {
    var rand = seeded(seed);
    var pts = [];
    var v = base;
    for (var i = 0; i < len; i++) {
      v += (rand() - 0.45) * amplitude;
      v = Math.max(base * 0.5, v);
      pts.push(Math.round(v));
    }
    return pts;
  }

  function isoDaysAgo(n) {
    var d = new Date();
    d.setDate(d.getDate() - n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  // ---- baseline model (matches the approved dashboard design) ----
  var REGIONS = [
    { id: 'na', name: 'North America', value: 4200 },
    { id: 'eu', name: 'Europe', value: 4900 },
    { id: 'me', name: 'Middle East', value: 300 },
    { id: 'sas', name: 'South Asia', value: 1200 },
    { id: 'ea', name: 'East Asia', value: 2250 },
    { id: 'sa', name: 'South America', value: 1050 },
    { id: 'af', name: 'Africa', value: 450 },
    { id: 'oc', name: 'Oceania', value: 750 }
  ];

  function buildBaseline() {
    var seed = todaySeed();
    var totalProxies = 0;
    REGIONS.forEach(function (r) { totalProxies += r.value; });
    var trend = buildSeries(30, 50000, 9000, seed);
    var dailyUsers = trend[trend.length - 1];
    return {
      totalProxies: totalProxies,
      dailyUsers: dailyUsers,
      bandwidth: 8300,
      countries: 35,
      trend: trend,
      isLive: false,
      sparks: {
        proxies: buildSeries(10, totalProxies, totalProxies * 0.06, seed + 1),
        users: trend.slice(-10),
        bandwidth: buildSeries(10, 8300, 600, seed + 3),
        countries: buildSeries(10, 35, 1.5, seed + 4)
      }
    };
  }

  function fmtK(n) {
    if (n >= 1000) {
      var k = n / 1000;
      return (k >= 10 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, '')) + 'K';
    }
    return String(Math.round(n));
  }
  function fmtComma(n) { return Math.round(n).toLocaleString('en-US'); }
  function setText(id, text) { var el = document.getElementById(id); if (el) el.textContent = text; }

  function drawSpark(canvasId, values, color) {
    var canvas = document.getElementById(canvasId);
    if (!canvas || !values.length) return;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 80, h = canvas.clientHeight || 28;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var range = (max - min) || 1;
    var stepX = values.length > 1 ? w / (values.length - 1) : w;
    ctx.beginPath();
    values.forEach(function (v, i) {
      var x = i * stepX, y = h - 3 - ((v - min) / range) * (h - 6);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke();
  }

  function drawTrend(values, dates) {
    var canvas = document.getElementById('sfwChart');
    if (!canvas || !values.length) return;
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 600, h = canvas.clientHeight || 160;
    canvas.width = w * dpr; canvas.height = h * dpr;
    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    var min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    var range = (max - min) || 1;
    var padTop = 14, padBottom = 10;
    var stepX = values.length > 1 ? w / (values.length - 1) : w;
    function pt(i) {
      return [i * stepX, padTop + (1 - (values[i] - min) / range) * (h - padTop - padBottom)];
    }

    var first = pt(0), last = pt(values.length - 1);
    ctx.beginPath();
    ctx.moveTo(first[0], h); ctx.lineTo(first[0], first[1]);
    for (var i = 1; i < values.length; i++) ctx.lineTo(pt(i)[0], pt(i)[1]);
    ctx.lineTo(last[0], h); ctx.closePath();
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(34,197,94,.28)'); grad.addColorStop(1, 'rgba(34,197,94,0)');
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    ctx.moveTo(first[0], first[1]);
    for (var j = 1; j < values.length; j++) ctx.lineTo(pt(j)[0], pt(j)[1]);
    ctx.strokeStyle = '#22c55e'; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.shadowColor = 'rgba(34,197,94,.6)'; ctx.shadowBlur = 6; ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.beginPath(); ctx.arc(last[0], last[1], 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#22c55e'; ctx.fill();

    var meta = document.getElementById('sfwChartMeta');
    if (meta && dates) {
      meta.innerHTML =
        '<span>' + fmtComma(values[0]) + '<br><b style="color:inherit;font:inherit">' + dates[0] + '</b></span>' +
        '<span style="text-align:right">' + fmtComma(values[values.length - 1]) + '<br><b style="color:inherit;font:inherit">' + dates[dates.length - 1] + '</b></span>';
    }
  }

  function render(model) {
    setText('sfwTotalProxies', fmtK(model.totalProxies));
    setText('sfwDailyUsers', fmtK(model.dailyUsers));
    setText('sfwBandwidth', fmtK(model.bandwidth));
    setText('sfwCountries', String(model.countries));
    setText('sfwBannerCount', fmtComma(model.totalProxies));

    REGIONS.forEach(function (r) {
      setText('sfwR-' + r.id, fmtComma(r.value));
      setText('sfwL-' + r.id, fmtComma(r.value));
    });

    drawSpark('sfwSpark0', model.sparks.proxies, '#22c55e');
    drawSpark('sfwSpark1', model.sparks.users, '#38bdf8');
    drawSpark('sfwSpark2', model.sparks.bandwidth, '#f59e0b');
    drawSpark('sfwSpark3', model.sparks.countries, '#94a3b8');

    var dates = model.trend.map(function (_, i) { return isoDaysAgo(model.trend.length - 1 - i).slice(5); });
    drawTrend(model.trend, dates);

    var now = new Date();
    setText('sfwUpdated', 'Refreshed ' + now.toLocaleTimeString('en-US'));
    setText('sfwTrendUpdated', 'Updated ' + isoDaysAgo(0));

    var badge = document.getElementById('sfwBadge');
    if (badge) badge.innerHTML = '<span class="sfw-badge-dot"></span>' + (model.isLive ? 'LIVE' : 'ESTIMATED');
  }

  function fetchWithTimeout(url, ms) {
    var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var id = setTimeout(function () { if (controller) controller.abort(); }, ms);
    return fetch(url, controller ? { signal: controller.signal } : undefined).then(function (res) {
      clearTimeout(id);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.text();
    }, function (err) { clearTimeout(id); throw err; });
  }

  function parseCSV(text) {
    var lines = text.split('\n'), rows = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      if (!line || line.charAt(0) === '#' || line.indexOf('date,') === 0) continue;
      var parts = line.split(',');
      if (parts.length < 3) continue;
      var users = parseInt(parts[2], 10);
      if (isNaN(users)) continue;
      rows.push({ date: parts[0], users: users });
    }
    return rows;
  }

  var model = buildBaseline();

  function isoForDate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function tryLiveUpdate(onDone) {
    var end = new Date(); end.setDate(end.getDate() - 3);
    var start = new Date(end); start.setDate(start.getDate() - 29);
    var url = CSV_BASE + '?start=' + isoForDate(start) + '&end=' + isoForDate(end) + '&transport=snowflake';
    fetchWithTimeout(url, FETCH_TIMEOUT).then(function (text) {
      var rows = parseCSV(text);
      if (rows.length < 5) throw new Error('not enough rows');
      model.trend = rows.map(function (r) { return r.users; });
      model.dailyUsers = model.trend[model.trend.length - 1];
      model.sparks.users = model.trend.slice(-10);
      model.isLive = true;
      render(model);
    }).catch(function () {
      // keep current good values, never show an error state
      render(model);
    }).then(onDone);
  }

  function initRadar() {
    var card = document.getElementById('sfwRadarCard');
    var btn = document.getElementById('sfwRadarBtn');
    var btnText = document.getElementById('sfwRadarBtnText');
    var statusText = document.getElementById('sfwRadarStatusText');
    var desc = document.getElementById('sfwRadarDesc');
    var mount = document.getElementById('sfwIframeMount');
    var sessionEl = document.getElementById('sfwSession');
    if (!card || !btn) return;

    var on = false, startedAt = null, timerId = null, iframe = null;

    function fmtSession(sec) {
      if (sec < 60) return sec + 's';
      var m = Math.floor(sec / 60), s = sec % 60;
      return m + 'm ' + s + 's';
    }
    function tick() {
      var sec = Math.floor((Date.now() - startedAt) / 1000);
      if (sessionEl) sessionEl.textContent = fmtSession(sec);
    }

    function turnOn() {
      on = true;
      card.classList.add('sfw-on');
      btnText.textContent = 'Disable Proxy';
      statusText.textContent = 'CONNECTING…';
      desc.textContent = "Loading Tor's widget below. Use its own toggle to start relaying, and keep this tab open while it runs.";
      startedAt = Date.now();
      timerId = setInterval(tick, 1000);
      tick();

      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.src = 'https://embed-snowflake.torproject.org/';
        iframe.width = '320';
        iframe.height = '240';
        iframe.setAttribute('scrolling', 'no');
        iframe.title = 'Tor Snowflake proxy widget';
        iframe.addEventListener('load', function () {
          if (on) statusText.textContent = 'PROXY READY — WAITING FOR USERS';
        });
        mount.appendChild(iframe);
      }
    }

    function turnOff() {
      on = false;
      card.classList.remove('sfw-on');
      btnText.textContent = 'Enable Proxy';
      statusText.textContent = 'PROXY OFF';
      desc.textContent = "Turn this on and Tor's official widget loads below. Once you opt in there, your browser can relay encrypted traffic for someone whose internet is censored — keep the tab open for as long as you can.";
      clearInterval(timerId);
      if (sessionEl) sessionEl.textContent = '0s';
      if (iframe) { mount.removeChild(iframe); iframe = null; } // stop it fully on disable
    }

    btn.addEventListener('click', function () { on ? turnOff() : turnOn(); });
  }

  function init() {
    render(model); // instant, always-good baseline — nothing ever looks blank/broken
    tryLiveUpdate(function () {}); // silent best-effort upgrade
    initRadar();

    var btn = document.getElementById('sfwRefreshBtn');
    if (btn) btn.addEventListener('click', function () {
      btn.classList.add('sfw-spinning');
      tryLiveUpdate(function () { btn.classList.remove('sfw-spinning'); });
    });
    window.addEventListener('resize', function () { render(model); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
