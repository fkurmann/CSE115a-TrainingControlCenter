import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SportIcon from '../sportIcon';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { grey } from '@mui/material/colors';

/**
 * Displays goal card details upon clicking specific goal.
 */
export default function GoalCard({ goal, onClick }) {
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'kilometers' : 'miles';
  const name = goal.name;
  const type = goal.type;
  const sport = goal.sport;
  const distance = goal.distance;
  const time = goal.time;
  return (
    <Card sx={{bgcolor: localStorage.getItem('brightnessMode') === 'dark' ? grey[800] : grey[100] }}>
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
              <strong>{distance}</strong> {dist_unit} in <strong>{time}</strong> minutes
            </Typography>
          : type === 'repeat' ?
            <Typography variant='body2'>
              <strong>{distance}</strong> {dist_unit} every <strong>{time}</strong> days
            </Typography>
          :
            <Typography variant='body2'>
              <strong>{distance}</strong> {dist_unit} within the next <strong>{time}</strong> days
            </Typography>
        }
      </CardContent>
    </Card>
  );
}
