/* GitHub Activity & Contributions widget — fetches real public data for COOLXPLO via the
   unauthenticated GitHub REST API (events) and the jogruber contributions API (calendar).
   Kept as its own plain file on purpose: the rest of this build is obfuscated/minified,
   and that file should never be hand-edited — see PROTECTED-BUILD-README.md. */
(function () {
  var GH_USER = 'COOLXPLO';
  var EVENTS_URL = 'https://api.github.com/users/' + GH_USER + '/events/public?per_page=30';
  var CONTRIB_URL = 'https://github-contributions-api.jogruber.de/v4/' + GH_USER + '?y=2025&y=2026';
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutes — be polite to the (rate-limited) public APIs
  var DEFAULT_YEAR = '2026';
  var contribData = null;

  function timeAgo(iso) {
    var diffMs = Date.now() - new Date(iso).getTime();
    var mins = Math.floor(diffMs / 60000);
    var hrs = Math.floor(mins / 60);
    var days = Math.floor(hrs / 24);
    if (days > 0) return days + 'd ago';
    if (hrs > 0) return hrs + 'h ago';
    if (mins > 0) return mins + 'm ago';
    return 'just now';
  }

  function esc(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function describeEvent(ev) {
    var repo = ev.repo ? ev.repo.name.split('/')[1] : 'unknown';
    var payload = ev.payload || {};
    switch (ev.type) {
      case 'PushEvent': {
        var n = payload.size || (payload.commits || []).length || 1;
        return { label: 'PUSH', text: 'pushed ' + n + ' commit' + (n === 1 ? '' : 's') + ' to', repo: repo, cls: 'push' };
      }
      case 'CreateEvent':
        return { label: 'CREATE', text: 'created ' + (payload.ref_type || 'repo') + ' in', repo: repo, cls: 'create' };
      case 'PullRequestEvent':
        return { label: 'PR', text: (payload.action || 'updated') + ' a pull request on', repo: repo, cls: 'pr' };
      case 'IssuesEvent':
        return { label: 'ISSUE', text: (payload.action || 'updated') + ' an issue on', repo: repo, cls: 'issue' };
      case 'IssueCommentEvent':
        return { label: 'COMMENT', text: 'commented on', repo: repo, cls: 'comment' };
      case 'WatchEvent':
        return { label: 'STAR', text: 'starred', repo: repo, cls: 'star' };
      case 'ForkEvent':
        return { label: 'FORK', text: 'forked', repo: repo, cls: 'fork' };
      case 'DeleteEvent':
        return { label: 'DELETE', text: 'deleted ' + (payload.ref_type || 'branch') + ' on', repo: repo, cls: 'delete' };
      case 'ReleaseEvent':
        return { label: 'RELEASE', text: 'published a release on', repo: repo, cls: 'release' };
      case 'PublicEvent':
        return { label: 'PUBLIC', text: 'made public:', repo: repo, cls: 'create' };
      default:
        return { label: ev.type.replace('Event', '').toUpperCase(), text: 'updated', repo: repo, cls: 'other' };
    }
  }

  function cacheGet(key) {
    try {
      var raw = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (raw && (Date.now() - raw.t < CACHE_TTL)) return raw.data;
    } catch (e) {}
    return null;
  }
  function cacheSet(key, data) {
    try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), data: data })); } catch (e) {}
  }

  function loadFeed(force) {
    var body = document.getElementById('ghFeedBody');
    if (!body) return;
    body.innerHTML = '<div class="gh-feed-loading">Connecting to api.github.com<span class="term-cursor"></span></div>';

    var cached = force ? null : cacheGet('gh_events_cache_v1');
    var p = cached ? Promise.resolve(cached) : fetch(EVENTS_URL).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).then(function (data) { cacheSet('gh_events_cache_v1', data); return data; });

    p.then(function (events) {
      if (!Array.isArray(events) || events.length === 0) {
        body.innerHTML = '<div class="gh-feed-empty">No recent public activity.</div>';
        var counterEmpty = document.getElementById('ghFeedCount');
        if (counterEmpty) counterEmpty.textContent = '';
        return;
      }
      var rows = events.slice(0, 20);
      body.innerHTML = '';
      var counter = document.getElementById('ghFeedCount');
      var i = 0;
      function appendNext() {
        if (i >= rows.length) {
          if (counter) counter.textContent = '[' + rows.length + '/' + rows.length + '] events loaded';
          return;
        }
        var ev = rows[i];
        var d = describeEvent(ev);
        var row = document.createElement('div');
        row.className = 'gh-feed-row';
        row.innerHTML =
          '<span class="gh-feed-time">' + esc(timeAgo(ev.created_at)) + '</span>' +
          '<span class="gh-badge gh-badge-' + d.cls + '">' + esc(d.label) + '</span>' +
          '<span class="gh-feed-text">' + esc(d.text) + '</span>' +
          '<a class="gh-feed-repo" href="https://github.com/' + esc(ev.repo.name) + '" target="_blank" rel="noopener noreferrer">' + esc(d.repo) + '</a>';
        body.appendChild(row);
        i++;
        if (counter) counter.textContent = '[' + i + '/' + rows.length + '] events loaded';
        setTimeout(appendNext, 55);
      }
      appendNext();
    }).catch(function () {
      body.innerHTML = '<div class="gh-feed-error">Could not reach the GitHub API right now (likely the public rate limit). ' +
        '<a href="https://github.com/' + GH_USER + '?tab=repositories" target="_blank" rel="noopener noreferrer">View activity on GitHub &rarr;</a></div>';
      var counterErr = document.getElementById('ghFeedCount');
      if (counterErr) counterErr.textContent = '';
    });
  }

  function renderCalendar(year) {
    var grid = document.getElementById('ghCalGrid');
    var totalEl = document.getElementById('ghCalTotal');
    if (!grid || !contribData) return;

    var days = (contribData.contributions || []).filter(function (d) { return d.date.indexOf(String(year)) === 0; });
    var totalCount = (contribData.total && contribData.total[year] !== undefined) ? contribData.total[year] : days.reduce(function (a, d) { return a + d.count; }, 0);
    if (totalEl) totalEl.textContent = totalCount.toLocaleString() + ' contributions in ' + year;

    if (!days.length) {
      grid.innerHTML = '<div class="gh-cal-empty">No contribution data for ' + esc(year) + ' yet.</div>';
      return;
    }

    var first = new Date(days[0].date + 'T00:00:00');
    var startPad = first.getDay(); // 0 = Sunday
    var cells = [];
    for (var i = 0; i < startPad; i++) cells.push(null);
    days.forEach(function (d) { cells.push(d); });
    while (cells.length % 7 !== 0) cells.push(null);

    var weeks = [];
    for (var w = 0; w < cells.length; w += 7) weeks.push(cells.slice(w, w + 7));

    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var lastMonth = -1;
    var monthRow = weeks.map(function (week) {
      var firstDay = null;
      for (var k = 0; k < week.length; k++) { if (week[k]) { firstDay = week[k]; break; } }
      if (firstDay) {
        var m = new Date(firstDay.date + 'T00:00:00').getMonth();
        if (m !== lastMonth) { lastMonth = m; return monthNames[m]; }
      }
      return '';
    });

    var weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

    var html = '<div class="gh-cal-inner">';
    html += '<div class="gh-cal-months">';
    monthRow.forEach(function (m) { html += '<div class="gh-cal-month-label">' + esc(m) + '</div>'; });
    html += '</div>';
    html += '<div class="gh-cal-body">';
    html += '<div class="gh-cal-weekdays">';
    weekdayLabels.forEach(function (w) { html += '<div class="gh-cal-weekday-label">' + esc(w) + '</div>'; });
    html += '</div>';
    html += '<div class="gh-cal-weeks">';
    weeks.forEach(function (week) {
      html += '<div class="gh-cal-week">';
      week.forEach(function (day) {
        if (!day) {
          html += '<div class="gh-cal-cell gh-cal-cell-empty"></div>';
        } else {
          html += '<div class="gh-cal-cell" data-level="' + day.level + '" title="' + day.count + ' contribution' + (day.count === 1 ? '' : 's') + ' on ' + day.date + '"></div>';
        }
      });
      html += '</div>';
    });
    html += '</div></div></div>';
    grid.innerHTML = html;
  }

  function loadContrib(year) {
    var grid = document.getElementById('ghCalGrid');
    if (!grid) return;
    grid.innerHTML = '<div class="gh-cal-loading">Loading contribution history<span class="term-cursor"></span></div>';

    var cached = cacheGet('gh_contrib_cache_v1');
    var p = (contribData) ? Promise.resolve(contribData)
      : cached ? Promise.resolve(cached)
      : fetch(CONTRIB_URL).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.json();
        }).then(function (data) { cacheSet('gh_contrib_cache_v1', data); return data; });

    p.then(function (data) {
      contribData = data;
      renderCalendar(year);
    }).catch(function () {
      grid.innerHTML = '<div class="gh-cal-error">Could not load contribution data right now. ' +
        '<a href="https://github.com/' + GH_USER + '" target="_blank" rel="noopener noreferrer">View on GitHub &rarr;</a></div>';
      var totalEl = document.getElementById('ghCalTotal');
      if (totalEl) totalEl.textContent = '';
    });
  }

  function initYearToggle() {
    var wrap = document.getElementById('ghYearToggle');
    if (!wrap) return;
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest ? e.target.closest('.gh-year-btn') : null;
      if (!btn) return;
      var all = wrap.querySelectorAll('.gh-year-btn');
      for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
      btn.classList.add('active');
      loadContrib(btn.getAttribute('data-year'));
    });
  }

  function init() {
    loadFeed(false);
    loadContrib(DEFAULT_YEAR);
    initYearToggle();
    var refreshBtn = document.getElementById('ghRefreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', function () { loadFeed(true); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
