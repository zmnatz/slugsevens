import React, { useContext } from "react";
import { Table } from "gestalt";
import Team from "./Team";
import AddTeam from "./AddTeam";

import Permissions from "../state/permissions";
import { rankTeams, groupBy } from "../utils";

const List = ({ teams = [] }) => {
  return Object.entries(groupBy(teams, "pool")).map(entry => (
    <div key={entry[0]}>
      <h4>Pool {entry[0]}</h4>
      <Table borderSize="sm" HeaderCells="equal">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={6}>Team</Table.HeaderCell>
            <Table.HeaderCell>W</Table.HeaderCell>
            <Table.HeaderCell>L</Table.HeaderCell>
            <Table.HeaderCell>T</Table.HeaderCell>
            <Table.HeaderCell>PF</Table.HeaderCell>
            <Table.HeaderCell>PA</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {entry[1].sort(rankTeams).map(team => (
            <Team key={team.id} team={team} />
          ))}
        </Table.Body>
      </Table>
    </div>
  ));
};

export default ({ teams, division }) => {
  const { master, admin } = useContext(Permissions);
  return (
    <div>
      {!master && <h3>{division}</h3>}
      {master && admin && <AddTeam division={division} />}
      <List teams={teams} />
    </div>
  );
};
