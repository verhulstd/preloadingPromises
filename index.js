let preloaded = 0;
let total = 0;

window.addEventListener("img-loaded", () => {
  preloaded++;
  document.querySelector("#progress").value = (preloaded / total) * 100;
});

async function main() {
  const response = await fetch("http://localhost:1234/cocktails");
  const data = await response.json();
  document.querySelector("section").innerHTML = data
    .map(
      ({ strDrink, strDrinkThumb }) =>
        `<article><img src="${strDrinkThumb}" alt="${strDrink}" /></article>`
    )
    .join("");

  total = data.length;
  await Promise.all(
    data.map(({ strDrinkThumb }) => preloadImage(strDrinkThumb, "img-loaded"))
  );
  document.querySelector("section").classList.remove("hidden");
  document.querySelector("#progress").classList.add("hidden");
}

async function preloadImage(path, eventType) {
  return new Promise(function (res, rej) {
    const img = new Image();
    img.src = path;
    const update = () => {
      window.dispatchEvent(new CustomEvent(eventType));
      res();
    };
    img.onerror = update;
    img.onload = update;
  });
}

main();
