import React from "react";
import { Tab, Segment } from "semantic-ui-react";

import Schedule from "./Schedule";
import Teams from "./Teams";

import useQuery from "../hooks/useQuery";

export default ({ teams, games }) => {
  const divisions = useQuery("divisions");
  return (
    <Segment>
      <Tab
        panes={[
          {
            menuItem: "Schedule",
            render: () => <Schedule games={games} teams={teams} />
          },
          ...divisions.map(division => ({
            menuItem: division,
            render: () => (
              <Tab.Pane>
                <Teams
                  division={division}
                  teams={teams.filter(team => team.division === division)}
                />
              </Tab.Pane>
            )
          }))
        ]}
      />
    </Segment>
  );
};
