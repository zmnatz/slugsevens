import React, { useState, useMemo, useEffect } from 'react';
import fire from "../api/fire";

import { SCORE_DEFAULTS, determineOutcomes, reverseOutcome, determineWinner } from "../utils";

const DEFAULT_TEAMS = []
const DEFAULT_GAMES = [];

const ResultContext = React.createContext({
  teams: DEFAULT_TEAMS,
  games: DEFAULT_GAMES
})

const ResultProvider = ({ children }) => {
  const [teams, setTeams] = useState(DEFAULT_TEAMS);
  const [games, setGames] = useState(DEFAULT_GAMES);

  useEffect(() => {
    let teamsRef = fire.database().ref("teams").orderByKey();
    teamsRef.on("child_added", snapshot =>
      setTeams(prev => {
        const prevTeam = prev[snapshot.key] || SCORE_DEFAULTS;
        let team = {
          ...prevTeam,
          ...snapshot.val(),
          id: snapshot.key
        };
        return {
          ...prev,
          [team.id]: team
        };
      })
    );

    teamsRef.on("child_removed", snapshot =>
      setTeams(prev => ({
        ...prev,
        [snapshot.key]: undefined
      }))
    );
    return () => {
      teamsRef.off('child_added');
      teamsRef.off('child_removed')
    }
  }, [])

  useEffect(() => {
    let gamesRef = fire.database().ref("games").orderByKey();
    gamesRef.on("child_added", snapshot => {
      const game = { ...snapshot.val(), id: snapshot.key };
      setGames(prev => ({
        ...prev,
        [game.id]: game
      }));

      if (game.complete) {
        setTeams(teams => determineOutcomes(game, teams));
      }
    });

    gamesRef.on("child_removed", snapshot => {
      setGames(prev => ({
        ...prev,
        [snapshot.key]: undefined
      }));
    });


    gamesRef.on("child_changed", snapshot => {
      const game = determineWinner(snapshot.val());
      let outcomeChanged;
      setGames(games => {
        outcomeChanged = !game.complete && games[game.id] && games[game.id].complete;
        return { ...games, [game.id]: game };
      })
      if (game.complete) {
        setTeams(teams => determineOutcomes(game, teams));
      } else if (outcomeChanged) {
        setTeams(teams => reverseOutcome(game, teams));
      }
    });

    return () => {
      gamesRef.off('child_added');
      gamesRef.off('child_removed');
      gamesRef.off('child_changed');
    }
  }, [])

  const filteredTeams = useMemo(() => Object.values(teams).filter(team => team), [teams]);

  return useMemo(() => (
    <ResultContext.Provider value={{ teams: filteredTeams, games: Object.values(games) }}>
      {children}
    </ResultContext.Provider>
  ), [filteredTeams, games, children])
}

const ResultConsumer = ResultContext.Consumer
export { ResultProvider, ResultConsumer };
export default ResultContext;