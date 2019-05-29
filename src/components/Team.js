import React, { useContext, useCallback } from "react";
import { Grid, Label } from "semantic-ui-react";
import fire from "../api/fire";
import Permissions from "../state/permissions";

const Team = ({ team }) => {
  const { master } = useContext(Permissions);
  const onDelete = useCallback(
    () =>
      fire
        .database()
        .ref(`teams/${team.id}`)
        .remove(),
    [team]
  );
  return (
    <Grid.Row>
      <Grid.Column width={6}>
        {team.name}
        {master && (
          <Label
            corner="right"
            as="a"
            color="red"
            icon="delete"
            onClick={onDelete}
          />
        )}
      </Grid.Column>
      <Grid.Column>{team.wins}</Grid.Column>
      <Grid.Column>{team.losses}</Grid.Column>
      <Grid.Column>{team.ties}</Grid.Column>
      <Grid.Column>{team.pf}</Grid.Column>
      <Grid.Column>{team.pa}</Grid.Column>
    </Grid.Row>
  );
};
export default Team;
