import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import SportsIcon from '@mui/icons-material/Sports';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function Goals() {
  const user = localStorage.getItem('user');
  const misc = 'misc';
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [openSport, setOpenSport] = React.useState([]);
  const [openGoal, setOpenGoal] = React.useState([]);
  // const [myGoals, setMyGoals] = React.useState(localStorage.getItem('goals') === null ? [] : JSON.parse(localStorage.getItem('goals')));
  const [myGoals, setMyGoals] = React.useState([]);
  const [goalsByCategory, setGoalsByCategory] = React.useState({});
  const [goalCategories, setGoalCategories] = React.useState([]);
  const [openAddGoal, setOpenAddGoal] = React.useState(false);
  const [addGoal, setAddGoal] = React.useState({username: user, name: '', type: '', sport: '', distance: '', time: ''});
  const [anchorElGoal, setAnchorElGoal] = React.useState(null);

  React.useEffect(() => {
    if(!myGoals || myGoals.length === 0){
      console.log('Loading goals');
      fetch('http://localhost:3010/v0/goals?' + new URLSearchParams({username: user}), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          return res.json();
        })
        .then((res) => {
          if(res.length > 0){
            localStorage.setItem('goals', JSON.stringify(res));
            setMyGoals(res);
          }
        })
        .catch((err) => {
          alert(`Error retrieving goals for user ${user}`);
        });
    }
  });

  React.useEffect(() => {
    console.log('useEffect() goal categories');
    if(myGoals){
      myGoals.forEach((goal) => {
        let temp = goalsByCategory;
        let sport = goal.sport ? goal.sport : misc;
        if(!(sport in temp)){
          temp[sport] = [];
          setGoalsByCategory(temp);
        }
        if(!temp[sport].find(g => g.name === goal.name)){
          temp[sport].push(goal);
          setGoalsByCategory(temp);
        }
      });
      let goalCats = Object.keys(goalsByCategory);
      if(goalCats.join(',') !== goalCategories.join(',')){
        setGoalCategories(goalCats);
      }
    }
  }, [myGoals, goalsByCategory, goalCategories]);
  
  const handleClickSport = (sport) => {
    if(openSport.includes(sport)){
      setOpenSport(openSport.filter((a) => a !== sport));
    }
    else{
      // setOpenSport([ ...open, sport]);
      setOpenSport([sport]);
    }
  }

  const handleClickGoal = (goalName) => {
    if(openGoal.includes(goalName)){
      setOpenGoal(openGoal.filter((a) => a !== goalName));
    }
    else{
      setOpenGoal([goalName]);
    }
  }

  const handleOpenAddGoal = () => setOpenAddGoal(true);
  const handleCloseAddGoal = () => setOpenAddGoal(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    let goal = addGoal;
    console.log(`Trying to add goal: ${goal}`);
    setAddGoal({username: user, name: '', type: '', sport: '', distance: '', time: ''});
    if(!goal.name || goal.name === ''){
      return;
    }
    if(goal.type === ''){
      delete goal.type;
    }
    if(goal.sport === ''){
      delete goal.sport;
    }
    if(goal.distance === ''){
      delete goal.distance;
    }
    if(goal.time === ''){
      delete goal.time;
    }
    const sport = 'sport' in goal ? goal.sport : misc;
    let temp = goalsByCategory;
    if(!(sport in temp)){
      temp[sport] = [];
      setGoalsByCategory(temp);
    }
    if(!((temp[sport].find(g => g.name === goal.name)))){
      temp[sport].push(goal);
      setGoalsByCategory(temp);
    }
    let goalCats = Object.keys(goalsByCategory);
    if(goalCats.join(',') !== goalCategories.join(',')){
      setGoalCategories(goalCats);
    }
    fetch('http://localhost:3010/v0/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        console.log(`Added ${goal.name} to goals`);
        setMyGoals([...myGoals, goal]);
        localStorage.setItem('goals', myGoals);
      })
      .catch((err) => {
        alert(`Error adding goal ${goal.name}`);
      });
  }

  // TODO: Deleting goals with names containing spaces doesn't work
  const handleDelete = (goal) => {
    handleCloseGoalMenu();
    if(!myGoals.find(g => g.name === goal.name)){
      return;
    }
    const goals = myGoals.filter((g) => g.name !== goal.name);
    setMyGoals(goals);
    localStorage.setItem('goals', JSON.stringify(goals));
    const sport = 'sport' in goal ? goal.sport : misc;
    let temp = goalsByCategory;
    temp[sport] = temp[sport].filter((g) => g.name !== goal.name);
    setGoalsByCategory(temp);
    fetch('http://localhost:3010/v0/goals?' + new URLSearchParams({username: user, name: goal.name}), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        console.log(`Deleted ${goal.name} from goals`);
      })
      .catch((err) => {
        alert(`Error deleting goal ${goal.name}. Uh-oh.`);
      });
  }

  const handleOpenGoalMenu = (event) => {
    setAnchorElGoal(event.currentTarget);
  }
  const handleCloseGoalMenu = (event) => {
    setAnchorElGoal(null);
  }

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 500}}>
      {goalCategories.map((sport) => (
        <Box key={sport}>
        <ListItemButton selected={openSport.includes(sport)} onClick={() => handleClickSport(sport)}>
          <ListItemIcon>
            { sport === 'running' ?
              <DirectionsRunIcon /> :
              sport === 'cycling' ?
              <DirectionsBikeIcon /> :
              sport === 'swimming' ?
              <PoolIcon /> :
              <SportsIcon />
            }
          </ListItemIcon>
          <ListItemText primary={sport} />
          {openSport.includes(sport) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider variant="inset" component="li" />
        <Collapse in={openSport.includes(sport)} timeout="auto" unmountOnExit>
          <Grid container xsOffset={1}>
            <List component="div" disablePadding sx={{ width: '100%'}}>
              {goalsByCategory[sport].map((goal) => (
                <Box key={goal.name}>
                  <ListItemButton selected={openGoal.includes(goal.name)} onClick={() => handleClickGoal(goal.name)}>
                    <ListItemIcon></ListItemIcon>
                    <ListItemText primary={goal.name} />
                    {openGoal.includes(goal.name) ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openGoal.includes(goal.name)} timeout="auto" unmountOnExit>
                      <Box sx={{ width: '100%', flexGrow: 0 }}>
                        <List component="div" disablePadding>
                          <ListItem secondaryAction={
                            <IconButton edge="end" aria-label="goal_settings" onClick={handleOpenGoalMenu}>
                              <MoreVertIcon />
                            </IconButton>
                          }>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText primary={goal.name} />
                            {goal.type ? <ListItemText primary={`type: ${goal.type}`} /> : <></>}
                            {goal.distance ? <ListItemText primary={`distance: ${goal.distance}`} /> : <></>}
                            {goal.time ? <ListItemText primary={`time: ${goal.time}`} /> : <></>}
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </List>
                        <Menu
                          sx={{ mt: '45px' }}
                          id={`goal-menu-${goal.name}`}
                          anchorEl={anchorElGoal}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          keepMounted
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                          open={Boolean(anchorElGoal)}
                          onClose={handleCloseGoalMenu}
                        >
                          <MenuItem component='a' onClick={handleCloseGoalMenu}>Edit</MenuItem>
                          <MenuItem component='a' onClick={() => handleDelete(goal)}>Delete</MenuItem>
                        </Menu>
                      </Box>
                  </Collapse>
                </Box>
              ))}
            </List>
          </Grid>
        </Collapse>
        </Box>
      ))}
    </List>
    <Button onClick={() => handleOpenAddGoal()}>Add Goal</Button>
    <Modal
      open={openAddGoal}
      onClose={handleCloseAddGoal}
      aria-labelledby="Add a goal"
      aria-describedby="Form to add a goal"
    >
      <Box sx={modalStyle} component='form' noValidate onSubmit={handleSubmit}>
        <TextField name='name' label='Name' value={addGoal.name} required onChange={(e) => setAddGoal({ ...addGoal, name: e.target.value })} />
        <TextField name='sport' label='Sport' value={addGoal.sport} onChange={(e) => setAddGoal({ ...addGoal, sport: e.target.value })} />
        <TextField name='type' label='Type' value={addGoal.type} onChange={(e) => setAddGoal({ ...addGoal, type: e.target.value })} />
        <TextField name='distance' label='Distance' value={addGoal.distance} onChange={(e) => setAddGoal({ ...addGoal, distance: parseInt(e.target.value) })} />
        <TextField name='time' label='Time' value={addGoal.time} onChange={(e) => setAddGoal({ ...addGoal, time: parseInt(e.target.value) })} />
        <Button type='submit'>Add Goal</Button>
      </Box>
    </Modal>
    </>
  );
}
