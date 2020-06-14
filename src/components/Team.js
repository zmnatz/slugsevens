import React, { useContext, useCallback } from "react";
import { Table, IconButton, Row } from "gestalt";
import fire from "../api/fire";
import Permissions from "../state/permissions";

const DeleteButton = React.memo(({ id }) => {
  const onDelete = useCallback(
    () => fire.database().ref(`teams/${id}`).remove(),
    [id]
  );
  return <IconButton iconColor="red"
    accessibilityLabel="Delete Team"
    icon="cancel" onClick={onDelete} />
})

const Team = ({ team }) => {
  const { master } = useContext(Permissions);
  return (
    <Table.Row>
      <Table.Cell width={6}>
        <Row gap={3}>
          {master && <DeleteButton id={team.id} />}
          {team.name} 
        </Row>
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
