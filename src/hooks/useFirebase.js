import { useState, useMemo, useEffect } from "react";
import fire from "../api/fire";

const useQuery = (location, defaultValue = []) => {
  const [data, setData] = useState(defaultValue);
  const firebaseRef = useMemo(
    () => fire.database().ref(location),
    [location]
  );
  useEffect(() => {
    firebaseRef.on("value", snapshot => {
      const value = snapshot.val()
      setData(value == null ? null : {
        id: snapshot.key,
        ...value
      })
      return () => firebaseRef.off('value');
    })
  }, [firebaseRef])

  return useMemo(() => ({
    ...firebaseRef,
    set: firebaseRef.set,
    update: firebaseRef.update,
    remove: firebaseRef.remove,
    data
  }), [firebaseRef, data]);
};
export default useQuery;
