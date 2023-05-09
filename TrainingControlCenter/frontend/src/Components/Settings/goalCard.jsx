import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import SportIcon from '../SportIcon';

import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function GoalCard({ goal, onClick }) {
  const name = goal.name;
  const type = goal.type;
  const sport = goal.sport;
  const distance = goal.distance;
  const time = goal.time;
  return (
    <Card sx={{backgroundColor: '#f9f9f9'}}>
      <CardHeader
        action={
          <IconButton onClick={(e) => {onClick(e, goal)}}>
            <MoreVertIcon />
          </IconButton>
        }
        title={name}
        subheader={type === 'race' ? 'Racing Goal' : type === 'one-time' ? 'Training Goal' : 'Distance Goal' }
      />
      <CardContent>
        <Typography sx={{ mb: 1.5, mt: -2 }}>
          <SportIcon sport={sport}/> {sport}
        </Typography>
        {
          type === 'race' ?
            <Typography variant='body2'>
              <strong>{distance}</strong> miles in <strong>{time}</strong> minutes
            </Typography>
          : type === 'repeat' ?
            <Typography variant='body2'>
              <strong>{distance}</strong> miles every <strong>{time}</strong> days
            </Typography>
          :
            <Typography variant='body2'>
              <strong>{distance}</strong> miles within the next <strong>{time}</strong> days
            </Typography>
        }
      </CardContent>
    </Card>
  );
}
