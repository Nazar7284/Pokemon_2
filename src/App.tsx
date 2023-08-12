import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { mainSlice } from "./store/reducers/MainSlice";
import CardPokemon from "./components/CardPokemon";

interface Type {
  name: string;
  url: string;
}

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const { previousUrl, nextUrl, listPokemon, previousVisible, nextVisible } =
    useAppSelector((state) => state.MainReducer);

  const {
    changePreviousUrl,
    changeNextUrl,
    changeListPokemon,
    changeNextVisible,
    changePreviousVisible,
  } = mainSlice.actions;

  const dispatch = useAppDispatch();

  const getTypePokemon = async () => {
    try {
      const dataType = await axios.get<{ results: Type[] }>(
        "https://pokeapi.co/api/v2/type"
      );
      const types: Type[] = dataType.data.results;
      const typeNames: string[] = types.map((type) => {
        return type.name.charAt(0).toUpperCase() + type.name.slice(1);
      }); // назви типів
      const selectElem = document.querySelector(".typeSelect") as HTMLElement;

      typeNames.forEach((typeName) => {
        const option = new Option(typeName, typeName);
        selectElem.appendChild(option);
      });
    } catch (error) {
      console.error("Дані не отримані, існує помилка:", error);
    }
  };

  const getDataPokemons = async (url?: string) => {
    if (!isLoading) {
      setIsLoading(true);
      const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?limit=12";

      const inputString =
        typeof url === "string" && url.trim() !== "" ? url : defaultUrl;

      const dataPokemon = await axios.get(inputString);
      dispatch(changeNextUrl(dataPokemon.data.next));
      dispatch(changePreviousUrl(dataPokemon.data.previous));

      if (!dataPokemon.data.next) {
        dispatch(changeNextVisible(false));
      } else {
        dispatch(changeNextVisible(true));
      }
      if (!dataPokemon.data.previous) {
        dispatch(changePreviousVisible(false));
      } else {
        dispatch(changePreviousVisible(true));
      }

      const Pokemons = dataPokemon.data.results;

      const requests = Pokemons.map((pokemon: any) =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      );

      try {
        const responses = await Promise.all(requests);
        const pokemonData = responses.map((response) => response.data);
        dispatch(changeListPokemon(pokemonData));
      } catch (error) {
        console.error("Error fetching pokemon data:", error);
        return [];
      }
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    getTypePokemon();
    getDataPokemons();
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
            <button
              className="btn-previous"
              disabled={isLoading}
              style={{ display: previousVisible ? "inline-block" : "none" }}
              onClick={() =>
                previousUrl !== null && getDataPokemons(previousUrl)
              }
            >
              Previous
            </button>
            <button
              className="btn-next"
              disabled={isLoading}
              style={{ display: nextVisible ? "inline-block" : "none" }}
              onClick={() => nextUrl !== null && getDataPokemons(nextUrl)}
            >
              Next
            </button>
          </div>
        </div>
        <div>Type is {previousUrl}</div>
        {/* <div className="infoPokemon"></div> */}
      </div>
    </div>
  );
}

export default App;
