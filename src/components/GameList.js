import React, { memo, useCallback, useMemo, useState, useEffect } from "react";
import useFirebase from "../hooks/useFirebase";
import { Table, TextField } from "gestalt";
import fire from "../api/fire";

const GameRow = memo(({ id }) => {
  const game = useFirebase(`games/${id}`);
  const homeTeam = useFirebase(`games/${id}/home`);
  const awayTeam = useFirebase(`games/${id}/away`);
  const onChange = useCallback(({ event, value }) => {
    game.update({ [event.target.name]: value });
  }, [game]);

  const { time = "", field = "", color = "", division = "" } = game.data;
  return useMemo(() => (
    <Table.Row>
      <Table.Cell>{id}</Table.Cell>
      <Table.Cell>{division}</Table.Cell>
      <Table.Cell width="five">
        <TextField
          id={`${id}home`}
          value={homeTeam.data.name || ''}
          onChange={({ value }) => homeTeam.update({ name: value })}
        />
      </Table.Cell>
      <Table.Cell width="five">
        <TextField id={`${id}away`} 
          value={awayTeam.data.name || ''}
          onChange={({ value }) => awayTeam.update({ name: value })}
        />
      </Table.Cell>
      <Table.Cell>
        <TextField id="time" name="time" type="number" value={time} onChange={onChange} />
      </Table.Cell>
      <Table.Cell>
        <TextField id="field" name="field" type="number" value={String(field)} onChange={onChange} />
      </Table.Cell>
      <Table.Cell>
        <TextField id="color" name="color" value={color} onChange={onChange} />
      </Table.Cell>
    </Table.Row>
  ), [id, homeTeam, awayTeam, time, field, color, division, onChange]);
});

export default () => {
  const [games, setGames] = useState([]);
  useEffect(() => {
    fire
      .database()
      .ref("games")
      .orderByChild("division")
      .on("child_added", snapshot => {
        setGames(prev => [...prev, { id: snapshot.key, ...snapshot.val() }]);
      });
  }, []);

  return React.useMemo(() => {
    return (
      <Table columns={7} unstackable striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Division</Table.HeaderCell>
            <Table.HeaderCell width="five">Home</Table.HeaderCell>
            <Table.HeaderCell width="five">Away</Table.HeaderCell>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>Field</Table.HeaderCell>
            <Table.HeaderCell>Color</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {games.map(({ id }) => (
            <GameRow id={id} key={id} />
          ))}
        </Table.Body>
      </Table>
    );
  }, [games]);
};
