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
import CircularProgress from '@mui/material/CircularProgress';

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
  const [myGoals, setMyGoals] = React.useState(localStorage.getItem('goals') === null ? null : JSON.parse(localStorage.getItem('goals')));
  // const [myGoals, setMyGoals] = React.useState(null);
  const [goalsByCategory, setGoalsByCategory] = React.useState({});
  const [goalCategories, setGoalCategories] = React.useState([]);
  const [openAddGoal, setOpenAddGoal] = React.useState(false);
  const [addGoal, setAddGoal] = React.useState({username: user, name: '', type: '', sport: '', distance: '', time: ''});
  const [editedGoal, setEditedGoal] = React.useState({});
  const [anchorElGoal, setAnchorElGoal] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [goalToAdd, setGoalToAdd] = React.useState({});
  const [goalToDelete, setGoalToDelete] = React.useState({});

  // Initializes myGoals
  React.useEffect(() => {
    if(!myGoals){
      console.log('Loading goals');
      setIsLoading(true);
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
          if(res){
            console.log('Loaded goals');
            localStorage.setItem('goals', JSON.stringify(res));
            setMyGoals(res);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          alert(`Error retrieving goals for user ${user}`);
        });
    }
    else{
      setIsLoading(false);
    }
  }, [user, myGoals, isLoading]);

  // Updates localStorage whenever myGoals is updated
  React.useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(myGoals));
  }, [myGoals]);

  // Updates goalsByCategory and goalCategories whenever myGoals is updated
  React.useEffect(() => {
    console.log('useEffect() goals');
    if(myGoals){
      let goals = {};
      myGoals.forEach((goal) => {
        let sport = goal.sport ? goal.sport : misc;
        if(!(sport in goals)){
          goals[sport] = [];
        }
        goals[sport].push(goal);
      });

      let eq = true;
      const goals2 = goalsByCategory;
      Object.keys(goals).forEach((sport) => {
        if (!(sport in goals2)){
          eq = false;
        }
        else{
          goals[sport].forEach((goal) => {
            if(!(goals2[sport].find(g => g.name === goal.name))){
              eq = false;
            }
          })
        }
      })
      Object.keys(goals2).forEach((sport) => {
        if (!(sport in goals)){
          eq = false;
        }
        else{
          goals2[sport].forEach((goal) => {
            if(!(goals[sport].find(g => g.name === goal.name))){
              eq = false;
            }
          })
        }
      })
      
      if(!eq){
        console.log('not equal!');
        console.log(goals);
        setGoalsByCategory(goals);
      }
      const goalCats = Object.keys(goals);
      if(JSON.stringify(goalCats) !== JSON.stringify(goalCategories)){
        setGoalCategories(goalCats);
      }
    }
  }, [myGoals, goalsByCategory, goalCategories]);
  
  // Adds goal whenever goalToAdd is set
  React.useEffect(() => {
    if(!('name' in goalToAdd)){
      return;
    }
    let goal = goalToAdd;
    setGoalToAdd({});
    console.log(`Trying to add goal: ${goal.name}`);
    if(goal.type === '') delete goal.type;
    if(goal.sport === '') delete goal.sport;
    if(goal.distance === '') delete goal.distance;
    if(goal.time === '') delete goal.time;
    setMyGoals([...myGoals, goal]);

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
      })
      .catch((err) => {
        alert(`Error adding goal ${goal.name}`);
      });
  }, [myGoals, goalToAdd]);

  // Deletes goal whenever goalToDelete is set
  React.useEffect(() => {
    if('name' in goalToAdd){
      console.log(`Can't delete rn, currently adding a goal`);
      return;
    }
    if(!('name' in goalToDelete)){
      return;
    }
    const goal = goalToDelete;
    setGoalToDelete({});
    if(!myGoals.find(g => g.name === goal.name)){
      console.log(`Not deleting goal ${goal.name}, not found`);
      return;
    }
    if(anchorElGoal !== null) setAnchorElGoal(null);
    setMyGoals(myGoals.filter((g) => g.name !== goal.name));

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

  }, [user, myGoals, goalToDelete, goalToAdd, anchorElGoal]);
  
  // Called when user submits the modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    const goal = addGoal;
    if(!goal.name || goal.name === ''){
      return;
    }
    if(JSON.stringify(goal) === JSON.stringify(editedGoal)){
      console.log('Goal was not edited');
      return;
    }
    else if(editedGoal.username){
      console.log('Goal was edited, deleting old goal');
      const oldGoal = editedGoal;
      setEditedGoal({});
      setGoalToDelete(oldGoal);
      await new Promise(r => setTimeout(r, 3000));
    }
    setGoalToAdd(goal);
  }

  // Called when user clicks edit option
  const handleEdit = (goal) => {
    if(!goal.type) goal.type = '';
    if(!goal.sport) goal.sport = '';
    if(!goal.distance) goal.distance = '';
    if(!goal.time) goal.time = '';
    setEditedGoal(goal);
    setAddGoal(goal);
    handleOpenAddGoal();
  }
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
  const handleCloseAddGoal = () => {
    setOpenAddGoal(false);
    setEditedGoal({});
  }
  const handleOpenGoalMenu = (event) => setAnchorElGoal(event.currentTarget);
  const handleCloseGoalMenu = () => setAnchorElGoal(null);

  return (
    <>
    {
    isLoading ?
    <CircularProgress /> :
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
                          <MenuItem component='a' onClick={() => handleEdit(goal)}>Edit</MenuItem>
                          <MenuItem component='a' onClick={() => setGoalToDelete(goal)}>Delete</MenuItem>
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
    </>
    }
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
