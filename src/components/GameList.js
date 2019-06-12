import React from 'react';
import useQuery from 'hooks/useQuery';
import useFirebase from 'hooks/useFirebase'
import { Table, Input } from 'semantic-ui-react';

const GameRow = React.memo(({id}) => {
  const game = useFirebase(`games/${id}`)
  const onChange = React.useCallback((e, {name, value}) => {
    game.update({[name]: value});
  }, [game])
  const {home='', away='', time='', field='', referee='', division=''} = game.data;
  return React.useMemo(() => <Table.Row>
    <Table.Cell width="five">{home && home.name}: {division}</Table.Cell>
    <Table.Cell width="five">{away && away.name}: {division}</Table.Cell>
    <Table.Cell>
      <Input name="time" type="number" value={time} onChange={onChange}/>
    </Table.Cell>
    <Table.Cell>
      <Input name="field" type="number" value={field} onChange={onChange}/>
    </Table.Cell>
    <Table.Cell>
      <Input name="referee" value={referee} onChange={onChange}/>
    </Table.Cell>
  </Table.Row>,
  [home, away, time, field, referee, division, onChange]
  )
}) 

export default () => {
  const games = useQuery('games');

  return React.useMemo(() => {
    return <Table columns={5} unstackable striped>
      <Table.Header>
        <Table.Row>
        <Table.HeaderCell width="five">Home</Table.HeaderCell>
        <Table.HeaderCell width="five">Away</Table.HeaderCell>
        <Table.HeaderCell>Time</Table.HeaderCell>
        <Table.HeaderCell>Field</Table.HeaderCell>  
        <Table.HeaderCell>Ref</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {games.map(({id}) => <GameRow id={id} key={id}/>)}
      </Table.Body>
    </Table>
  }, [games])
}