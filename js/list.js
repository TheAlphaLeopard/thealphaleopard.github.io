/* Builds the tile grid from a json list:
   [{ "name": "watch", "url": "/watch/" }] */
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
      const card = document.createElement("a");
      card.className = "card";
      card.href = item.url;

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = item.name || item.url;

      const square = document.createElement("span");
      square.className = "square";
      square.textContent = item.url;

      card.append(name, square);
      target.appendChild(card);
    }
  } catch (err) {
    target.className = "empty";
    target.textContent = "could not load " + url + " (" + err.message + ")";
  }
}
