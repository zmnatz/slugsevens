import React, { useCallback, useMemo, useState } from "react";
import { Card, Segment, Sidebar, Header } from "semantic-ui-react";

import TeamList from "./TeamList";
import FilterMenu from "./FilterMenu";
import Game from "./Game";

import { groupBy } from "../utils/";
import ResultContext from "../state/results";

export default _ => {
  const { games } = React.useContext(ResultContext);
  const [sidebar, setSidebar] = useState();
  const [selected, setSelected] = useState();

  const toggleSidebar = useCallback(() => setSidebar(prev => !prev), [
    setSidebar
  ]);

  const clearSelected = useCallback(() => setSelected(null), [setSelected]);

  const filteredGames = useMemo(
    () =>
      games.filter(
        game =>
          game != null &&
          (selected == null ||
            game.home.id === selected ||
            game.away.id === selected)
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
      Object.values(processedGroups).map(groupedGames => (
        <React.Fragment key={groupedGames[0].time}>
          <Header as="h3" dividing>
            {groupedGames[0].time.substring(0,2)}:{groupedGames[0].time.substring(2,4)}
          </Header>
          <Card.Group>
            {groupedGames.map(({id}, index) => (
              <Game key={id+index} id={id} />
            ))}
          </Card.Group>
        </React.Fragment>
      )),
    [processedGroups]
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
            <Segment basic style={{ minHeight: 300 }}>{scores}</Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Segment>
    ),
    [scores, sidebar, selected, clearSelected, toggleSidebar]
  );
};
