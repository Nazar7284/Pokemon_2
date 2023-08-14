import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { activeSlice } from "../store/reducers/ActivePokemonSlice";
import { PokemonActive } from "../models/models";
import { firstLetterBig } from "../utils/utils";

function InfoPokemon() {
  const { activePokemon } = useAppSelector((state) => state.ActiveReducer);
  const { defaultImage } = useAppSelector((state) => state.MainReducer);
  const { changeActivePokemon } = activeSlice.actions;

  const dispatch = useAppDispatch();

  const handleEmptyActivePokemon = () => {
    const emptyActivePokemon: PokemonActive = {
      name: "",
      id: 0,
      sprites: {
        other: {
          dream_world: {
            front_default: "",
          },
        },
      },
      stats: [
        { base_stat: 0 },
        { base_stat: 0 },
        { base_stat: 0 },
        { base_stat: 0 },
        { base_stat: 0 },
        { base_stat: 0 },
      ],
      weight: 0,
      moves: [],
    };
    dispatch(changeActivePokemon(emptyActivePokemon));
  };

  return (
    <div className="infoPokemon">
      {activePokemon.name ? (
        <div className="details" onClick={handleEmptyActivePokemon}>
          <img
            src={
              activePokemon?.sprites?.other?.dream_world["front_default"] ===
              null
                ? defaultImage
                : activePokemon?.sprites?.other?.dream_world["front_default"]
            }
            alt={activePokemon.name}
          />
          <h2>
            {firstLetterBig(activePokemon.name)} #
            {activePokemon?.id?.toString()?.padStart(3, "0")}{" "}
          </h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Fire</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Attack", stat: activePokemon?.stats?.[1]?.base_stat },
                { name: "Defense", stat: activePokemon?.stats?.[2]?.base_stat },
                { name: "HP", stat: activePokemon?.stats?.[0]?.base_stat },
                {
                  name: "SP Attack",
                  stat: activePokemon?.stats?.[3]?.base_stat,
                },
                {
                  name: "SP Defense",
                  stat: activePokemon?.stats?.[4]?.base_stat,
                },
                { name: "Speed", stat: activePokemon?.stats?.[5]?.base_stat },
                { name: "Weight", stat: activePokemon?.weight },
                { name: "Total moves", stat: activePokemon?.moves?.length },
              ].map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.stat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Select a Pokemon</h1>
      )}
    </div>
  );
}
export default InfoPokemon;
