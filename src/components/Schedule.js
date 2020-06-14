import React, { useMemo, useContext } from "react";
import { Table } from 'gestalt'

import Game from "./Game";

import { groupBy } from "../utils/";
import ResultContext from "../state/results";

export default _ => {
  const { games } = useContext(ResultContext);

  const processedGroups = useMemo(() => {
    const g = groupBy(games, "time");
    const times = Object.keys(g);
    times.sort((a, b) => Number(a) - Number(b));

    return times.map(time => g[time]);
  }, [games]);

  return <Table>
    <Table.Body>
      {
        Object.values(processedGroups).map(groupedGames => {
          groupedGames.sort((a, b) => a.field - b.field);
          return (
            <Table.Row key={groupedGames[0].time} verticalAlign="top">
              <Table.Cell>
                {groupedGames[0].time.substring(0, 2)}:{groupedGames[0].time.substring(2, 4)}
              </Table.Cell>
              {groupedGames.map(({ id, complete }) => <Game key={id + complete} id={id} />)}
            </Table.Row>
          );
        })
      }
    </Table.Body>
  </Table>
};
