import React, { useMemo, useCallback } from "react";

import fire from "../api/fire";
import robin from "roundrobin";
import { Button } from "semantic-ui-react";

import { groupBy } from "../utils";
import ScheduleSettings from "./ScheduleSettings";
import useFirebase from "../hooks/useFirebase";
import useQuery from "../hooks/useQuery";
import ResultContext from "../state/results";

const checkRound = (i, schedule, round) => {
  if (round[i]) {
    schedule.push(...round[i]);
  }
};

const generateRound = (divisions, teams) => {
  const schedules = divisions.reduce((scheduled, division) => {
    const pools = groupBy(teams[division], "pool");
    Object.entries(pools).forEach(([poolName, poolTeams]) => {
      scheduled[division + poolName] = robin(poolTeams.length, poolTeams);
    });
    // scheduled[divisionName] = robin(4, teams[divisionName])
    return scheduled;
  }, {});
  const schedule = [];
  let i = 0,
    gameCount;
  do {
    gameCount = schedule.length;
    Object.values(schedules).forEach(checkRound.bind(this, i, schedule));
    i++;
  } while (schedule.length > gameCount && i < 5);

  return schedule.map(game => ({
    home: game[0],
    away: game[1],
    division: game[0].division
  }));
};

function determineTime(round, settings) {
  const { increment, startTime } = settings;
  let numMinutes = round * increment,
    hours = Math.floor(numMinutes / 60),
    totalMinutes = (startTime % 100) + (numMinutes % 60);

  if (totalMinutes > 59) {
    hours += Math.floor(totalMinutes / 60);
    totalMinutes -= Math.floor(totalMinutes / 60) * 60;
  }

  return startTime + hours * 100 + ((startTime % 100) + totalMinutes);
}

function setLocation(games, settings) {
  const { numFields } = settings;
  return games.map((game, index) => {
    let time = determineTime(Math.floor(index / numFields), settings);
    if (time < 1000) {
      time = "0" + time;
    } else {
      time += "";
    }
    return {
      ...game,
      field: (index % numFields) + 1,
      time
    };
  });
}

function resetSchedule(games) {
  const db = fire.database().ref("games");
  db.remove().then(() => games.forEach(game => db.push(game)));
}

export default () => {
  const { data: settings } = useFirebase("settings");
  const divisions = useQuery("divisions");
  const { teams } = React.useContext(ResultContext);

  const groupedTeams = useMemo(() => groupBy(teams, "division"), [teams]);

  const onGenerate = useCallback(() => {
    const games = [...generateRound(divisions, groupedTeams)];
    const scheduledGames = setLocation(games, settings);
    const enrichedGames = scheduledGames.map(game => ({
      ...game,
      score: {
        home: 0,
        away: 0
      },
      complete: false
    }));
    resetSchedule(enrichedGames);
  }, [settings, groupedTeams, divisions]);
  return React.useMemo(
    () => (
      <div style={{ display: "flex" }}>
        <ScheduleSettings style={{ flex: 1 }} />
        <Button type="primary" onClick={onGenerate}>
          Generate
        </Button>
      </div>
    ),
    [onGenerate]
  );
};
