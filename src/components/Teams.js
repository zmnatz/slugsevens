import React, { useContext } from "react";
import { Grid } from "semantic-ui-react";
import Team from "./Team";
import AddTeam from "./AddTeam";

import Permissions from "../state/permissions";
import { rankTeams, groupBy } from "../utils";

const List = ({ teams = [] }) => {
  return Object.entries(groupBy(teams, "pool")).map((entry) => (
    <div key={entry[0]}>
      <h4>Pool {entry[0]}</h4>
      <Grid celled columns="equal">
        <Grid.Row>
          <Grid.Column width={6}>Team</Grid.Column>
          <Grid.Column>W</Grid.Column>
          <Grid.Column>L</Grid.Column>
          <Grid.Column>T</Grid.Column>
          <Grid.Column>PF</Grid.Column>
          <Grid.Column>PA</Grid.Column>
        </Grid.Row>
        {entry[1].sort(rankTeams).map((team) => (
          <Team key={team.id} team={team} />
        ))}
      </Grid>
    </div>
  ));
};

const Teams = ({ teams, division }) => {
  const { master } = useContext(Permissions);
  return (
    <div>
      <h3>{division}</h3>
      {master && <AddTeam division={division} />}
      <List teams={teams} />
    </div>
  );
};
export default Teams;
