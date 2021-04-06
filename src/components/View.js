import React, { useMemo, useContext } from "react";
import { Tab, Segment } from "semantic-ui-react";

import Schedule from "./Schedule";
import Teams from "./Teams";

import useQuery from "../hooks/useQuery";
import ResultContext from "../state/results";
import { groupBy } from "../utils";
import Admin from "./Admin";
import { Router } from "@reach/router";

const schedule = {
  menuItem: "Schedule",
  render: () => <Schedule />
};

const View = () => {
  const divisions = useQuery("divisions");
  const { teams } = useContext(ResultContext);
  const groupedTeams = useMemo(() => groupBy(teams, "division"), [teams]);
  const panes = useMemo(
    () =>
      divisions.map((division) => ({
        menuItem: division,
        render: () => (
          <Tab.Pane>
            <Teams division={division} teams={groupedTeams[division]} />
          </Tab.Pane>
        )
      })),
    [divisions, groupedTeams]
  );
  return useMemo(
    () => (
      <React.Fragment>
        <Router>
          <Admin path="admin/*" />
        </Router>
        <Segment>
          <Tab panes={[schedule, ...panes]} />
        </Segment>
      </React.Fragment>
    ),
    [panes]
  );
};
export default View;
