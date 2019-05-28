import React, { useContext, useEffect } from 'react';

import Permissions from 'state/permissions'
import Generator from './Generator';
import Menu from './Menu'
import View from './View';

export default ({ teams, games }) => {
  const {master, setAdmin} = useContext(Permissions)
  useEffect(_ => setAdmin(true), [setAdmin]);

  return <React.Fragment>
    <Menu/>
    {master && <Generator teams={teams}/>}
    <View teams={teams} games={games}/>
  </React.Fragment>
}