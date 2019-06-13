import React from 'react';
import useQuery from 'hooks/useQuery';
import useFirebase from 'hooks/useFirebase'
import { Table, Input } from 'semantic-ui-react';
import fire from 'api/fire';

const TeamRow = React.memo(({id, games, gameRef}) => {
  const team = useFirebase(`teams/${id}`)
  const onChange = React.useCallback((e, {value}) => {
    team.update({name: value});
    games.forEach(game => {
      if (game.home.id === id) {
        gameRef.ref(`games/${game.id}/home`).update({name: value})
      } else if (game.away.id === id) {
        gameRef.ref(`games/${game.id}/away`).update({name: value})
      }
    })
  }, [team, id, gameRef, games])
  return <Table.Row>
    <Table.Cell>{id}</Table.Cell>
    <Table.Cell><Input value={team.data.name} onChange={onChange}/></Table.Cell>
    <Table.Cell>{team.data.division}</Table.Cell>
  </Table.Row>
})

export default () => {
  const teams = useQuery('teams');
  const games = useQuery('games');
  const gameRef = fire.database()

  return <Table columns={2} unstackable striped>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>ID</Table.HeaderCell>
        <Table.HeaderCell width="five">Team</Table.HeaderCell>
        <Table.HeaderCell>Division</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {teams.map(({id}) => <TeamRow id={id} key={id} games={games} gameRef={gameRef}/>)}
    </Table.Body>
  </Table>
}