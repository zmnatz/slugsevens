import React, { useContext } from "react";
import { Row, Heading, IconButton } from "gestalt";
import Permissions from "../state/permissions";

const TeamScore = ({ name, score = 0 }) => (
  <Row>
    <span className="score-badge">{score}</span>
    {name}
  </Row >
);

export default ({ game, onEdit }) => {
  const { admin } = useContext(Permissions);

  if (game?.home?.name === 'Bye' && game?.away?.name === 'Bye') {
    return 'Bye';
  }
  
  return (<React.Fragment>
    {
      game?.referee?.length > 0 && (
        <Heading size="sm">Official: {game.referee}</Heading>
      )
    }
    <TeamScore name={game?.away?.name} score={game?.score?.away} />
    <TeamScore name={game?.home?.name} score={game?.score?.home} />
    {admin &&
      <Row justifyContent="end">
        <IconButton icon="edit" iconColor="red" bgColor="lightGray"
          accessibilityLabel="Fix Score" text="Fix" onClick={onEdit}
        />
      </Row>
    }
  </React.Fragment>);
};
