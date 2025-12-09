// EXACT same API/key as in your current player-movie.html
const TMDB_API_KEY = "b14194d00ce48c36318eefa745bcdeec";
const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_BASE = "https://image.tmdb.org/t/p/w300";

function getMovieIdFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("id");
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("TMDB error " + res.status);
  return res.json();
}

function openActor(personId) {
  window.location.href = `actor.html?id=${encodeURIComponent(personId)}`;
}

async function loadMovie() {
  const id = getMovieIdFromUrl();
  if (!id) {
    document.getElementById("movieTitle").textContent = "Missing movie ID.";
    return;
  }

  // USE YOUR VIDKING EMBED – unchanged
  const params = new URLSearchParams({
    color: "e50914",
    autoPlay: "true",
    nextEpisode: "false",
  });
  document.getElementById("movieFrame").src =
    `https://www.vidking.net/embed/movie/${encodeURIComponent(id)}?${params.toString()}`;

  if (!TMDB_API_KEY) {
    document.getElementById("movieTitle").textContent = "Movie Player";
    return;
  }

  try {
    const movieUrl = `${TMDB_BASE}/movie/${encodeURIComponent(id)}?api_key=${TMDB_API_KEY}&language=en-US`;
    const creditsUrl = `${TMDB_BASE}/movie/${encodeURIComponent(id)}/credits?api_key=${TMDB_API_KEY}&language=en-US`;

    const [data, credits] = await Promise.all([fetchJson(movieUrl), fetchJson(creditsUrl)]);

    const title = data.title || "Untitled";
    const year = data.release_date ? data.release_date.slice(0, 4) : "";
    const runtime = data.runtime ? `${data.runtime} min` : "";
    const rating = data.vote_average ? `⭐ ${data.vote_average.toFixed(1)}` : "";

    document.getElementById("movieTitle").textContent = title;
    document.getElementById("movieMeta").textContent =
      [year, runtime, rating].filter(Boolean).join(" • ");

    const tagContainer = document.getElementById("movieTags");
    tagContainer.innerHTML = "";
    (data.genres || []).forEach((g) => {
      const span = document.createElement("span");
      span.className = "tag-chip";
      span.textContent = g.name;
      tagContainer.appendChild(span);
    });

    document.getElementById("movieOverview").textContent =
      data.overview || "No overview available.";

    const posterImg = document.getElementById("posterImg");
    if (data.poster_path) posterImg.src = TMDB_IMG_BASE + data.poster_path;
    else posterImg.src = "https://via.placeholder.com/300x450?text=No+Image";
    posterImg.alt = title + " poster";

    const castList = (credits.cast || []).slice(0, 12);
    const castContainer = document.getElementById("castList");
    castContainer.innerHTML = "";
    if (castList.length) {
      document.getElementById("castSection").style.display = "";
      for (const c of castList) {
        const item = document.createElement("div");
        item.className = "cast-item";

        const img = document.createElement("img");
        if (c.profile_path) img.src = "https://image.tmdb.org/t/p/w185" + c.profile_path;
        else img.src = "https://via.placeholder.com/185x185?text=No+Photo";
        img.alt = c.name || "Actor";

        const name = document.createElement("div");
        name.className = "cast-name";
        name.textContent = c.name;

        const char = document.createElement("div");
        char.className = "cast-character";
        char.textContent = c.character || "";

        item.appendChild(img);
        item.appendChild(name);
        item.appendChild(char);

        item.addEventListener("click", () => {
          if (c.id) openActor(c.id);
        });

        castContainer.appendChild(item);
      }
    } else {
      document.getElementById("castSection").style.display = "none";
    }
  } catch (err) {
    console.error(err);
    document.getElementById("movieTitle").textContent = "Failed to load movie details.";
  }
}

document.addEventListener("DOMContentLoaded", loadMovie);