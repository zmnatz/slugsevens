import React, {useCallback} from 'react';
import {Form, Segment, Container} from 'semantic-ui-react'
import {DIVISIONS} from '../utils/constants'

const divisions = DIVISIONS.map(division => ({
  value: division,
  text: division
}))

const Register = (props) => {
  const [form, setForm] = React.useState({})

  const onSubmit=useCallback((e) => {
    e.preventDefault();
    console.log(form)
  }, [form])
  const onChange= useCallback((e, {name, value}) => {
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }, [setForm])

  return <Container>
    <Segment basic>
      <Segment basic>
        <p>Register your team today</p>
      </Segment>
      <Segment basic>
        <div id="registrationForm">
        </div>
        <Form onSubmit={onSubmit}>  
          <Form.Input required label="Team" name="team" value={form.team} onChange={onChange}/>
          <Form.Input required label="Email" name="email" value={form.email} onChange={onChange}/>
          <Form.Dropdown required 
            label="Division"
            name="division"
            fluid selection
            onChange={onChange}
            value={form.division}
            options={divisions}
            placeholder="Choose division"/
          > 
          <Form.Button type="submit">Register</Form.Button>
        </Form>
      </Segment>
    </Segment>
  </Container>
}

export default Register;