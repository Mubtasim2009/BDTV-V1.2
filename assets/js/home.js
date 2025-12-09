document.addEventListener("DOMContentLoaded", () => {
  loadSection(
    `${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}`,
    "trendingMovies",
    "trendingMoviesStatus",
    "movie"
  );
  loadSection(
    `${TMDB_BASE}/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    "nowPlayingMovies",
    "nowPlayingMoviesStatus",
    "movie"
  );
  loadSection(
    `${TMDB_BASE}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    "topRatedMovies",
    "topRatedMoviesStatus",
    "movie"
  );
  loadSection(
    `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    "popularTv",
    "popularTvStatus",
    "tv"
  );
  loadSection(
    `${TMDB_BASE}/tv/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
    "topRatedTv",
    "topRatedTvStatus",
    "tv"
  );
});

async function loadSection(url, containerId, statusId, type) {
  const container = document.getElementById(containerId);
  const statusEl = document.getElementById(statusId);
  if (!container || !statusEl) return;

  try {
    const data = await fetchJson(url);
    container.innerHTML = "";
    (data.results || []).slice(0, 20).forEach((item) => {
      container.appendChild(createMediaCard(item, type));
    });
    statusEl.textContent = "";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Failed to load.";
  }
}