import React from "react";
import { firstLetterBig } from "../utils/utils";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { activeSlice } from "../store/reducers/ActivePokemon";

interface Type {
  type: {
    name: string;
    url: string;
  };
}

interface CardPokemonProps {
  name: string;
  types: Type[];
  photo: string;
}

function CardPokemon({ name, types, photo }: CardPokemonProps) {
  const dispatch = useAppDispatch();
  const { changeActivePokemon } = activeSlice.actions;
  const { defaultImage } = useAppSelector((state) => state.MainReducer);
  const typeElements = types.map((typeObj, index) => (
    <div className={typeObj.type.name.toLowerCase()} key={index}>
      {firstLetterBig(typeObj.type.name)}
    </div>
  ));

  const ActivePokemon = async (name: string) => {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${name}`
    );
    dispatch(changeActivePokemon(data));
  };
  return (
    <div
      className="card-pokemon"
      key={name}
      onClick={() => ActivePokemon(name)}
    >
      <img src={photo === null ? defaultImage : photo} alt={name} />
      <h2>{firstLetterBig(name)}</h2>
      <div className="pokemon-types">{typeElements}</div>
    </div>
  );
}

export default CardPokemon;
