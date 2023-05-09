import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import SportIcon from '../SportIcon';

const localStorageUser = localStorage.getItem('user');

export default function GoalModal({ addGoal, setAddGoal, openAddGoal, handleCloseAddGoal, handleSubmit, formErrors, setFormErrors, isEdit, isLoading }) {
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
  const [favoriteSports, setFavoriteSports] = useState([]);

  // Success and error message
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchFavorites = async () => {
    try {
      const response = await fetch('http://localhost:3010/v0/favorites?' 
                        + new URLSearchParams({username: localStorageUser}));

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const favoriteSports = await response.json();
      setFavoriteSports(favoriteSports);
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');

      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };
  useEffect(() => {
    fetchFavorites();
  }, []);

  const types = [
    {
      value: 'race',
      label: 'Race'
    },
    {
      value: 'repeat',
      label: 'Repeat'
    },
    {
      value: 'one-time',
      label: 'Does not repeat'
    },
  ]

  return (
    <Modal open={openAddGoal} onClose={handleCloseAddGoal} >
      <Box sx={modalStyle} component='form' noValidate onSubmit={handleSubmit}>
        <Typography variant='h5' gutterBottom>{isEdit ? 'Edit goal' : 'Add a new goal'}</Typography>
        <Card sx={{mb: 1, backgroundColor: '#fafafa'}}>
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
              <Grid xs={1} sx={{mt: 2.2, ml: -3.5, mr: 0.5}}>
                <SportIcon sport={addGoal.sport} />
              </Grid>
              <Grid xs={6}>
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
              <Grid xs={2}>
                <FormControl variant='standard' error={formErrors.includes('distance')} sx={{ width: '12ch', pb: 1 }}>
                  <InputLabel>Distance</InputLabel>
                  <Input
                    label='Distance'
                    endAdornment={<InputAdornment position='end'>mi</InputAdornment> }
                    value={addGoal.distance}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'distance'));
                      setAddGoal({ ...addGoal, distance: e.target.value });
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
                  setAddGoal({ ...addGoal, type: e.target.value });
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
                <FormControl error={formErrors.includes('time')} sx={{ width: '10ch', marginRight: 15, paddingBottom: 1 }}>
                  <Input
                    endAdornment={<InputAdornment position='end'>min</InputAdornment> }
                    placeholder='60'
                    value={addGoal.time}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: e.target.value });
                    }} />
                </FormControl>
              : addGoal.type === 'repeat' ? 
                <FormControl error={formErrors.includes('time')} sx={{ width: '18ch', marginRight: 15, paddingBottom: 1 }}>
                  <Input
                    startAdornment={<InputAdornment position='start'>Every</InputAdornment> }
                    endAdornment={<InputAdornment position='end'>days</InputAdornment> }
                    placeholder='31'
                    value={addGoal.time}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: e.target.value });
                    }} />
                </FormControl>
              :
                <FormControl error={formErrors.includes('time')} sx={{ width: '18ch', marginRight: 15, paddingBottom: 1 }}>
                  <Input
                    startAdornment={<InputAdornment position='start'>Within</InputAdornment> }
                    endAdornment={<InputAdornment position='end'>days</InputAdornment> }
                    placeholder='31'
                    value={addGoal.time}
                    onChange={(e) => {
                      setFormErrors(formErrors.filter(e => e !== 'time'));
                      setAddGoal({ ...addGoal, time: e.target.value });
                    }} />
                </FormControl>
          }
          </CardContent>
          }
        </Card>
      <Button type='submit'>{isEdit ? 'Save goal' : 'Add goal'}</Button>
      </Box>
    </Modal>
  );
}
