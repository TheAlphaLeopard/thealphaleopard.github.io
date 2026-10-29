/* Builds a list of links from a JSON file.
   Each entry looks like: { "name": "Thing", "url": "/thing/" }
   "description" is optional. */
async function loadList(jsonUrl, targetId) {
  const target = document.getElementById(targetId);

  try {
    const res = await fetch(jsonUrl);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      target.textContent = "Nothing here yet.";
      return;
    }

    target.innerHTML = "";
    for (const item of items) {
      const link = document.createElement("a");
      link.className = "item";
      link.href = item.url;

      const name = document.createElement("span");
      name.className = "name";
      name.textContent = item.name || item.url;
      link.appendChild(name);

      if (item.description) {
        const desc = document.createElement("span");
        desc.className = "desc";
        desc.textContent = item.description;
        link.appendChild(desc);
      }

      target.appendChild(link);
    }
  } catch (err) {
    target.textContent = "Could not load " + jsonUrl + " (" + err.message + ")";
  }
}
