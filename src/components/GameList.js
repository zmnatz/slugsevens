import React from "react";
import useFirebase from "../hooks/useFirebase";
import { Table, Input } from "semantic-ui-react";
import fire from "../api/fire";

const GameRow = React.memo(({ id }) => {
  const game = useFirebase(`games/${id}`);
  const homeTeam = useFirebase(`games/${id}/home`);
  const awayTeam = useFirebase(`games/${id}/away`);
  const onChange = React.useCallback(
    (e, { name, value }) => {
      game.update({ [name]: value });
    },
    [game]
  );

  const { time = "", field = "", color = "", division = "" } = game.data;
  return React.useMemo(
    () => (
      <Table.Row>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{division}</Table.Cell>
        <Table.Cell width="five">
          <Input
            name="home"
            value={homeTeam.data.name}
            onChange={(e, { value }) => homeTeam.update({ name: value })}
          />
        </Table.Cell>
        <Table.Cell width="five">
          <Input
            value={awayTeam.data.name}
            onChange={(e, { value }) => awayTeam.update({ name: value })}
          />
        </Table.Cell>
        <Table.Cell>
          <Input name="time" type="number" value={time} onChange={onChange} />
        </Table.Cell>
        <Table.Cell>
          <Input name="field" type="number" value={field} onChange={onChange} />
        </Table.Cell>
        <Table.Cell>
          <Input name="color" value={color} onChange={onChange} />
        </Table.Cell>
      </Table.Row>
    ),
    [id, homeTeam, awayTeam, time, field, color, division, onChange]
  );
});

export default () => {
  const [games, setGames] = React.useState([]);
  React.useEffect(() => {
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
