let timer;

function blur() {
  if (!chrome.app.isInstalled && timer) return;
  timer = setTimeout(() => {
    timer = null;
  }, 10000);
  chrome.storage.sync.get("words", ({ words = [] }) => {
    if (words.length < 1) return;
    const xpath =
      "/html/body//*[" +
      words
        .filter(w => w)
        .reduce((acc, cur) => {
          acc.push(cur);
          acc.push(cur.toUpperCase());
          acc.push(cur.toLowerCase());
          acc.push(cur.slice(0, 1).toUpperCase() + cur.slice(1).toLowerCase());
          return acc;
        }, [])
        .map(w => `contains(text(),'${w}') or contains(@alt,'${w}')`)
        .join(" or ") +
      "]";
    const iterator = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
      null
    );
    const nodes = [];
    let thisNode = iterator.iterateNext();
    while (thisNode) {
      nodes.push(thisNode);
      thisNode = iterator.iterateNext();
    }
    for (const node of nodes) {
      node.classList.add("__ptsd-hide");
      node.removeEventListener("click", toggleBlur);
      node.addEventListener("click", toggleBlur);
    }
  });
  function toggleBlur(event) {
    event.stopPropagation();
    if (this.classList.contains("__ptsd-show")) {
      this.classList.remove("__ptsd-show");
    } else {
      event.preventDefault();
      this.classList.add("__ptsd-show");
    }
  }
}

const observer = new MutationObserver(blur);

window.addEventListener("load", () => {
  observer.disconnect();
  if (!new URL(window.location.href).host.includes("youtube.com")) {
    observer.observe(document.querySelector("body"), {
      attributes: false,
      childList: true,
      subtree: true,
    });
  }
});
