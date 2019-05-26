import React from 'react';
import fire from '../api/fire'
import {Grid, Button} from 'semantic-ui-react'

class Registrations extends React.Component {
  state = {
    teams: []
  }
  componentDidMount () {
    const teams = fire
      .database()
      .ref('registration')
      .orderByKey();
    teams.on('child_added', snapshot => {
        this.setState(prev => ({
          teams: [
            ...prev.teams,
            {
              ...snapshot.val(),
              id: snapshot.key
            }
          ]
        }))
      })
    teams.on('child_changed', snapshot => {
        this.setState(prev => {
          const teams = [...prev.teams];
          teams.splice(
            teams.findIndex(({id}) => id === snapshot.key),
            1,
            {...snapshot.val(), id: snapshot.key}
          )
          return {teams}
        })
      })

    teams.on('child_removed', snapshot => this.setState(prev => ({
      teams: prev.teams.filter(({id}) => id !== snapshot.key)
    })))
  }

  removeTeam = (team) => {
    fire.database().ref(`registration/${team.id}`).update({deleted: true})
  }
  

  render () {
    return <Grid celled columns='equal'>
    <Grid.Row>
      <Grid.Column>Team</Grid.Column>
      <Grid.Column>Email</Grid.Column>
      <Grid.Column>Division</Grid.Column>
      <Grid.Column>Delete</Grid.Column>
    </Grid.Row>
    {this.state.teams
      .filter(({deleted}) => !deleted)
      .map(props => {
      const {team, email, division} = props;
      return <Grid.Row key={props.id}> 
        <Grid.Column>{team}</Grid.Column>
        <Grid.Column>{email}</Grid.Column>
        <Grid.Column>{division}</Grid.Column>
        <Grid.Column>
          <Button color="red" onClick={this.removeTeam.bind(this, props)}>Delete</Button>
        </Grid.Column>
      </Grid.Row>
    })}
  </Grid>;
  }
}
export default Registrations;