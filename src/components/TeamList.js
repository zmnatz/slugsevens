import React, { useMemo } from 'react';
import {Menu, Sidebar} from 'semantic-ui-react'
import useQuery from 'hooks/useQuery'

export default ({ visible, onSelect }) => {
  const teams = useQuery('teams');
  const sortedTeams = useMemo(() => {
    const sorted = [...teams];
    sorted.sort(({name = ''}, {name:other=''}) => name.localeCompare(other))
    return sorted.map(team => 
      <Menu.Item key={team.name} as='a' content={team.name}
        onClick={() => onSelect(team.id)} />
    );
  }, [teams, onSelect])

  return useMemo(() => <Sidebar as={Menu}
    visible={visible}
    animation='push'
    vertical
    inverted
  >
    <Menu.Item as='a' onClick={() => onSelect(null)}>
      All Teams
    </Menu.Item>
    {sortedTeams}
  </Sidebar>,
  [sortedTeams, visible, onSelect])
}