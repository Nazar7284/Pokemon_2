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
  const [allAmountPage, setAllAmountPage] = useState(999);
  const [curPage, setCurPage] = useState(1);

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
      const response = await axios.get<{ results: Type[] }>(
        "https://pokeapi.co/api/v2/type"
      );
      const types: Type[] = response.data.results;
      const typeNames: string[] = types.map((type) =>
        firstLetterBig(type.name)
      );

      const selectElem = document.querySelector(
        ".typeSelect"
      ) as HTMLSelectElement;
      typeNames.forEach((typeName, index) => {
        const option = new Option(typeName, types[index].url);
        selectElem.appendChild(option);
      });
    } catch (error) {
      console.error("Не вдалося отримати дані про типи покемонів:", error);
    }
  };

  const getDataPokemons = async (page?: number) => {
    if (page) {
      if (curPage === page) {
        alert(`Ви вже знаходитеся на сторінці ${page}`);
        return;
      }
      setCurPage(page);
    } else {
      setCurPage(1);
    }
    dispatch(changeIsTypeView(false));
    if (!isLoading) {
      setIsLoadingData(true); //дані завантажуються
      setIsLoading(true); // дісейбл кнопок
      dispatch(changeListPokemon([])); // щоб крутився лоудер ініц пустий масив
      window.scroll(0, 0);

      const defaultUrl = "https://pokeapi.co/api/v2/pokemon/?limit=12";

      let curUrl = defaultUrl;
      if (page) {
        const offset = (page - 1) * 12;
        console.log(offset);
        curUrl = `${defaultUrl}&offset=${offset}`;
      }

      const { data } = await axios.get(curUrl);

      setAllAmountPage(Math.ceil(data.count / 12)); // к-сть сторінок

      const requests = data.results.map((pokemon: any) =>
        axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      );

      //Якщо немає силки, то цю кнопку не грузимо
      dispatch(changeNextVisible(!!data.next));
      dispatch(changePreviousVisible(!!data.previous));

      try {
        const responses = await Promise.all(requests);
        const pokemonData = responses.map((response) => response.data);
        dispatch(changeListPokemon(pokemonData));
      } catch (error) {
        console.error("Error fetching pokemon data:", error);
        return [];
      }
    }
    setIsLoading(false);
    setIsLoadingData(false);
  };

  const getPokemonByType = async (
    value?: string,
    offset: number = 0,
    page?: number
  ) => {
    console.log("type");
    if (page) {
      if (curPage === page) {
        alert(`Ви вже знаходитеся на сторінці ${page}`);
        return;
      }
      setCurPage(page);
    }
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
          setCurPage(1);
          currentUrl = value;
        } else if (currentUrlType !== "") {
          console.log("взяли з redux url");
          console.log(currentUrlType);
          currentUrl = currentUrlType;
        }
        const dataPokemonByType = await axios.get(currentUrl);
        if (
          dataPokemonByType.data.pokemon &&
          dataPokemonByType.data.pokemon.length > 0
        ) {
          setAllAmountPage(
            Math.ceil(dataPokemonByType.data.pokemon.length / 12)
          );

          let PokemonByType = dataPokemonByType.data.pokemon.slice(
            offset,
            offset + 12
          );

          let nextPageOffset = offset + 12;
          let prevPageOffset = offset - 12;

          if (page) {
            PokemonByType = dataPokemonByType.data.pokemon.slice(
              (page - 1) * 12,
              (page - 1) * 12 + 12
            );
            nextPageOffset = (page - 1) * 12 + 12;
            prevPageOffset = (page - 1) * 12 - 12;
          }

          const nextVisible =
            nextPageOffset < dataPokemonByType.data.pokemon.length;
          const previousVisible = prevPageOffset >= 0;

          dispatch(changeNextVisible(nextVisible));
          dispatch(changePreviousVisible(previousVisible));

          const requests = PokemonByType.map((pokemon: any) =>
            axios.get(pokemon.pokemon.url)
          );
          try {
            const responses = await Promise.all(requests);
            const pokemonData = responses.map((response) => response.data);
            dispatch(changeListPokemon(pokemonData));
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
        setIsLoading(false);
        setIsLoadingData(false);
      }
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (isTypeView) {
      getPokemonByType("", offset + 12, pageNumber);
    } else {
      getDataPokemons(pageNumber);
    }
  };

  useEffect(() => {
    console.log("render");
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
        <div className="all-pokemon">
          {isLoadingData ? (
            <div className="lds-dual-ring"></div>
          ) : (
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
              ) : (
                <h1>No Pokemon data found.</h1>
              )}
            </div>
          )}
          <div
            className="curpage"
            style={{
              display: previousVisible || nextVisible ? "block" : "none",
            }}
          >
            Поточна сторінка {curPage}
          </div>
          <div className="button-section">
            <button
              className="btn-previous"
              disabled={isLoading}
              style={{ display: previousVisible ? "inline-block" : "none" }}
              onClick={() => handlePageChange(curPage - 1)}
            >
              Previous
            </button>
            <div
              className="page"
              style={{
                display: previousVisible || nextVisible ? "flex" : "none",
              }}
            >
              {[
                curPage - 2,
                curPage - 1,
                curPage,
                curPage + 1,
                curPage + 2,
              ].map((pageNumber) =>
                pageNumber > 0 && pageNumber <= allAmountPage ? (
                  <div
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </div>
                ) : null
              )}
            </div>
            <button
              className="btn-next"
              disabled={isLoading}
              style={{ display: nextVisible ? "inline-block" : "none" }}
              onClick={() => handlePageChange(curPage + 1)}
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
