import React, { useState, useCallback } from 'react';
import firebase from '../api/fire'
import { TextField, Row, IconButton } from 'gestalt';

const defaults = { name: '', pool: 'A' }

export default ({ division }) => {
  const [state, setState] = useState(defaults);

  const onChange = useCallback(
    ({ event: { target: { name } }, value }) => setState(prev => ({
      ...prev,
      [name]: value
    })),
    [setState]
  )

  const onSubmit = useCallback(
    () => {
      firebase.database().ref('teams')
        .push({
          ...state,
          division
        })
    },
    [division, state]
  )

  return <form onSubmit={onSubmit}>
    <Row gap={1}>
      <h3>{division}</h3>
      <IconButton accessibilityLabel="Add Team" icon="add" type="submit" />
    </Row>
    <Row gap={1}>
      <TextField label="Team" id="name" name="name" value={state.name}
        required onChange={onChange} />
      <TextField label="Pool" id="pool" name="pool" value={state.pool}
        required onChange={onChange} />
    </Row>
  </form>
}