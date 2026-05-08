export function initTicker(trackId) {
  const track = document.getElementById(trackId);
  if (!track) return;

  const items = Array.from(track.children);
  items.forEach((item) => track.appendChild(item.cloneNode(true)));
}
