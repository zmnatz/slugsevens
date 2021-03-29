import React, {useState, useCallback, useMemo} from 'react';
import {Form} from 'semantic-ui-react'
import firebase from '../api/fire'

const defaults = {name: '', pool: 'A'}

export default ({division}) => {
  const [state, setState] = useState(defaults);

  const onChange = useCallback(
    (e, {name, value}) => setState(prev => ({
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

  return useMemo(() => {
    const {name, pool} = state;
    return <Form onSubmit={onSubmit}>
      <Form.Input label="Team" name="name" 
        value={name}
        required onChange={onChange}
      />
      <Form.Input label="Pool" name="pool" 
        value={pool} 
        required onChange={onChange}
      />
      <Form.Button type='submit'>Add Team</Form.Button>
    </Form>
  }, [state, onChange, onSubmit])
}