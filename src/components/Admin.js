import React from 'react';
import { Tab, Segment } from 'semantic-ui-react';

import Schedule from './Schedule';
import Teams from './Teams';

import { DIVISIONS } from '../utils/constants'

export default ({ teams, games, masterMode }) => <Segment>
  <Tab panes={[
    {
      menuItem: 'Schedule',
      render: () =>
        <Schedule games={games} teams={teams}
          editable
          masterMode={masterMode}
        />
    },
    ...DIVISIONS.map(division => ({
      menuItem: division,
      render: () => <Tab.Pane>
        <Teams
          division={division}
          editable={masterMode}
          teams={teams.filter(team => team.division === division)}
        />
      </Tab.Pane>
    }))
  ]} />
</Segment>