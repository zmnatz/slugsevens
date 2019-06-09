import React, { useCallback, useMemo, useState } from "react";
import { Card, Segment, Sidebar } from "semantic-ui-react";

import TeamList from "./TeamList";
import FilterMenu from "./FilterMenu";
import Game from "./Game";

import { groupBy } from "../utils/";
import ResultContext from "state/results";

export default _ => {
  const {games} = React.useContext(ResultContext)
  const [sidebar, setSidebar] = useState();
  const [selected, setSelected] = useState();

  const toggleSidebar = useCallback(() => setSidebar(prev => !prev), [
    setSidebar
  ]);

  const clearSelected = useCallback(() => setSelected(null), [setSelected]);

  const filteredGames = useMemo(
    () =>
      games
        .filter(
          game =>
            game != null &&
            (selected == null ||
              game.home.id === selected ||
              game.away.id === selected)
        )
        .sort((a, b) => {
          return (a.time + a.field).localeCompare(b.time + b.field);
        }),
    [games, selected]
  );

  const scores = useMemo(
    () =>
      Object.values(groupBy(filteredGames, "time")).map(groupedGames => (
        <Segment key={groupedGames[0].time}>
          <Card.Group>
            {groupedGames.map((game, index) => (
              <Game key={game.id} id={game.id} />
            ))}
          </Card.Group>
        </Segment>
      )),
    [filteredGames]
  );

  return useMemo(
    () => (
      <Segment basic>
        <FilterMenu
          filter={selected}
          visible={sidebar}
          onToggle={toggleSidebar}
          clearSelected={clearSelected}
        />
        <Sidebar.Pushable as={Segment}>
          <TeamList visible={sidebar} onSelect={setSelected} />

          <Sidebar.Pusher>
            <Segment.Group style={{ minHeight: 300 }}>{scores}</Segment.Group>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Segment>
    ),
    [scores, sidebar, selected, clearSelected, toggleSidebar]
  );
};
