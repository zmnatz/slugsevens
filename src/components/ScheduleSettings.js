import React, { useCallback, useMemo } from "react";
import { handleFocus } from "../utils";
import useFirebase from "../hooks/useFirebase";
import { SearchField, Row, Label, Text } from "gestalt";

export default () => {
  const settings = useFirebase("settings");

  const onChange = useCallback(
    (e, { name, value }) => {
      settings.update({
        [name]: Number(value)
      });
    },
    [settings]
  );

  return useMemo(() => {
    const { numFields = 3, increment = 20, startTime = 900 } = settings.data;
    return (
      <Row wrap>
        <Label htmlFor="numFields">
          <Text>Fields</Text>
        </Label>
        <SearchField
          id="numFields"
          accessibilityLabel="Fields"
          name="numFields"
          type="number"
          value={String(numFields)}
          min={1}
          max={4}
          onFocus={handleFocus}
          onChange={onChange}
        />
        <Label htmlFor="increment">
          <Text>Increment</Text>
        </Label>
        <SearchField
          id="increment"
          accessibilityLabel="Increment"
          name="increment"
          type="number"
          value={String(increment)}
          step={10}
          min={20}
          onFocus={handleFocus}
          onChange={onChange}
        />
        <Label htmlFor="startTime">
          <Text>Start</Text>
        </Label>
        <SearchField
          type="number"
          accessibilityLabel="Start"
          id="startTime"
          name="startTime"
          value={String(startTime)}
          onFocus={handleFocus}
          onChange={onChange}
        />
      </Row>
    );
  }, [settings, onChange]);
};
