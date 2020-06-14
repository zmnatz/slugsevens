import React, { useCallback, useContext } from "react";
import { Heading, Table, TextField, Button, IconButton, Text } from 'gestalt'

import Score from "./Score";
import { handleFocus } from "../utils";
import useFirebase from "../hooks/useFirebase";
import Permissions from "../state/permissions";

const FIELDS = ["Upper", "Middle", "Lower"];

export default ({ id }) => {
  const { update, remove, data } = useFirebase(`games/${id}`, null);
  const { master, admin } = useContext(Permissions);

  const onScoreChange = useCallback(
    ({ event, value }) => {
      update({
        inProgress: true,
        complete: false,
        score: {
          ...data.score,
          [event.target.name]: Number(value)
        }
      });
    },
    [data, update]
  );

  const onScoreComplete = useCallback(() => {
    update({
      inProgress: false,
      complete: true
    });
  }, [update]);

  const onChange = useCallback(
    ({ event, value }) => {
      update({ [event.target.name]: value });
    },
    [update]
  );

  const _fixScore = useCallback(() => {
    update({
      inProgress: true,
      complete: false
    });
  }, [update]);

  if (data == null) {
    return null;
  }

  const { score } = data;

  return (
    <Table.Cell>
      {data.name && (
        <Heading attached="top">
          {data.name}
        </Heading>
      )}
      {master && admin && !data.complete && !data.inProgress && (
        <IconButton icon="cancel" onClick={() => remove()} iconColor='red' accessibilityLabel="Delete Game" />
      )}
      <Heading size="sm">
        {data.division}: {FIELDS[data.field - 1]} Field
      </Heading>
      {data.away.name === 'Bye' && data.home.name === 'Bye' && <Text>Bye</Text>}
      {(data.complete || !admin) && data.away.name !== 'Bye' && data.home.name !== 'Bye' &&
        <Score game={data} />
      }
      {!data.complete && admin && data.away.name !== 'Bye' && data.home.name !== 'Bye' &&
        <form onSubmit={onScoreComplete}>
          {master && <TextField
            type="number"
            value={String(data.time)}
            label="Time"
            name="time"
            id={`${id}time`}
            onChange={onChange}
            onFocus={handleFocus}
          />}
          {master &&
            <TextField
              type="number"
              value={String(data.field)}
              label="Field"
              name="field"
              id={`${id}field`}
              onChange={onChange}
              onFocus={handleFocus}
            />}
          <TextField
            id={`${id}away`}
            type="number"
            name="away"
            value={String(score.away)}
            label={data.away.name}
            onChange={onScoreChange}
            onFocus={handleFocus}
          />
          <TextField
            fluid
            type="number"
            name="home"
            id={`${id}home`}
            value={String(score.home)}
            label={data.home.name}
            onChange={onScoreChange}
            onFocus={handleFocus}
          />
          <TextField
            id={`${id}referee`}
            value={data.referee}
            label="Referee"
            name="referee"
            onChange={onChange}
            onFocus={handleFocus}
          />
        </form>
      }
      {admin && data.complete && (
        <Button color="red" floated="right" onClick={_fixScore} text="Fix Score" />
      )}
      {admin && data.inProgress && (
        <Button
          color="blue"
          floated="right"
          onClick={onScoreComplete}
          text="Finalize"
        />
      )}
    </Table.Cell>
  );
};
