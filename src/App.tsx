import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./hooks/redux";
import { mainSlice } from "./store/reducers/MainSlice";
import CardPokemon from "./components/CardPokemon";
import { firstLetterBig } from "./utils/utils";
import InfoPokemon from "./components/InfoPokemon";
import { Type } from "./models/models";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [allAmountPage, setAllAmountPage] = useState(999);
  const [curPage, setCurPage] = useState(1);

  const {
    listPokemon,
    previousVisible,
    nextVisible,
    isTypeView,
    offset,
    currentUrlType,
  } = useAppSelector((state) => state.MainReducer);

  const {
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

      try {
        const responses = await Promise.all(requests);
        const pokemonData = responses.map((response) => response.data);
        dispatch(changeListPokemon(pokemonData));
      } catch (error) {
        console.error("Error fetching pokemon data:", error);
        return [];
      }
      //Якщо немає силки, то цю кнопку не грузимо
      dispatch(changeNextVisible(!!data.next));
      dispatch(changePreviousVisible(!!data.previous));
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

    try {
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

        const {
          data: { pokemon: pokemons },
        } = await axios.get(currentUrl);

        if (pokemons && pokemons.length > 0) {
          setAllAmountPage(Math.ceil(pokemons.length / 12));

          const startIdx = page ? (page - 1) * 12 : offset;
          const endIdx = startIdx + 12;
          const PokemonByType = pokemons.slice(startIdx, endIdx);

          const nextPageOffset = endIdx;
          const previousVisible = startIdx >= 12;

          dispatch(changeNextVisible(nextPageOffset < pokemons.length));
          dispatch(changePreviousVisible(previousVisible));

          const requests = PokemonByType.map((pokemon: any) =>
            axios.get(pokemon.pokemon.url)
          );

          const responses = await Promise.all(requests);
          const pokemonData = responses.map((response) => response.data);
          dispatch(changeListPokemon(pokemonData));
        } else {
          // Немає покемонів
          console.log("No Pokemon data found.");
          dispatch(changeNextVisible(false));
          dispatch(changePreviousVisible(false));
        }

        setIsLoadingData(false);
      }
    } catch (error) {
      console.error("Error fetching pokemon data:", error);
      setIsLoading(false);
      setIsLoadingData(false);
      return [];
    } finally {
      setIsLoading(false);
      setIsLoadingData(false);
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
              disabled={isLoading || !previousVisible} // Змінено тут
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
              disabled={isLoading || !nextVisible}
              onClick={() => handlePageChange(curPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
        <InfoPokemon />
      </div>
    </div>
  );
}

export default App;
