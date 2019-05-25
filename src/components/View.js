import React from 'react';
import {Tab, Segment} from 'semantic-ui-react';

import Schedule from './Schedule';
import Teams from './Teams';

import {DIVISIONS} from '../utils/constants'

export default ({teams, games}) => <Segment>
  <Tab panes={[
    {
      menuItem: 'Schedule',
      render: () => 
        <Schedule readOnly games={games} teams={teams} />
    },
    ...DIVISIONS.map(division => ({
      menuItem: division,
      render: () => <Tab.Pane>
        <Teams
          division={division} 
          teams={teams.filter(team => team.division === division)}
        />
      </Tab.Pane>
    }))
  ]}/>
</Segment>