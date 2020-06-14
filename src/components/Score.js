import React from "react";
import { Row, Heading } from "gestalt";

const TeamScore = ({ name, score = 0 }) => (
  <Row>
    <span className="score-badge">{score}</span>
    {name}
  </Row >
);

export default ({ game }) => {
  return (<React.Fragment>
    {
      game?.referee?.length > 0 && (
        <Heading size="sm">Official: {game.referee}</Heading>
      )
    }
    <TeamScore name={game?.away?.name} score={game?.score?.away} />
    <TeamScore name={game?.home?.name} score={game?.score?.home} />
  </React.Fragment>);
};
