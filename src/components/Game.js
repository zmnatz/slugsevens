import React, { useCallback, useContext, useMemo } from "react";
import { Heading, TextField, Button, IconButton, Box, Row } from 'gestalt'

import Score from "./Score";
import { handleFocus } from "../utils";
import useFirebase from "../hooks/useFirebase";
import Permissions from "../state/permissions";

const FIELDS = ["Upper", "Middle", "Lower"];

const ScoreForm = ({ data, onUpdate }) => {
  const {onChange, onScoreChange, onScoreComplete} = useMemo(() => ({
    onChange: ({ event, value }) => {
      onUpdate({ [event.target.name]: value });
    },
    onScoreChange: ({ event, value }) => {
      onUpdate({
        inProgress: true,
        complete: false,
        score: {
          ...data.score,
          [event.target.name]: Number(value)
        }
      });
    },
    onScoreComplete: () => {
      onUpdate({
        inProgress: false,
        complete: true
      });
    } 
  }), [onUpdate, data.score])

  const { master } = useContext(Permissions);
  const {id, score} = data;

  return <form onSubmit={onScoreComplete}>
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
    {data.inProgress && (
      <Button
        color="blue"
        floated="right"
        onClick={onScoreComplete}
        text="Finalize"
      />
    )}
  </form>
}

export default ({ id }) => {
  const { update, remove, data } = useFirebase(`games/${id}`, null);
  const { master, admin } = useContext(Permissions);

  const handleEdit = useCallback(() => {
    update({
      inProgress: true,
      complete: false
    });
  }, [update]);

  if (data == null) {
    return null;
  }

  return (
    <Box width={235} smMarginBottom={3}>
      {data.name && (
        <Heading attached="top">
          {data.name}
        </Heading>
      )}
      <Row justifyContent="between">
        <Heading size="sm">
          {data.division}: {FIELDS[data.field - 1]} Field
        </Heading>
      </Row>
      {(!admin || !data.inProgress) && 
        <Score game={data} onEdit={handleEdit}/>
      }
      {!data.complete && admin && data.away.name !== 'Bye' && data.home.name !== 'Bye' &&
        <ScoreForm data={data} onUpdate={update}/>
      }
      {admin && <Row justifyContent="end">
        {master && !data.complete && !data.inProgress && (
          <IconButton icon="cancel" onClick={() => remove()} iconColor='red' accessibilityLabel="Delete Game" />
        )}
      </Row>}
    </Box>
  );
};
