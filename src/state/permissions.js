import React, {useMemo, useState} from 'react';
import fire from 'api/fire';

const PermissionContext = React.createContext({
  admin: false,
  master: false
})

function initUser(userRef, user) {
  return userRef.set({
    email: user.email,
    displayName: user.displayName,
    roles: {
      master: true
    }
  });
}

const PermissionComponent = ({children}) => {
  const [admin, setAdmin] = useState(false);
  const [master, setMaster] = useState(false);
  const [user, setUser] = useState();

  React.useEffect(() => {
    fire.auth().onAuthStateChanged(user=> {
      setUser(user);
      if (user == null) {
        setMaster(false);
      } else {
        const userRef = fire.database().ref(`users/${user.uid}`)
        userRef.once('value', snapshot=> {
          if (!snapshot.exists()) {
            initUser(userRef, user);
          } else if (snapshot.val().roles.master) {
            setMaster(true);
          }
        })
      }
    })
  }, [])

  return useMemo(() => <PermissionContext.Provider value={{user, admin, master, setAdmin}}>
    {children}
  </PermissionContext.Provider>,
  [user, admin, master, setAdmin, children]
  )
}

const PermissionConsumer = PermissionContext.Consumer;

export {PermissionComponent as PermissionProvider, PermissionConsumer}
export default PermissionContext;