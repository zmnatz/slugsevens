import React from "react";
import { Button } from "gestalt";
import useFirebase from "../hooks/useFirebase";

export default ({ filter, onToggle, visible, clearSelected }) => {
  const { data: team } = useFirebase(`teams/${filter}`);
  return (
    <nav>
      <Button
        basic
        color="blue"
        icon={visible ? "delete" : "bars"}
        content={visible ? "Close Filter" : "Filter Teams"}
        onClick={onToggle}
      />
      {team && team.name && (
        <Button
          basic
          color="red"
          icon="delete"
          content={team.name}
          onClick={clearSelected}
        />
      )}
    </nav>
  );
};
