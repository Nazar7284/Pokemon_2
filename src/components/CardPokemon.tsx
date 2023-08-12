import React from "react";
import { firstLetterBig } from "../utils/utils";

interface Type {
  type: {
    name: string;
    url: string;
  };
  slot: number;
}

interface CardPokemonProps {
  name: string;
  types: Type[];
  photo: string;
}

function CardPokemon({ name, types, photo }: CardPokemonProps) {
  const typeElements = types.map((typeObj, index) => (
    <div className={typeObj.type.name.toLowerCase()} key={index}>
      {firstLetterBig(typeObj.type.name)}
    </div>
  ));

  return (
    <div className="card-pokemon" key={name}>
      <img src={photo} alt={name} />
      <h2>{firstLetterBig(name)}</h2>
      <div className="pokemon-types">{typeElements}</div>
    </div>
  );
}

export default CardPokemon;
