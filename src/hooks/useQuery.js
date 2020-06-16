import { useState, useMemo, useEffect } from "react";
import fire from "../api/fire";

const useQuery = (location) => {
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
      if (snapshot.exists()) {
        const value = snapshot.val();
        setData(Object.keys(value).map(id => {
          if (typeof value[id] === 'object') {
            return {
              ...value[id],
              id
            }
          } else {
            return value[id]
          }
        }))
      } else {
        setData([])
      }
    })
    return () => firebaseRef.off('value');
  }, [firebaseRef])

  return data;
};
export default useQuery;
