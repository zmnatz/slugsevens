import React, { Component } from "react";
import { Router } from "@reach/router";
import fire from "./api/fire";
import "semantic-ui-css/semantic.min.css";
import { SCORE_DEFAULTS, determineOutcomes, reverseOutcome } from "./utils";
import Admin from "./components/Admin";
import View from "./components/View";
import Registrations from './components/Registrations'
import Generator from './components/Generator'
import {PermissionProvider} from 'state/permissions'

class App extends Component {
  state = {
    teams: [],
    games: [],
    numFields: 2
  };
  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let teamsRef = fire
      .database()
      .ref("teams")
      .orderByKey();
    teamsRef.on("child_added", snapshot => {
      this.setState(prev => {
        const prevTeam = prev.teams[snapshot.key] || SCORE_DEFAULTS;
        let team = {
          ...prevTeam,
          ...snapshot.val(),
          id: snapshot.key
        };
        return {
          teams: { ...prev.teams, [team.id]: team }
        };
      });
    });

    teamsRef.on("child_removed", snapshot =>
      this.setState(prev => ({
        teams: {
          ...prev.teams,
          [snapshot.key]: undefined
        }
      }))
    );

    let gamesRef = fire
      .database()
      .ref("games")
      .orderByKey();

    gamesRef.on("child_added", snapshot => {
      const game = { ...snapshot.val(), id: snapshot.key };

      this.setState(prev => {
        let teams = prev.teams;
        if (game.complete) {
          teams = determineOutcomes(game, teams);
        }
        return {
          teams,
          games: { ...prev.games, [game.id]: game }
        };
      });
    });
    gamesRef.on("child_removed", snapshot => {
      this.setState(prev => ({
        games: {
          ...prev.games,
          [snapshot.key]: undefined
        }
      }));
    });

    gamesRef.on("child_changed", snapshot => {
      const game = { ...snapshot.val() };

      this.setState(prev => {
        let teams = prev.teams;
        if (game.complete) {
          teams = determineOutcomes(game, teams);
        } else if (prev.games[game.id] && prev.games[game.id].complete && !game.complete) {
          teams = reverseOutcome(game, teams);
        }
        return {
          teams,
          games: { ...prev.games, [game.id]: game }
        };
      });
    });
  }

  addTeam(newTeam) {
    fire
      .database()
      .ref("teams")
      .push({
        ...newTeam,
        ...SCORE_DEFAULTS
      });
  }

  render() {
    const games = Object.values(this.state.games),
      teams = Object.values(this.state.teams).filter(team => team);

    return (<PermissionProvider>
      <Router>
        <Generator path="admin/master" teams={teams}/>
      </Router>
      <Router>
        <Admin path="admin/*" teams={teams} games={games} />
        <Registrations path="/registrations"/>
        <View default teams={teams} games={games} />
      </Router>
    </PermissionProvider>);
  }
}

export default App;
