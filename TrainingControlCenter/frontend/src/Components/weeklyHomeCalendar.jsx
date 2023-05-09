import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  IconButton,
  Stack,
} from '@mui/material';
import {
  DirectionsBike,
  DirectionsRun,
  DownhillSkiing,
  FitnessCenter,
  GraphicEq,
  Hiking,
  Pool,
  SelfImprovement,
} from '@mui/icons-material';
import SportsIcon from '@mui/icons-material/Sports';

const username = localStorage.getItem('user');

function Item(props: BoxProps) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        display: 'inline-flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        p: 1,
        m: 1,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : 'grey.100'),
        color: (theme) => (theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800'),
        border: '1px solid',
        borderColor: (theme) =>
          theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}

export default function HomeCalendar() {
  return (
    <>
    <h2 align="right">Calendar/Week</h2>

    <div style={{ width: '100%' }}>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'inline-flex',
          flexDirection: 'row',
          p: 1,
          m: 1,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
          borderRadius: 1,
        }}
      >
        <Item sx={{ width: 75, fontSize: 20 }}><u>M</u>
        <Stack alignItems="left" direction="column" spacing={2}>
        <IconButton size="large">
          <DirectionsBike fontSize="large" color="primary" />
        </IconButton>
        </Stack>

        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>Tu</u>
        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>W</u>
        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>Th</u>
        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>F</u>
        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>Sa</u>
        </Item>
        <Item sx={{ width: 75, fontSize: 20 }}><u>Su</u>
        </Item>
      </Box>
    </div>
    </>
  );
}
