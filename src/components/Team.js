import React, { useContext } from 'react';
import { Grid, Button } from 'semantic-ui-react';
import fire from '../api/fire';
import Permissions from 'state/permissions'

const onDelete = (team) => {
  fire.database().ref(`teams/${team.id}`).remove();
}

const Team = ({ team }) => {
  const {master} = useContext(Permissions);
  return <Grid.Row>
    <Grid.Column width={6}>
      {team.name}
      {master && <Button icon="delete" color='red' float="right"
          onClick={onDelete} />
      }
    </Grid.Column>
    <Grid.Column>{team.wins}</Grid.Column>
    <Grid.Column>{team.losses}</Grid.Column>
    <Grid.Column>{team.ties}</Grid.Column>
    <Grid.Column>{team.pf}</Grid.Column>
    <Grid.Column>{team.pa}</Grid.Column>
  </Grid.Row>
}
export default Team;
