import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { Menu } from "semantic-ui-react";
import { signIn, auth } from "../api/fire";
import Permissions from "../state/permissions";

function signOutOfApp() {
  signOut(auth);
}

const AppMenu = () => {
  const { user } = useContext(Permissions);

  return (
    <Menu>
      <Menu.Menu position="right">
        {user == null ? (
          <Menu.Item onClick={signIn}>Sign In</Menu.Item>
        ) : (
          <Menu.Item onClick={signOutOfApp}>Sign Out</Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  );
};
export default AppMenu;
