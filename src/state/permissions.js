import React, {useMemo, useState} from 'react';

const PermissionContext = React.createContext({
  admin: false,
  master: false
})

const PermissionComponent = ({children}) => {
  const [admin, setAdmin] = useState(false);
  const [master, setMaster] = useState(false);

  return useMemo(() => <PermissionContext.Provider value={{admin, master, setAdmin, setMaster}}>
    {children}
  </PermissionContext.Provider>,
  [admin, master, setAdmin, setMaster, children]
  )
}

const PermissionConsumer = PermissionContext.Consumer;

export {PermissionComponent as PermissionProvider, PermissionConsumer}
export default PermissionContext;