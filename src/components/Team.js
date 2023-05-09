import React, { useContext, useCallback } from "react";
import { Grid, Label } from "semantic-ui-react";
import fire from "../api/fire";
import { remove } from "firebase/database";
import Permissions from "../state/permissions";

const DeleteButton = React.memo(({ id }) => {
  const team = useFirebaseRef(`teams/${id}`);
  const onDelete = useCallback(() => remove(team), [team]);
  return (
    <Label corner="right" as="a" color="red" icon="delete" onClick={onDelete} />
  );
});

const Team = ({ team }) => {
  const { master } = useContext(Permissions);
  return (
    <Grid.Row>
      <Grid.Column width={6}>
        {team.name}
        {master && <DeleteButton id={team.id} />}
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
