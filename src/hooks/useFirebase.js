import { useState, useMemo } from "react";
import fire from "../api/fire";

const useFirebase = location => {
  const [data, setData] = useState([]);
  const firebaseRef = useMemo(
    () =>
      fire
        .database()
        .ref(location)
        .orderByKey(),
    [location]
  );

  firebaseRef.on("child_added", snapshot => {
    setData(prev => ({
      ...prev,
      [snapshot.key]: {
        ...prev[snapshot],
        ...snapshot.val(),
        id: snapshot.key
      }
    }));
  });

  firebaseRef.on("child_removed", snapshot =>
    setData(prev => ({
      ...prev,
      [snapshot.key]: undefined
    }))
  );

  return useMemo(
    () => ({
      data,
      addData: firebaseRef.push
    }),
    [data, firebaseRef]
  );
};
export default useFirebase;
