import React, {ReactDOM} from 'react';
import {Form, Segment, Container} from 'semantic-ui-react'
import {DIVISIONS} from '../utils/constants'

const divisions = DIVISIONS.map(division => ({
  value: division,
  text: division
}))

export default (props) => {
  return <Container>
    <Segment basic>
      <Segment basic>
        <p>Register your team today</p>
      </Segment>
      <Segment basic>
        <div id="registrationForm">
        </div>
        <Form method="post" name="registration">  
          <Form.Input required label="Team" name="team"/>
          <Form.Input required label="Email" name="email"/>
          <Form.Dropdown required 
            label="Division"
            name="division"
            fluid selection
            options={divisions}
            placeholder="Choose division"/
          > 
          <input type="hidden" name="form-name" value="registration"/>
          <Form.Button type="submit">Register</Form.Button>
        </Form>
      </Segment>
    </Segment>
  </Container>
}