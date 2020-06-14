import React, { useMemo, useCallback } from "react";
import { Table, Button } from "gestalt";
import useQuery from "../hooks/useQuery";
import useFirebase from "../hooks/useFirebase";

const RegistrationRow = ({ id }) => {
  const registration = useFirebase(`registration/${id}`);
  const { team, email, division } = registration.data;

  const onDelete = useCallback(() => registration.remove(), [registration]);

  return (
    <Table.Row key={id}>
      <Table.Cell>{team}</Table.Cell>
      <Table.Cell>{email}</Table.Cell>
      <Table.Cell>{division}</Table.Cell>
      <Table.Cell>
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
      </Table.Cell>
    </Table.Row>
  );
};

export default _ => {
  const teams = useQuery("registration");

  return useMemo(
    () => (
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Team</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Division</Table.HeaderCell>
            <Table.HeaderCell>Delete</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {teams
            .filter(({ deleted }) => !deleted)
            .map(({ id }) => (
              <RegistrationRow key={id} id={id} />
            ))}
        </Table.Body>
      </Table>
    ),
    [teams]
  );
};
