import React, { useMemo, useCallback, useContext, useEffect } from 'react';

import fire from '../api/fire';
import robin from 'roundrobin';
import { Button } from 'semantic-ui-react'

import { groupBy } from '../utils';
import ScheduleSettings from './ScheduleSettings';
import useFirebase from '../hooks/useFirebase'
import Permissions from 'state/permissions'

const checkRound = (i, schedule, round) => {
  if (round[i]) {
    schedule.push(...round[i]);
  }
}

const generateRound = (teams) => {
  const divisions = Object.keys(teams);
  const schedules = divisions.reduce((scheduled, divisionName) => {
    const pools = groupBy(teams[divisionName], 'pool');
    Object.entries(pools).forEach(([poolName, poolTeams]) => {
      scheduled[divisionName + poolName] = robin(poolTeams.length, poolTeams);
    })
    // scheduled[divisionName] = robin(4, teams[divisionName])
    return scheduled;
  }, {})
  const schedule = [];
  let i = 0, gameCount;
  do {
    gameCount = schedule.length;
    Object.values(schedules).forEach(checkRound.bind(this, i, schedule))
    i++;
  } while (schedule.length > gameCount && i < 5);

  return schedule.map(game => ({
    home: game[0],
    away: game[1],
    division: game[0].division
  }));
}

function determineTime(round, settings) {
  const {increment, startTime} = settings;
  let numMinutes = round * increment,
    hours = Math.floor(numMinutes / 60),
    totalMinutes = startTime % 100 + numMinutes % 60;

  if (totalMinutes > 59) {
    hours += Math.floor(totalMinutes / 60);
    totalMinutes -= Math.floor(totalMinutes / 60) * 60;
  }

  return startTime + hours * 100 + (startTime % 100 + totalMinutes)
}

function setLocation (games, settings) {
  const {numFields} = settings;
  return games.map((game, index) => {
    let time = determineTime(Math.floor(index / numFields), settings);
    if (time < 1000) {
      time = '0' + time;
    } else {
      time += ''
    }
    return {
      ...game,
      field: (index % numFields) + 1,
      time
    }
  })
}

function resetSchedule (games) {
  const db = fire.database().ref('games');
  db.remove()
  .then(() => 
    games.forEach(game => db.push(game))
  );
}

export default ({teams}) => {
  const {data: settings } = useFirebase('settings');
  const {setMaster} = useContext(Permissions);

  useEffect(() => setMaster(true), [setMaster]);

  const groupedTeams = useMemo(
    () => groupBy(teams, 'division'),
    [teams]
  )

  const onGenerate = useCallback(
    () => {
      const games = [
        ...generateRound(groupedTeams)
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
    },
    [settings, groupedTeams]
  )
  return React.useMemo(() => (
    <div style={{ display: 'flex' }}>
      <ScheduleSettings style={{ flex: 1 }} />
      <Button type="primary" onClick={onGenerate}>
        Generate
      </Button>
    </div>
  ), [onGenerate])
}