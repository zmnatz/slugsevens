import { useState, useEffect } from "react";
import { onValue } from "firebase/database";
import useFirebaseRef from "./useFirebaseRef";

const useQuery = (location) => {
  const queryRef = useFirebaseRef(location);
  const [data, setData] = useState([]);

  useEffect(
    () =>
      onValue(queryRef, (snapshot) => {
        if (snapshot.exists()) {
          const value = snapshot.val();
          setData(
            Object.keys(value).map((id) => {
              if (typeof value[id] === "object") {
                return {
                  ...value[id],
                  id,
                };
              } else {
                return value[id];
              }
            })
          );
        } else {
          setData([]);
        }
      }),
    [queryRef]
  );

  return data;
};
export default useQuery;
