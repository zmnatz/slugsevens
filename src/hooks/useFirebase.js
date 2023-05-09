import { useState, useMemo, useEffect } from "react";
import { onValue } from "firebase/database";
import useFirebaseRef from "./useFirebaseRef";

const useQuery = (location, defaultValue = []) => {
  const [data, setData] = useState(defaultValue);
  const firebaseRef = useFirebaseRef(location);

  useEffect(() => {
    return onValue(firebaseRef, (snapshot) => {
      const value = snapshot.val();
      setData(
        value == null
          ? null
          : {
              id: snapshot.key,
              ...value,
            }
      );
    });
  }, [firebaseRef]);

  return useMemo(
    () => ({
      ref: firebaseRef,
      set: firebaseRef.set,
      update: firebaseRef.update,
      remove: firebaseRef.remove,
      data,
    }),
    [firebaseRef, data]
  );
};
export default useQuery;
