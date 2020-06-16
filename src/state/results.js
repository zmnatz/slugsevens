import React, { useState, useEffect } from 'react';
import fire from "../api/fire";

const DEFAULT_TEAMS = []
const ResultContext = React.createContext(DEFAULT_TEAMS)

function populateTeam(id, team) {
  return {
    ...team,
    id,
    wins: 0,
    losses: 0,
    ties: 0,
    pf: 0,
    pa: 0
  }
}

function addResults(r, game, teams) {
  const home = r[game.home.id] || { ...teams[game.home.id] };
  const away = r[game.away.id] || { ...teams[game.away.id] };
  home.pf += game.score.home;
  home.pa += game.score.away;
  away.pf += game.score.away;
  away.pa += game.score.home;

  if (game.score.home > game.score.away) {
    home.wins++;
    away.losses++;
  } else if (game.score.away > game.score.home) {
    home.losses++;
    away.wins++;
  } else {
    home.ties++;
    away.ties++;
  }
  return [home, away];
}

function processResults (teams, games) {
  const results = Object.values(games).reduce((r, game) => {
    const [home, away] = addResults(r, game, teams);
    r[game.home.id] = home;
    r[game.away.id] = away;
    return r;
  }, {})
  return Object.values(results);
}

const ResultProvider = ({ children }) => {
  const [teams, setTeams] = useState();
  const [results, setResults] = useState(DEFAULT_TEAMS);

  useEffect(() => {
    const firebaseTeams = fire.database().ref('teams').orderByKey();
    firebaseTeams.on('value', snapshot => {
      const teams = snapshot.val();
      setTeams(Object.keys(teams).reduce((r, id) => {
        r[id] = populateTeam(id, teams[id]);
        return r;
      }, {}));
      return () => firebaseTeams.off('value');
    }, []);
    return () => firebaseTeams.off('value');
  }, []);

  useEffect(() => {
    const firebaseGames = fire.database().ref('games')
      .orderByChild('complete').equalTo(true);
    firebaseGames.on('value', snapshot => {
      if (teams == null) {
        return;
      }
      setResults(processResults(teams, snapshot.val()));
    });
    return () => firebaseGames.off('value');
  }, [teams]);

  return <ResultContext.Provider value={results}>
    {children}
  </ResultContext.Provider>;
}

const ResultConsumer = ResultContext.Consumer;
export { ResultProvider, ResultConsumer };
export default ResultContext;