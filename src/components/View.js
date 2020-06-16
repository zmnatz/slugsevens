import React, { useMemo, useContext, useState, useCallback } from "react";

import Schedule from "./Schedule";
import Teams from "./Teams";

import useQuery from "../hooks/useQuery";
import ResultContext from "../state/results";
import { groupBy } from "../utils";
import Admin from "./Admin";
import { Router } from "@reach/router";
import { Tabs, Container } from "gestalt";

export default () => {
  const [active, setActive] = useState(0);
  const divisions = useQuery("divisions");
  const teams = useContext(ResultContext);
  const groupedTeams = useMemo(() => groupBy(teams, "division"), [teams]);

  const activeDivision = active > 0 && divisions[active - 1];
  const handleChange = useCallback(({ activeTabIndex }) => setActive(activeTabIndex), [])
  return <React.Fragment>
    <Router>
      <Admin path="admin/*" />
    </Router>
    <Container>
      <Tabs onChange={handleChange} activeTabIndex={active} tabs={[
        { text: 'Schedule' },
        ...divisions.map(text => ({ text }))]}
      />
      <Container>
        <span style={{display: activeDivision === false ? 'block' : 'none'}}>
          <Schedule />
        </span>
        {activeDivision !== false &&
          <Teams division={activeDivision} teams={groupedTeams[activeDivision]} />
        }
      </Container>
    </Container>
  </React.Fragment>
};
