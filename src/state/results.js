import React, { useState, useMemo, useEffect } from "react";
import { query, orderByKey } from "firebase/database";
import {
  SCORE_DEFAULTS,
  determineOutcomes,
  reverseOutcome,
  determineWinner,
} from "../utils";
import useQuery from "hooks/useFirebase";

const DEFAULT_TEAMS = [];
const DEFAULT_GAMES = [];

const ResultContext = React.createContext({
  teams: DEFAULT_TEAMS,
  games: DEFAULT_GAMES,
});

const ResultProvider = ({ children }) => {
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [games, setGames] = useState(DEFAULT_GAMES);
  const { ref: teamsRef } = useQuery("teams");
  const { ref: gamesRef, data } = useQuery("games");
  console.log(data);

  const filteredTeams = useMemo(
    () => Object.values(teams).filter((team) => team),
    [teams]
  );

  return useMemo(
    () => (
      <ResultContext.Provider
        value={{ teams: filteredTeams, games: Object.values(games) }}
      >
        {children}
      </ResultContext.Provider>
    ),
    [filteredTeams, games, children]
  );
};

const ResultConsumer = ResultContext.Consumer;
export { ResultProvider, ResultConsumer };
export default ResultContext;
