import React, { useContext, useEffect } from 'react';

import Permissions from '../state/permissions'
import Generator from './Generator';
import Menu from './Menu'

export default () => {
  const {master, setAdmin} = useContext(Permissions)
  useEffect(_ => setAdmin(true), [setAdmin]);

  return <React.Fragment>
    <Menu/>
    {master && <Generator />}
  </React.Fragment>
}