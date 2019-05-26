import React, { useContext, useEffect } from 'react';
import { Tab, Segment } from 'semantic-ui-react';

import Schedule from './Schedule';
import Teams from './Teams';

import Permissions from 'state/permissions'
import { DIVISIONS } from '../utils/constants'

export default ({ teams, games }) => {
  const {setAdmin} = useContext(Permissions)

  useEffect(_ => setAdmin(true), [setAdmin]);

  return <Segment>
  <Tab panes={[
    {
      menuItem: 'Schedule',
      render: () =>
        <Schedule games={games} teams={teams}/>
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
  ]} />
</Segment>
}