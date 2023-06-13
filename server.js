import express from "express";
import cors from "cors";
import morgan from "morgan";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();
server.use(express.static(__dirname + "/"));
server.use(morgan("dev"));
server.use(cors());
server.use(express.json());

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

server.get("/cocktails", async (req, res) => {
  const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?f=";
  const letters = "abc";
  const allData = await Promise.all(
    letters
      .split("")
      .map(async (l) => await fetch(url + l).then((r) => r.json()))
  );
  const allCocktails = allData
    .map(({ drinks }) => drinks)
    .flat()
    .filter((c) => c)
    .map(({ idDrink, strDrink, strDrinkThumb }) => ({
      idDrink,
      strDrink,
      strDrinkThumb,
    }));
  res.json(allCocktails);
});

server.listen("1234", () => {
  console.log(`server is live 🚀`);
});
