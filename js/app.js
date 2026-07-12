const menuButton = document.querySelector(".menu-button");
const mainNav = document.querySelector(".main-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

async function loadNews() {
  const container = document.querySelector("#news-grid");

  try {
    const response = await fetch("data/news.json");
    if (!response.ok) throw new Error("Kon nieuws niet laden.");

    const posts = await response.json();
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = posts.slice(0, 6).map((post) => `
      <article class="news-card">
        <span class="news-category">${escapeHtml(post.category)}</span>
        <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.summary)}</p>
      </article>
    `).join("");
  } catch (error) {
    container.innerHTML = "<p>Het nieuws kon niet worden geladen.</p>";
    console.error(error);
  }
}

function formatDate(dateString) {
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(new Date(dateString));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadNews();
