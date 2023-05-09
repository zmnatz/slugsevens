import React, { useMemo, useContext } from "react";
import { Tab, Segment } from "semantic-ui-react";

import Schedule from "./Schedule";
import Teams from "./Teams";

import useQuery from "../hooks/useQuery";
import ResultContext from "../state/results";
import { groupBy } from "../utils";

const schedule = {
  menuItem: "Schedule",
  render: () => <Schedule />,
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
        ),
      })),
    [divisions, groupedTeams]
  );
  return useMemo(
    () => (
      <Segment>
        <Tab panes={[schedule, ...panes]} />
      </Segment>
    ),
    [panes]
  );
};
export default View;
