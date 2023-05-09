import React, { useMemo, useState } from "react";
import { auth } from "../api/fire";
import useFirebaseRef from "hooks/useFirebaseRef";
import { get, set } from "firebase/database";

const PermissionContext = React.createContext({
  admin: false,
  master: false,
});

function initUser(userRef, user) {
  return set(userRef, {
    email: user.email,
    displayName: user.displayName,
    roles: {
      master: true,
    },
  });
}

const PermissionComponent = ({ children }) => {
  const [admin, setAdmin] = useState(false);
  const [master, setMaster] = useState(false);
  const [user, setUser] = useState();
  const userRef = useFirebaseRef(`users/${user?.uid}`);

  React.useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user == null) {
        setMaster(false);
      } else {
        get(userRef).then((snapshot) => {
          if (!snapshot.exists()) {
            initUser(userRef, user);
          } else if (snapshot.val().roles.master) {
            setMaster(true);
          }
        });
      }
    });
  }, [userRef]);

  return useMemo(
    () => (
      <PermissionContext.Provider value={{ user, admin, master, setAdmin }}>
        {children}
      </PermissionContext.Provider>
    ),
    [user, admin, master, setAdmin, children]
  );
};

const PermissionConsumer = PermissionContext.Consumer;

export { PermissionComponent as PermissionProvider, PermissionConsumer };
export default PermissionContext;
