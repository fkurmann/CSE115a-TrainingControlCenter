import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Modal,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';

import { grey } from '@mui/material/colors';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import EventIcon from '@mui/icons-material/Event';
import SportIcon from '../sportIcon';

const localStorageUser = localStorage.getItem('user');

/**
 * Goal Model component to help save goals.
 */
export default function GoalModal({ addGoal, setAddGoal, openAddGoal, handleCloseAddGoal, handleSubmit, formErrors, setFormErrors, isEdit, isLoading }) {
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'km' : 'mi';
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 420,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // Get user favorite sport types
  const [favoriteSports] = React.useState(localStorage.getItem('favorites') === null ? [] : JSON.parse(localStorage.getItem('favorites')));

  const types = [
    {
      value: 'race',
      label: 'Race',
    },
    {
      value: 'repeat',
      label: 'Repeating',
    },
    {
      value: 'one-time',
      label: 'By a deadline',
    },
  ]

  return (
    <Modal open={openAddGoal} onClose={handleCloseAddGoal} >
      <Box sx={modalStyle} component='form' noValidate onSubmit={handleSubmit}>
        <Typography variant='h5' gutterBottom>{isEdit ? 'Edit goal' : 'Add a new goal'}</Typography>
        <Card sx={{mb: 1, height: isLoading ? null : 270, bgcolor: localStorage.getItem('brightnessMode') === 'dark' ? grey[900] : grey[50]}}>
          {isLoading ? <CardContent sx={{m: 0.5}}><CircularProgress /></CardContent> :
          <CardContent sx={{ml: 2.5}}>
            <FormControl variant='standard' error={formErrors.includes('name')} sx={{ width: '30ch', paddingBottom: 2 }}>
              <InputLabel>Name</InputLabel>
              <Input
                value={addGoal.name}
                onChange={(e) => {
                  setFormErrors(formErrors.filter(e => e !== 'name'));
                  setAddGoal({ ...addGoal, name: e.target.value });
                }} />
            </FormControl>
            <Grid container>
              <Grid item xs={1} sx={{mt: 2.2, ml: -3.5, mr: 0.5}}>
                <SportIcon sport={addGoal.sport} />
              </Grid>
              <Grid item xs={6}>
                <FormControl variant='standard' error={formErrors.includes('sport')} sx={{ width: '15ch', pb: 1 }}>
                  <InputLabel>Sport</InputLabel>
                  <Select
                    variant='standard'
                    value={addGoal.sport}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'sport'));
                      setAddGoal({ ...addGoal, sport: e.target.value });
                    }}>
                      {favoriteSports.map((sportType, index) => (
                        <MenuItem key={sportType} value={sportType} id={`menu-item-${sportType}-${index}`}>
                          {sportType}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2}>
                <FormControl variant='standard' error={formErrors.includes('distance')} sx={{ width: '12ch', pb: 1 }}>
                  <InputLabel>Distance</InputLabel>
                  <Input
                    label='Distance'
                    endAdornment={<InputAdornment position='end'>{dist_unit}</InputAdornment> }
                    type='number'
                    step='any'
                    value={addGoal.distance}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'distance'));
                      let d = Math.max(0, Number.parseFloat(e.target.value).toFixed(2));
                      if(isNaN(d)) d = '';
                      setAddGoal({ ...addGoal, distance: d });
                    }} />
                </FormControl>
              </Grid>
            </Grid>
            <FormControl variant='standard' error={formErrors.includes('type')} sx={{ width: '16ch', mr: 20, pb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                label='Type'
                variant='standard'
                value={addGoal.type}
                onChange={(e) => {
                  setFormErrors(formErrors.filter(e => e !== 'type'));
                  if (e.target.value === 'one-time') {
                    setAddGoal({ ...addGoal, time: moment().toISOString(), type: e.target.value });
                  }
                  else {
                    setAddGoal({ ...addGoal, time: '', type: e.target.value });
                  }
                }}>
                  {types.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            {
              addGoal.type === 'race' ?
                <Stack direction='row'>
                <FormControl sx={{width: 80, mr: 2}} error={formErrors.includes('time')}>
                  <Input
                    endAdornment={<InputAdornment position='end'>hr</InputAdornment> }
                    type='number'
                    placeholder='2'
                    value={Math.floor(addGoal.time / 3600)}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: Math.max(addGoal.time % 3600, 3600 * e.target.value + (addGoal.time % 3600)) });
                    }} />
                </FormControl>
                <FormControl sx={{width: 80, mr: 2}} error={formErrors.includes('time')}>
                  <Input
                    endAdornment={<InputAdornment position='end'>min</InputAdornment> }
                    type='number'
                    placeholder='40'
                    value={Math.floor(addGoal.time % 3600 / 60)}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: Math.max(addGoal.time - (addGoal.time % 3600) + (addGoal.time % 60) + 60 * Math.max(0, e.target.value)) });
                    }} />
                </FormControl>
                <FormControl sx={{width: 80}} error={formErrors.includes('time')}>
                  <Input
                    endAdornment={<InputAdornment position='end'>sec</InputAdornment> }
                    type='number'
                    placeholder='0'
                    value={addGoal.time % 60}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: addGoal.time - (addGoal.time % 60) + Math.max(0, e.target.value) });
                    }} />
                </FormControl>
                </Stack>
              : addGoal.type === 'repeat' ?
                <FormControl error={formErrors.includes('time')} sx={{ width: '18ch', marginRight: 15, paddingBottom: 1 }}>
                  <Input
                    startAdornment={<InputAdornment position='start'>Every</InputAdornment> }
                    endAdornment={<InputAdornment position='end'>days</InputAdornment> }
                    type='number'
                    placeholder='31'
                    value={addGoal.time}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      let d = e.target.value ? Math.floor(e.target.value) : '';
                      setAddGoal({ ...addGoal, time: d });
                    }} />
                </FormControl>
              : addGoal.type === 'one-time' ?
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    inputFormat='YYYY-MM-DD'
                    disablePast
                    value={addGoal.time}
                    onChange={(value) =>
                      setAddGoal((prevState) => ({
                        ...prevState,
                        time: value ? value.toISOString() : null,
                      }))
                    }
                    renderInput={(params) => <TextField {...params}
                      readOnly
                      error={formErrors.includes('time')}
                      placeholder='Deadline'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              <EventIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />}
                  />
                </LocalizationProvider>
                :
                <></>
          }
          </CardContent>
          }
        </Card>
      <Button type='submit'>{isEdit ? 'Save goal' : 'Add goal'}</Button>
      </Box>
    </Modal>
  );
}
