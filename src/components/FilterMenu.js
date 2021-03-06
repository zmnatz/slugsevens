import React from "react";
import { Button } from "semantic-ui-react";
import useFirebase from "../hooks/useFirebase";
const FilterMenu = ({ filter, onToggle, visible, clearSelected }) => {
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

export default FilterMenu;
