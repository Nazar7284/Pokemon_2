import React from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { activeSlice } from "../store/reducers/ActivePokemonSlice";
import { firstLetterBig } from "../utils/utils";
import { CardPokemonProps } from "../models/models";

function CardPokemon({ name, types, photo }: CardPokemonProps) {
  const dispatch = useAppDispatch();
  const { changeActivePokemon } = activeSlice.actions;
  const { defaultImage } = useAppSelector((state) => state.MainReducer);

  const fetchActivePokemon = async (pokemonName: string) => {
    try {
      const { data } = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
      );
      dispatch(changeActivePokemon(data));
    } catch (error) {
      console.error("Помилка при отриманні активного Покемона:", error);
    }
  };

  return (
    <div className="card-pokemon" onClick={() => fetchActivePokemon(name)}>
      <div className="pokemon-details">
        <img src={photo || defaultImage} alt={name} />
        <h2>{firstLetterBig(name)}</h2>
      </div>
      <div className="pokemon-types">
        {types.map((typeObj, index) => (
          <div className={typeObj.type.name.toLowerCase()} key={index}>
            {firstLetterBig(typeObj.type.name)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CardPokemon;
