import React from 'react';
import {Button} from 'semantic-ui-react'
import useFirebase from 'hooks/useFirebase'

export default ({ filter, onToggle, visible, clearSelected }) => {
  const {data: team} = useFirebase(`teams/${filter}`)
  const {name} = team;
  return <nav>
    <Button basic color="blue"
      icon={visible ? "delete" : "bars"}
      content={visible ? "Close Filter" : "Filter Teams"}
      onClick={onToggle}
    />
    {name &&
      <Button basic color="red" icon="delete" content={name}
        onClick={clearSelected} />
    }
  </nav>
}