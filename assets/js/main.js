// TMDB config – same key as in your repo
const TMDB_API_KEY = "b14194d00ce48c36318eefa745bcdeec";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w300";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json();
}

function buildImageUrl(path) {
  if (!path) return "";
  return `${TMDB_IMG_BASE}${path}`;
}

function createMediaCard(item, type) {
  const linkTarget = type === "tv" ? "player-tv.html" : "player-movie.html";
  const title = item.title || item.name || "Untitled";
  const year =
    (item.release_date && item.release_date.slice(0, 4)) ||
    (item.first_air_date && item.first_air_date.slice(0, 4)) ||
    "";
  const rating = item.vote_average ? item.vote_average.toFixed(1) : "–";

  const a = document.createElement("a");
  a.href = `${linkTarget}?id=${encodeURIComponent(item.id)}`;
  a.className = "media-card";

  const img = document.createElement("img");
  img.src = buildImageUrl(item.poster_path || item.backdrop_path);
  img.alt = title;

  const body = document.createElement("div");
  body.className = "media-card-body";

  const titleEl = document.createElement("div");
  titleEl.className = "media-title";
  titleEl.textContent = title;

  const meta = document.createElement("div");
  meta.className = "media-meta";
  meta.textContent = [year, `${rating} ★`].filter(Boolean).join(" • ");

  body.appendChild(titleEl);
  body.appendChild(meta);

  a.appendChild(img);
  a.appendChild(body);

  return a;
}

// Mobile nav toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });
  }
});