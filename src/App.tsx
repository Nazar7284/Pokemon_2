import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { mainSlice } from "./store/reducers/MainSlice";
import CardPokemon from "./components/CardPokemon";
import { firstLetterBig } from "./utils/utils";
import ActivePokemon from "./components/InfoPokemon";
import { Type } from "./models/models";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const {
    previousUrl,
    nextUrl,
    listPokemon,
    previousVisible,
    nextVisible,
    isTypeView,
    offset,
    currentUrlType,
  } = useAppSelector((state) => state.MainReducer);

  const {
    changePreviousUrl,
    changeNextUrl,
    changeListPokemon,
    changeNextVisible,
    changePreviousVisible,
    changeIsTypeView,
    changeOffset,
    changeCurrentUrlType,
  } = mainSlice.actions;

  const dispatch = useAppDispatch();

  const getTypePokemon = async () => {
    try {
      const dataType = await axios.get<{ results: Type[] }>(
        "https://pokeapi.co/api/v2/type"
      );
      const types: Type[] = dataType.data.results;
      const typeNames: string[] = types.map((type) => {
        return firstLetterBig(type.name);
      }); // назви типів
      const selectElem = document.querySelector(".typeSelect") as HTMLElement;
      typeNames.forEach((typeName, index) => {
        const option = new Option(typeName, types[index].url);
        selectElem.appendChild(option);
      });
    } catch (error) {
      console.error("Дані не отримані, існує помилка:", error);
    }
  };

  const getDataPokemons = async (url?: string) => {
    dispatch(changeIsTypeView(false));
    if (!isLoading) {
      setIsLoading(true);
      setIsLoadingData(true);
      window.scroll(0, 0);
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
      dispatch(changeListPokemon([]));
      try {
        const responses = await Promise.all(requests);
        const pokemonData = responses.map((response) => response.data);
        dispatch(changeListPokemon(pokemonData));
      } catch (error) {
        console.error("Error fetching pokemon data:", error);
        return [];
      }
    }
    setIsLoadingData(false);
    setIsLoading(false);
  };

  const getPokemonByType = async (value?: string, offset: number = 0) => {
    console.log("type");
    if (!isLoading) {
      setIsLoading(true);
      setIsLoadingData(true);
      window.scroll(0, 0);
      dispatch(changeListPokemon([]));
      dispatch(changeOffset(offset));

      let currentUrl: string = "";
      if (value === "all") {
        getDataPokemons();
      } else {
        if (typeof value === "string" && value.trim() !== "") {
          console.log("перший пошук за типом");
          dispatch(changeIsTypeView(true));
          dispatch(changeCurrentUrlType(value));
          currentUrl = value;
        } else if (currentUrlType !== "") {
          console.log("взяли з redux url");
          currentUrl = currentUrlType;
        }
        const dataPokemonByType = await axios.get(currentUrl);
        if (
          dataPokemonByType.data.pokemon &&
          dataPokemonByType.data.pokemon.length > 0
        ) {
          const PokemonByType = dataPokemonByType.data.pokemon.slice(
            offset,
            offset + 12
          );

          const requests = PokemonByType.map((pokemon: any) =>
            axios.get(pokemon.pokemon.url)
          );
          try {
            const responses = await Promise.all(requests);
            const pokemonData = responses.map((response) => response.data);
            dispatch(changeListPokemon(pokemonData));

            if (offset + 12 >= dataPokemonByType.data.pokemon.length) {
              dispatch(changeNextVisible(false));
            } else {
              dispatch(changeNextVisible(true));
            }
            if (offset - 12 < 0) {
              dispatch(changePreviousVisible(false));
            } else {
              dispatch(changePreviousVisible(true));
            }
          } catch (error) {
            console.error("Error fetching pokemon data:", error);
            return [];
          }
        } else {
          // Немає покемонів
          console.log("No Pokemon data found.");
          dispatch(changeNextVisible(false));
          dispatch(changePreviousVisible(false));
        }
        setIsLoadingData(false);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getTypePokemon();
    getDataPokemons();
  }, []);

  return (
    <div className="header">
      <div className="footer">
        <h1 className="title">Pokedex</h1>
        <select
          onChange={(e) => getPokemonByType(e.target.value)}
          className="typeSelect"
        >
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
                  photo={pokemon.sprites.other.dream_world.front_default}
                  types={pokemon.types}
                  key={pokemon.id}
                />
              );
            })
          ) : isLoadingData ? (
            <div className="lds-dual-ring"></div>
          ) : (
            <h1>No Pokemon data found.</h1>
          )}
          <div className="button-section">
            <button
              className="btn-previous"
              disabled={isLoading}
              style={{ display: previousVisible ? "inline-block" : "none" }}
              onClick={() =>
                isTypeView
                  ? getPokemonByType("", offset - 12)
                  : previousUrl !== null && getDataPokemons(previousUrl)
              }
            >
              Previous
            </button>
            <button
              className="btn-next"
              disabled={isLoading}
              style={{ display: nextVisible ? "inline-block" : "none" }}
              onClick={() =>
                isTypeView
                  ? getPokemonByType("", offset + 12)
                  : nextUrl !== null && getDataPokemons(nextUrl)
              }
            >
              Next
            </button>
          </div>
        </div>
        <div className="infoPokemon">
          <ActivePokemon />
        </div>
      </div>
    </div>
  );
}

export default App;
