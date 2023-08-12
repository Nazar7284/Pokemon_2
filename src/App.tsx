import axios from "axios";
import { useEffect } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { mainSlice } from "./store/reducers/MainSlice";
import CardPokemon from "./components/CardPokemon";

interface Type {
  name: string;
  url: string;
}

function App() {
  const { nextUrl, listPokemon } = useAppSelector((state) => state.MainReducer);

  const { addListPokemon, changeNextUrl } = mainSlice.actions;

  const dispatch = useAppDispatch();

  const getTypePokemon = async () => {
    try {
      const promise1 = axios.get<{ results: Type[] }>(
        "https://pokeapi.co/api/v2/type"
      );
      const promise2 = axios.get("https://pokeapi.co/api/v2/pokemon/?limit=12");

      const response = await Promise.allSettled([promise1, promise2]);

      if (response[0].status === "fulfilled") {
        const types: Type[] = response[0].value.data.results;
        const typeNames: string[] = types.map((type) => {
          return type.name.charAt(0).toUpperCase() + type.name.slice(1);
        }); // назви типів
        const selectElem = document.querySelector(".typeSelect") as HTMLElement;

        typeNames.forEach((typeName) => {
          const option = new Option(typeName, typeName);
          selectElem.appendChild(option);
        });
      }
      if (response[1].status === "fulfilled") {
        const data = response[1].value.data;
        dispatch(changeNextUrl(data.next));
        const Pokemons = data.results;

        for (const pokemon of Pokemons) {
          const dataPokemon = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
          );
          dispatch(addListPokemon(dataPokemon.data));
        }
      }
    } catch (error) {
      console.error("Дані не отримані, існує помилка:", error);
    }
  };

  useEffect(() => {
    getTypePokemon();
  }, []);

  return (
    <div className="header">
      <div className="footer">
        <h1 className="title">Pokedex</h1>
        <select className="typeSelect">
          <option disabled>Sort by type</option>
          <option value="all">All types</option>
        </select>
      </div>
      <div className="main">
        <div className="listPokemon">
          {listPokemon.length ? (
            listPokemon.map((pokemon: any) => {
              return (
                <CardPokemon
                  name={pokemon.name}
                  photo={pokemon.sprites.other.dream_world["front_default"]}
                  types={pokemon.types}
                  key={pokemon.id}
                />
              );
            })
          ) : (
            <h1>Loading</h1>
          )}
          <div className="button-section">
            <button onClick={() => {}}>Previous</button>
            <button onClick={() => {}}>Next</button>
          </div>
        </div>
        {/* <div className="infoPokemon"></div> */}
      </div>
    </div>
  );
}

export default App;
