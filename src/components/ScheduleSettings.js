import React, { useCallback, useMemo } from 'react';
import { Form } from 'semantic-ui-react'
import { handleFocus } from '../utils'
import useFirebase from 'hooks/useFirebase'

export default () => {
  const settings = useFirebase('settings');
  
  const onChange = useCallback((e, {name, value}) => {
      settings.set({
        ...settings.data,
        [name]: Number(value)
      })
    },
    [settings]
  )

  return useMemo(() => {
    const { numFields = 3, increment = 20, startTime=900 } = settings.data;
    return <Form>
      <Form.Group>
        <Form.Input inline name="numFields" type="number" 
          value={numFields} label="Fields"
          min={1} max={4}
          onFocus={handleFocus}
          onChange={onChange}
        />
        <Form.Input inline name="increment" type="number" 
          value={increment} label="Increment"
          step={10}
          onFocus={handleFocus}
          onChange={onChange}
        />
        <Form.Input inline type="number" name="startTime" 
          value={startTime} label="Start"
          onFocus={handleFocus}
          onChange={onChange}
        />
      </Form.Group>
    </Form>
  }, [settings, onChange])
}