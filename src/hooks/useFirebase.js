import { useState, useMemo, useEffect } from "react";
import fire from "../api/fire";

const useQuery = location => {
  const [data, setData] = useState([]);
  const firebaseRef = useMemo(
    () =>
      fire
        .database()
        .ref(location),
    [location]
  );

  useEffect(() => {
    firebaseRef.on("value", snapshot => {
      setData({
        id: snapshot.key,
        ...snapshot.val()
      })
      return () => firebaseRef.off('value');
    })
  }, [firebaseRef])

  return useMemo(() => ({
    ...firebaseRef,
    set: firebaseRef.set,
    data
  }), [firebaseRef, data]);
};
export default useQuery;
