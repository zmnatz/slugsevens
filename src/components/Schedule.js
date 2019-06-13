import React, { useCallback, useMemo, useState } from "react";
import { Card, Segment, Sidebar, Header, Button } from "semantic-ui-react";

import TeamList from "./TeamList";
import FilterMenu from "./FilterMenu";
import Game from "./Game";

import { groupBy } from "../utils/";
import ResultContext from "../state/results";
import useQuery from "hooks/useQuery";

export default _ => {
  const { games } = React.useContext(ResultContext);
  const [sidebar, setSidebar] = useState();
  const [selected, setSelected] = useState();
  const divisions = useQuery('divisions')

  const toggleSidebar = useCallback(() => setSidebar(prev => !prev), [
    setSidebar
  ]);

  const clearSelected = useCallback(() => setSelected(null), [setSelected]);

  const filteredGames = useMemo(
    () =>
      games.filter(
        game =>
          game != null &&
          (selected == null || game.division === selected)
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
        groupedGames.sort((a,b) => a.field - b.field)
        return <React.Fragment key={groupedGames[0].time}>
          <Header as="h3" dividing>
            {groupedGames[0].time.substring(0,2)}:{groupedGames[0].time.substring(2,4)}
          </Header>
          <Card.Group>
            {groupedGames.map(({id}, index) => (
              <Game key={id+index} id={id} />
            ))}
          </Card.Group>
        </React.Fragment>
      }),
    [processedGroups]
  );

  return useMemo(
    () => <React.Fragment>
      <Segment basic>
        {divisions.map(division => <Button 
          key={division}
          positive={selected === division} 
          onClick={()=>setSelected(division)}
          >
            {division}
          </Button>
        )}
      </Segment>
      <Segment basic style={{ minHeight: 300 }}>{scores}</Segment>
    </React.Fragment>,
    [scores, sidebar, selected, clearSelected, toggleSidebar]
  );
};
