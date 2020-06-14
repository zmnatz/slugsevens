import React, { useContext, useEffect } from 'react';

import Permissions from '../state/permissions'
import Menu from './Menu'

export default () => {
  const {setAdmin} = useContext(Permissions)
  useEffect(_ => setAdmin(true), [setAdmin]);

  return <React.Fragment>
    <Menu/>
  </React.Fragment>
}