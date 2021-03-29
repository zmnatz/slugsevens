import React, { useMemo, useState } from "react";
import { Segment, Button, Table } from "semantic-ui-react";

import Game from "./Game";

import { groupBy } from "../utils/";
import ResultContext from "../state/results";
import useQuery from "../hooks/useQuery";

export default _ => {
  const { games } = React.useContext(ResultContext);
  const [selected, setSelected] = useState();
  const divisions = useQuery("divisions");

  const filteredGames = useMemo(
    () =>
      games.filter(
        game => game != null && (selected == null || game.division === selected)
      ),
    [games, selected]
  );

  const processedGroups = useMemo(() => {
    const g = groupBy(filteredGames, "time");
    const times = Object.keys(g);
    times.sort((a, b) => Number(a) - Number(b));
    return times.map(time => g[time]);
  }, [filteredGames]);

  const scores = useMemo(
    () =>
      Object.values(processedGroups).map(groupedGames => {
        groupedGames.sort((a, b) => a.field - b.field);
        return (
          <Table.Row key={groupedGames[0].time} verticalAlign="top">
            <Table.Cell>
              {groupedGames[0].time.substring(0, 2)}:
              {groupedGames[0].time.substring(2, 4)}
            </Table.Cell>
            {groupedGames.map(({ id }) => (
              <Game key={id} id={id} />
            ))}
          </Table.Row>
        );
      }),
    [processedGroups]
  );

  return useMemo(
    () => (
      <React.Fragment>
        <Segment basic>
          {divisions.map(division => (
            <Button
              key={division}
              positive={selected === division}
              onClick={() =>
                setSelected(division === selected ? null : division)
              }
            >
              {division}
            </Button>
          ))}
        </Segment>
        <Table>
          <Table.Body>{scores}</Table.Body>
        </Table>
      </React.Fragment>
    ),
    [scores, selected, divisions]
  );
};
