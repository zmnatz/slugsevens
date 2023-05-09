import { useContext, useEffect } from "react";

import Permissions from "state/permissions";
import Generator from "components/Generator";
import Menu from "components/Menu";
import View from "components/View";

const Admin = () => {
  const { master, setAdmin } = useContext(Permissions);
  useEffect((_) => setAdmin(true), [setAdmin]);

  return (
    <>
      <Menu />
      {master && <Generator />}
      <View />
    </>
  );
};
export default Admin;
