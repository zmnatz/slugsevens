import React, { useMemo, useCallback } from "react";
import { Grid, Button } from "semantic-ui-react";
import useQuery from "../hooks/useQuery";
import useFirebase from "../hooks/useFirebase";

const RegistrationRow = ({ id }) => {
  const registration = useFirebase(`registration/${id}`);
  const { team, email, division } = registration.data;

  const onDelete = useCallback(() => registration.remove(), [registration]);

  return (
    <Grid.Row key={id}>
      <Grid.Column>{team}</Grid.Column>
      <Grid.Column>{email}</Grid.Column>
      <Grid.Column>{division}</Grid.Column>
      <Grid.Column>
        <Button color="red" onClick={onDelete}>
          Delete
        </Button>
      </Grid.Column>
    </Grid.Row>
  );
};

export default _ => {
  const teams = useQuery("registration");

  return useMemo(
    () => (
      <Grid celled columns="equal">
        <Grid.Row>
          <Grid.Column>Team</Grid.Column>
          <Grid.Column>Email</Grid.Column>
          <Grid.Column>Division</Grid.Column>
          <Grid.Column>Delete</Grid.Column>
        </Grid.Row>
        {teams
          .filter(({ deleted }) => !deleted)
          .map(({ id }) => (
            <RegistrationRow key={id} id={id} />
          ))}
      </Grid>
    ),
    [teams]
  );
};
