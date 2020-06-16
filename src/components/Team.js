import React, { useContext, memo } from "react";
import { Table, IconButton } from "gestalt";
import fire from "../api/fire";
import Permissions from "../state/permissions";

function deleteTeam (id) {
  fire.database().ref(`teams/${id}`).remove();
}

const DeleteButton = memo(({ id }) => (
  <IconButton 
    iconColor="red"
    accessibilityLabel="Delete Team"
    icon="cancel" 
    onClick={() => deleteTeam(id)} 
  />
))

const Team = ({ team }) => {
  const { master } = useContext(Permissions);
  return (
    <Table.Row>
      {master && 
        <Table.Cell>
          <DeleteButton id={team.id} />
        </Table.Cell>
      }
      <Table.Cell width={6}>
        {team.name} 
      </Table.Cell>
      <Table.Cell>{team.wins}</Table.Cell>
      <Table.Cell>{team.losses}</Table.Cell>
      <Table.Cell>{team.ties}</Table.Cell>
      <Table.Cell>{team.pf}</Table.Cell>
      <Table.Cell>{team.pa}</Table.Cell>
    </Table.Row>
  );
};
export default Team;
