const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

function esc(value='') {
  return String(value)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#039;');
}

async function loadData() {
  const [news, match, result, standings] = await Promise.all([
    fetch('data/news.json').then(r => r.json()),
    fetch('data/next-match.json').then(r => r.json()),
    fetch('data/last-result.json').then(r => r.json()),
    fetch('data/standings.json').then(r => r.json())
  ]);

  renderNews(news);
  renderNextMatch(match);
  renderLastResult(result);
  renderStandings(standings);
}

function mediaImageFor(post) {
  const text = `${post.title || ''} ${post.summary || ''} ${post.category || ''}`.toLowerCase();

  const supporterWords = ['rossoneri', 'supporter', 'supporters', 'fans', 'fanclub'];
  if (supporterWords.some(word => text.includes(word))) {
    const hash = [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
    const number = String((hash % 20) + 1).padStart(2, '0');
    return `assets/fans/rossoneri-${number}.jpg`;
  }

  const trainingWords = ['training', 'trainen', 'trainingen', 'selectie', 'voorbereiding'];
  if (trainingWords.some(word => text.includes(word))) {
    const hash = [...text].reduce((total, char) => total + char.charCodeAt(0), 0);
    const number = String((hash % 20) + 1).padStart(2, '0');
    return `assets/training/training-${number}.jpg`;
  }

  return post.image || 'assets/stadium-hero.jpg';
}

function renderNews(posts) {
  const sorted = [...posts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,4);
  const [first, ...rest] = sorted;
  const container = document.querySelector('#news-grid');
  if (!first) return;
  const url = slug => `pages/nieuwsartikel.html?artikel=${encodeURIComponent(slug)}`;
  container.innerHTML = `
    <a class="featured-news" href="${url(first.slug)}" style="background-image:linear-gradient(to top,rgba(0,0,0,.93),rgba(0,0,0,.08)),url('${esc(mediaImageFor(first))}')">
      <span class="news-tag">${esc(first.category)}</span><time>${formatDate(first.date)}</time><h3>${esc(first.title)}</h3><p>${esc(first.summary)}</p><strong>Lees verder →</strong>
    </a>
    <div class="news-list">
      ${rest.map(post => `<a class="news-item" href="${url(post.slug)}"><img class="news-thumb" src="${esc(mediaImageFor(post))}" alt=""><div><span class="news-tag">${esc(post.category)}</span><time>${formatDate(post.date)}</time><h3>${esc(post.title)}</h3><strong>Lees verder →</strong></div></a>`).join('')}
    </div>`;
}
function renderNextMatch(match) {
  const card = document.querySelector('#next-match-card');
  card.innerHTML = `
    <h2>Volgende wedstrijd</h2>
    <p class="match-competition">${esc(match.competition)} · ${esc(match.round)}</p>
    <div class="match-teams">
      <div class="match-team">
        <img src="${esc(match.home.logo)}" alt="">
        <strong>${esc(match.home.name)}</strong>
      </div>
      <div class="match-vs">VS</div>
      <div class="match-team">
        <img src="${esc(match.away.logo)}" alt="">
        <strong>${esc(match.away.name)}</strong>
      </div>
    </div>
    <div class="countdown">
      <div><strong id="cd-days">00</strong><span>Dagen</span></div>
      <div><strong id="cd-hours">00</strong><span>Uur</span></div>
      <div><strong id="cd-minutes">00</strong><span>Min</span></div>
      <div><strong id="cd-seconds">00</strong><span>Sec</span></div>
    </div>
    <p class="match-date">${formatDateTime(match.date)}<br>${esc(match.location)}</p>
  `;
  startCountdown(match.date);
}

function renderLastResult(result) {
  document.querySelector('#last-result').innerHTML = `
    <div class="result-wrap">
      <div class="result-score">
        <div class="result-team">
          <img src="${esc(result.home.logo)}" alt="">
          <strong>${esc(result.home.name)}</strong>
        </div>
        <div class="score">${result.home.score} - ${result.away.score}</div>
        <div class="result-team">
          <img src="${esc(result.away.logo)}" alt="">
          <strong>${esc(result.away.name)}</strong>
        </div>
      </div>
      <div class="result-link">Wedstrijdverslag & highlights →</div>
    </div>
  `;
}

function renderStandings(rows) {
  const target = document.querySelector('#standings-table');

  if (!rows.length) {
    target.innerHTML = `
      <div class="standings-empty">
        <strong>Competitie-indeling volgt</strong>
        <p>De namen van de overige teams zijn nog niet bekend.</p>
      </div>
    `;
    return;
  }

  target.innerHTML = `
    <table class="standings">
      <thead><tr><th>#</th><th>Club</th><th>G</th><th>DS</th><th>Ptn</th></tr></thead>
      <tbody>
        ${rows.map(row => `
          <tr class="${row.club === 'Gigi-United' ? 'highlight' : ''}">
            <td>${row.pos}</td><td>${esc(row.club)}</td><td>${row.played}</td><td>${esc(row.diff)}</td><td>${row.points}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function startCountdown(dateString) {
  const target = new Date(dateString).getTime();
  const ids = {
    days: document.querySelector('#cd-days'),
    hours: document.querySelector('#cd-hours'),
    minutes: document.querySelector('#cd-minutes'),
    seconds: document.querySelector('#cd-seconds')
  };
  const tick = () => {
    let delta = Math.max(0, target - Date.now());
    const days = Math.floor(delta / 86400000); delta %= 86400000;
    const hours = Math.floor(delta / 3600000); delta %= 3600000;
    const minutes = Math.floor(delta / 60000); delta %= 60000;
    const seconds = Math.floor(delta / 1000);
    ids.days.textContent = String(days).padStart(2,'0');
    ids.hours.textContent = String(hours).padStart(2,'0');
    ids.minutes.textContent = String(minutes).padStart(2,'0');
    ids.seconds.textContent = String(seconds).padStart(2,'0');
  };
  tick();
  setInterval(tick, 1000);
}

function formatDate(value) {
  return new Intl.DateTimeFormat('nl-NL', {day:'numeric',month:'long',year:'numeric'}).format(new Date(value));
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat('nl-NL', {weekday:'short',day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value));
}

loadData().catch(err => console.error(err));
