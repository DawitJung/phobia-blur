const wordsEl = document.getElementById("words");

chrome.storage.sync.get("words", ({ words }) => {
  wordsEl.value = (words || "").trim();
});

wordsEl.addEventListener("input", function () {
  const value = (this.value || "").trim();
  chrome.storage.sync.set({ words: value });
});
