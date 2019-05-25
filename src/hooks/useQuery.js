import { useState, useMemo, useEffect } from "react";
import fire from "../api/fire";

const useQuery = location => {
  const [data, setData] = useState([]);
  const firebaseRef = useMemo(
    () =>
      fire
        .database()
        .ref(location)
        .orderByKey(),
    [location]
  );

  useEffect(() => {
    firebaseRef.on("value", snapshot => {
      const value = snapshot.val();
      if (value != null) {
        setData(Object.keys(value).map(id => ({
          ...value[id],
          id
        })))
      } else {
        setData([])
      }
    })
    return () => firebaseRef.off('value');
  }, [firebaseRef])

  return data;
};
export default useQuery;
