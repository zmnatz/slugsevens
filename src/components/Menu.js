import React, { useContext } from "react";
import { Menu } from "semantic-ui-react";
import firebase, { auth } from "../api/fire";
import Permissions from "../state/permissions";

function signIn() {
  firebase.auth().signInWithPopup(auth);
}

function signOut() {
  firebase.auth().signOut();
}

const AppMenu = () => {
  const { user } = useContext(Permissions);

  return (
    <Menu>
      <Menu.Menu position="right">
        {user == null ? (
          <Menu.Item onClick={signIn}>Sign In</Menu.Item>
        ) : (
          <Menu.Item onClick={signOut}>Sign Out</Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};
export default AppMenu;
