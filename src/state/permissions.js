import React, {useMemo, useState} from 'react';
import fire from 'api/fire';

const PermissionContext = React.createContext({
  admin: false,
  master: false
})

const PermissionComponent = ({children}) => {
  const [admin, setAdmin] = useState(false);
  const [master, setMaster] = useState(false);
  const [user, setUser] = useState();

  React.useEffect(() => {
    fire.auth().onAuthStateChanged(user=> {
      setUser(user);
      console.log(user);
      if (user == null) {
        setMaster(false);
      } else {
        fire.database().ref(`roles/masters/${user.uid}`)
          .once('value', snapshot => setMaster(true))
      }
    })
  }, [])

  return useMemo(() => <PermissionContext.Provider value={{user, admin, master, setAdmin, setMaster}}>
    {children}
  </PermissionContext.Provider>,
  [user, admin, master, setAdmin, setMaster, children]
  )
}

const PermissionConsumer = PermissionContext.Consumer;

export {PermissionComponent as PermissionProvider, PermissionConsumer}
export default PermissionContext;