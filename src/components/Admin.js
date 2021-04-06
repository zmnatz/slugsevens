import React, { useContext, useEffect } from "react";

import Permissions from "../state/permissions";
import Generator from "./Generator";
import Menu from "./Menu";

const Admin = () => {
  const { master, setAdmin } = useContext(Permissions);
  useEffect((_) => setAdmin(true), [setAdmin]);

  return (
    <React.Fragment>
      <Menu />
      {master && <Generator />}
    </React.Fragment>
  );
};
export default Admin;
