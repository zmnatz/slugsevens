import React from "react";
import { Label, List } from "semantic-ui-react";

const Score = ({ score }) => (
  <List.Icon>
    <Label size="large" style={{ width: 40 }}>
      {score || 0}
    </Label>
  </List.Icon>
);

export default ({ game }) => {
  const { score = {} } = game;

  return (
    <List verticalAlign="middle">
      {game.referee && game.referee.length > 0 && (
        <h4>Official: {game.referee}</h4>
      )}
      <List.Item
        icon={<Score score={score.away || 0} />}
        content={game.away.name}
      />
      <List.Item
        icon={<Score score={score.home || 0} />}
        content={game.home.name}
      />
    </List>
  );
};
