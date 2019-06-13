import React, { useCallback, useContext } from "react";
import { Form, Card, Label } from "semantic-ui-react";

import Score from "./Score";
import { handleFocus } from "../utils";
import useFirebase from "../hooks/useFirebase";
import Permissions from "../state/permissions";

export default props => {
  const game = useFirebase(`games/${props.id}`, null);
  const { master, admin } = useContext(Permissions);

  const onScoreChange = useCallback(
    (e, { name, value }) => {
      game.update({
        inProgress: true,
        complete: false,
        score: {
          ...game.data.score,
          [name]: Number(value)
        }
      });
    },
    [game]
  );

  const onScoreComplete = useCallback(() => {
    game.update({
      inProgress: false,
      complete: true
    });
  }, [game]);

  const onChange = useCallback(
    (e, { name, value }) => {
      game.update({ [name]: value });
    },
    [game]
  );

  const _fixScore = useCallback(() => {
    game.update({
      inProgress: true,
      complete: false
    });
  }, [game]);

  const onDelete = useCallback(() => {
    game.remove();
  }, [game]);

  if (game.data == null) {
    return null;
  }

  const { score } = game.data;

  return (
    <Card raised>
      <Card.Content>
        {master && !game.data.complete && !game.data.inProgress && (
          <Label
            as="a"
            color="red"
            icon="delete"
            corner="right"
            title="Delete Game"
            onClick={onDelete}
          />
        )}
        <Card.Header>
          {game.data.name && <Label color={game.data.color} ribbon>{game.data.name}</Label>}
          {game.data.division}: Field {game.data.field}
        </Card.Header>
        <Card.Description>
          {game.data.complete || !admin ? (
            <Score game={game.data} />
          ) : (
            <Form onSubmit={onScoreComplete}>
              {master && (
                <Form.Group inline unstackable widths="equal">
                  <Form.Input
                    fluid
                    type="number"
                    value={game.data.time}
                    label="Time"
                    name="time"
                    onChange={onChange}
                    onFocus={handleFocus}
                  />
                  <Form.Input
                    fluid
                    type="number"
                    value={game.data.field}
                    label="Field"
                    name="field"
                    onChange={onChange}
                    onFocus={handleFocus}
                  />
                </Form.Group>
              )}
              <Form.Group widths="equal" inline unstackable>
                <Form.Input
                  fluid
                  type="number"
                  name="away"
                  value={score.away}
                  label={game.data.away.name}
                  onChange={onScoreChange}
                  onFocus={handleFocus}
                />
                <Form.Input
                  fluid
                  type="number"
                  name="home"
                  value={score.home}
                  label={game.data.home.name}
                  onChange={onScoreChange}
                  onFocus={handleFocus}
                />
              </Form.Group>
              <Form.Input
                fluid
                value={game.data.referee}
                label="Referee"
                name="referee"
                onChange={onChange}
                onFocus={handleFocus}
              />
            </Form>
          )}
        </Card.Description>
      </Card.Content>
      {admin && game.data.complete && (
        <Card.Content extra>
          <Form.Button basic color="red" floated="right" onClick={_fixScore}>
            Fix Score
          </Form.Button>
        </Card.Content>
      )}
      {admin && game.data.inProgress && (
        <Card.Content extra>
          <Form.Button
            basic
            color="green"
            floated="right"
            onClick={onScoreComplete}
          >
            Finalize
          </Form.Button>
        </Card.Content>
      )}
    </Card>
  );
};
