import React, { useMemo, useCallback } from "react";

import fire from "../api/fire";
import robin from "roundrobin";
import { Button } from "gestalt";

import { groupBy } from "../utils";
import useQuery from "../hooks/useQuery";

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
    return scheduled;
  }, {});
  const schedule = [];
  let i = 0,
    gameCount;
  do {
    gameCount = schedule.length;
    Object.values(schedules).forEach(checkRound.bind(this, i, schedule));
    i++;
  } while (schedule.length > gameCount);

  return schedule.map(game => ({
    home: game[0],
    away: game[1],
    division: game[0].division
  }));
};

function generatePlayoffs(divisions) {
  const schedule = [[], []]
  const playoffs = divisions.reduce((schedule, division) => {
    schedule[0] = [...schedule[0],
    { division, color: 'green', name: 'Semifinal', home: { name: '#1 Pool A' }, away: { name: '#2 Pool B' } },
    { division, color: 'green', name: 'Semifinal', home: { name: '#1 Pool B' }, away: { name: '#1 Pool B' } },
    { division, color: 'green', name: '5th Place', home: { name: '#3 Pool A' }, away: { name: '#3 Pool B' } },
    { division, color: 'green', name: '7th Place', home: { name: '#4 Pool A' }, away: { name: '#4 Pool B' } },
    ]
    schedule[1] = [...schedule[1], { division, color: 'blue', name: 'Championship', home: { name: 'Finalist 1' }, away: { name: 'Finalist 2' } }]
    return schedule;
  }, schedule)
  return [...playoffs[0], ...playoffs[1]];
}

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
  const settings = useQuery("settings");
  const divisions = useQuery("divisions");
  const teams = useQuery('teams')

  const groupedTeams = useMemo(() => groupBy(teams, "division"), [teams]);

  const onGenerate = useCallback(() => {
    const games = [
      ...generateRound(divisions, groupedTeams),
      ...generatePlayoffs(divisions)
    ];
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
      <Button color="red" text="Generate" onClick={onGenerate} />
    ),
    [onGenerate]
  );
};
