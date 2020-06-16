import React, { useMemo, memo } from "react";
import { Row, Heading } from 'gestalt'

import Game from "./Game";

import { groupBy } from "../utils/";
import useQuery from "hooks/useQuery";

const TimeSlot = ({ games }) => {
  const hours = games[0].time.substring(0, 2);
  const minutes = games[0].time.substring(2, 4);

  const sortedGames = useMemo(() => {
    const sorted = [...games];
    sorted.sort((a, b) => a.field - b.field);
    return sorted;
  }, [games]);

  return <Row alignItems="start" gap={2}>
    <Heading size="sm">{hours}:{minutes}</Heading>
    <Row key={hours + minutes + 'names'} wrap gap={1} alignItems='start'>
      {sortedGames.map(({ id, complete }) => (
        <Game key={id + complete} id={id} />
      ))}
    </Row>
  </Row>
}

export default memo(_ => {
  const games = useQuery('games')

  const processedGroups = useMemo(() => {
    const g = groupBy(games, "time");
    const times = Object.keys(g);
    times.sort((a, b) => Number(a) - Number(b));

    return times.map(time => g[time]);
  }, [games]);

    return processedGroups.map((groupedGames, index) => (
      <TimeSlot key={index} games={groupedGames} />
    ));
});
