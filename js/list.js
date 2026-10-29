/* Builds the tile grid from a json list:
   [{ "name": "watch", "url": "/watch/", "image": "/images/watch.png" }] */
async function loadList(url, targetId) {
  const target = document.getElementById(targetId);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("http " + res.status);

    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      target.className = "empty";
      target.textContent = "nothing here.";
      return;
    }

    target.textContent = "";
    for (const item of items) {
      const tile = document.createElement("a");
      tile.className = "tile";
      tile.href = item.url;

      const thumb = document.createElement("span");
      thumb.className = "thumb";

      if (item.image) {
        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name || "";
        img.loading = "lazy";
        thumb.appendChild(img);
      } else {
        thumb.textContent = item.url;
        thumb.className += " text";
      }

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = item.name || item.url;

      tile.append(thumb, name);
      target.appendChild(tile);
    }
  } catch (err) {
    target.className = "empty";
    target.textContent = "could not load " + url + " (" + err.message + ")";
  }
}
