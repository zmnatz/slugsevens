import { ref } from "firebase/database";
import { db } from "api/fire";
import { useMemo } from "react";

export default function useFirebaseRef(location) {
  return useMemo(() => {
    return ref(db, location);
  }, [location]);
}
