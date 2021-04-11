const wordList = document.getElementById("word-list");
const wordInput = document.getElementById("word-input");

chrome.storage.sync.get("words", data => {
  function createUpdateWord() {
    let words = data.words || [];
    for (const word of words) {
      appendLiEl(word);
    }
    return newWord => {
      words.push(newWord);
      chrome.storage.sync.set({ words });
      appendLiEl(newWord);
    };
    function appendLiEl(word) {
      const liEl = document.createElement("li");
      const textNode = document.createTextNode(
        [].map.call(word, (ch, i) => (i % 2 < 1 ? ch : "*")).join("")
      );
      liEl.appendChild(textNode);
      liEl.addEventListener("click", () => {
        words = words.filter(w => w !== word);
        chrome.storage.sync.set({ words });
        liEl.remove();
      });
      wordList.appendChild(liEl);
    }
  }

  const updateWord = createUpdateWord();

  wordInput.addEventListener("keydown", function (e) {
    if (e.keyCode == 13) {
      const newWord = (this.value || "").trim();
      updateWord(newWord);
      this.value = "";
    }
  });
  wordInput.disabled = false;
});
