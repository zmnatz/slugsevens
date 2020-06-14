import React, { useContext } from "react";
import firebase, {auth} from "../api/fire";
import Permissions from "../state/permissions";
import { Button, Row } from "gestalt";
import Generator from "./Generator";
import ScheduleSettings from "./ScheduleSettings";

function signIn() {
  firebase.auth().signInWithPopup(auth);
}

function signOut() {
  firebase.auth().signOut();
}

export default () => {
  const { user, master } = useContext(Permissions);

  return <Row justifyContent="end">
    {master && <ScheduleSettings/>}
    {master && <Generator />}
    {user == null && <Button text="Sign In" onClick={signIn}/>}
    {user != null && <Button text="Sign Out" onClick={signOut}/>}
  </Row>
};
