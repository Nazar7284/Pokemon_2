import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { activeSlice } from "../store/reducers/ActivePokemon";
import { PokemonActive } from "../models/models";
import { firstLetterBig } from "../utils/utils";

function ActivePokemon() {
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
    <div>
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
              <tr>
                <td>Attack</td>
                <td>{activePokemon?.stats?.[1]?.base_stat}</td>
              </tr>
              <tr>
                <td>Defense</td>
                <td>{activePokemon?.stats?.[2]?.base_stat}</td>
              </tr>
              <tr>
                <td>HP</td>
                <td>{activePokemon?.stats?.[1]?.base_stat}</td>
              </tr>
              <tr>
                <td>SP Attack</td>
                <td>{activePokemon?.stats?.[3]?.base_stat}</td>
              </tr>
              <tr>
                <td>SP Defense</td>
                <td>{activePokemon?.stats?.[4]?.base_stat}</td>
              </tr>
              <tr>
                <td>Speed</td>
                <td>{activePokemon?.stats?.[5]?.base_stat}</td>
              </tr>
              <tr>
                <td>Weight</td>
                <td>{activePokemon?.weight}</td>
              </tr>
              <tr>
                <td>Total moves</td>
                <td>{activePokemon?.moves?.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <h1>Select a Pokemon</h1>
      )}
    </div>
  );
}
export default ActivePokemon;
