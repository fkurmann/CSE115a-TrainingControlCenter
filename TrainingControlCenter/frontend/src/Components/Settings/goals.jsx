import * as React from 'react';
import moment from 'moment';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Box,
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SportIcon from '../sportIcon';
import GoalCard from './goalCard';
import GoalModal from './goalModal';
import { grey } from '@mui/material/colors';

/**
 * Goal component to be used when adding/removing goals.
 */
export default function Goals() {
  const user = localStorage.getItem('user');
  const emptyGoal = {username: user, name: '', type: '', sport: '', distance: '', time: ''};
  const [openSport, setOpenSport] = React.useState([]);
  const [myGoals, setMyGoals] = React.useState(localStorage.getItem('goals') ? JSON.parse(localStorage.getItem('goals')) : null);
  // const [myGoals, setMyGoals] = React.useState(null);
  const [goalsByCategory, setGoalsByCategory] = React.useState({});
  const [goalCategories, setGoalCategories] = React.useState([]);
  const [openAddGoal, setOpenAddGoal] = React.useState(false);
  const [addGoal, setAddGoal] = React.useState(emptyGoal);
  const [editedGoal, setEditedGoal] = React.useState({});
  const [anchorElGoal, setAnchorElGoal] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAddLoading, setIsAddLoading] = React.useState(false);
  const [goalToAdd, setGoalToAdd] = React.useState({});
  const [goalToDelete, setGoalToDelete] = React.useState({});
  const [formErrors, setFormErrors] = React.useState([]);
  const [selectedGoal, setSelectedGoal] = React.useState({});

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
            console.log('Loaded goals', res);
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
    if (myGoals) {
      let goals = {};
      myGoals.forEach((goal) => {
        let sport = goal.sport;
        if (!(sport in goals)) {
          goals[sport] = [];
        }
        goals[sport].push(goal);
      });

      let eq = true;
      const goals2 = goalsByCategory;
      Object.keys(goals).forEach((sport) => {
        if (!(sport in goals2)) {
          eq = false;
        }
        else {
          goals[sport].forEach((goal) => {
            if (!(goals2[sport].find(g => g.name === goal.name))) {
              eq = false;
            }
          })
        }
      })
      Object.keys(goals2).forEach((sport) => {
        if (!(sport in goals)) {
          eq = false;
        }
        else {
          goals2[sport].forEach((goal) => {
            if (!(goals[sport].find(g => g.name === goal.name))) {
              eq = false;
            }
          })
        }
      })
      if(!eq){
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
    if (!('name' in goalToAdd)) {
      return;
    }
    let goal = goalToAdd;
    setGoalToAdd({});
    if (goal.type === '') delete goal.type;
    if (goal.sport === '') delete goal.sport;
    if (goal.distance === '') delete goal.distance;
    if (goal.time === '') delete goal.time;

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
        setIsAddLoading(false);
        setOpenSport([goal.sport]);
        handleCloseAddGoal();
      })
      .catch((err) => {
        setIsAddLoading(false);
        alert(`Error adding goal ${goal.name}`);
      });
  }, [myGoals, goalToAdd, isAddLoading]);

  // Deletes goal whenever goalToDelete is set
  React.useEffect(() => {
    if (!('name' in goalToDelete)) {
      return;
    }
    const goal = goalToDelete;
    setGoalToDelete({});
    if (!myGoals.find(g => g.name === goal.name)) {
      console.log(`Not deleting goal ${goal.name}, not found`);
      return;
    }
    if (anchorElGoal !== null) setAnchorElGoal(null);
    setMyGoals(myGoals.filter((g) => g.name !== goal.name));

    fetch('http://localhost:3010/v0/goals?' + new URLSearchParams({username: user, name: encodeURIComponent(goal.name.trim())}), {
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
    let goal = addGoal;
    let validGoal = true;
    if (!('name' in goal) || goal.name === '') {
      setFormErrors([ ...formErrors, 'name']);
      validGoal = false;
    }
    if (!('type' in goal) || goal.type === '') {
      setFormErrors([ ...formErrors, 'type']);
      validGoal = false;
    }
    if (!('sport' in goal) || goal.sport === '') {
      setFormErrors([ ...formErrors, 'sport']);
      validGoal = false;
    }
    if (!('distance' in goal) || goal.distance == null || goal.distance === '' || goal.distance < 0) {
      setFormErrors([ ...formErrors, 'distance']);
      validGoal = false;
    }
    if (!('time' in goal) || goal.time == null || goal.time === '' || goal.time < 0) {
      setFormErrors([ ...formErrors, 'time']);
      validGoal = false;
    }
    if (!validGoal) {
      return;
    }
    if (JSON.stringify(goal) === JSON.stringify(editedGoal)) {
      console.log('Goal was not edited');
      handleCloseAddGoal();
      return;
    }
    if (goal.type === 'one-time') {
      // Convert date to epoch seconds
      goal.time = moment(goal.time).unix();
    }
    setAddGoal(emptyGoal);
    setIsAddLoading(true);
    if (editedGoal.username) {
      // console.log('Goal was edited, deleting old goal');
      const oldGoal = editedGoal;
      setEditedGoal({});
      setGoalToDelete(oldGoal);
      await new Promise(r => setTimeout(r, 500));
    }
    setGoalToAdd(goal);
  }

  // Called when user clicks edit option
  const handleEdit = (goal) => {
    if (!goal.type) goal.type = '';
    if (!goal.sport) goal.sport = '';
    if (!goal.distance) goal.distance = '';
    if (!goal.time) goal.time = 0;
    let g = {...goal};
    if (goal.type === 'one-time') {
      g.time = moment(goal.time, 'X').format();
    }
    setEditedGoal(g);
    setAddGoal(g);
    handleOpenAddGoal();
  }
  const handleClickSport = (sport) => {
    if (openSport.includes(sport)) {
      setOpenSport(openSport.filter((a) => a !== sport));
    }
    else {
      // setOpenSport([ ...open, sport]);
      setOpenSport([sport]);
    }
  }
  const handleOpenAddGoal = () => {
    setIsAddLoading(false);
    setOpenAddGoal(true);
  }
  const handleCloseAddGoal = () => {
    setOpenAddGoal(false);
    setEditedGoal({});
  }
  const handleOpenGoalMenu = (event, goal) => {
    setSelectedGoal(goal);
    setAnchorElGoal(event.currentTarget);
  }
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
            <SportIcon sport={sport} />
          </ListItemIcon>
          <ListItemText primary={sport} />
          {openSport.includes(sport) ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Divider variant="inset" component="li" />
        <Collapse in={openSport.includes(sport)} timeout="auto" unmountOnExit>
          <Grid container>
            {goalsByCategory[sport].map((goal) => (
              <Accordion key={goal.name} sx={{ minWidth: 350, bgcolor: localStorage.getItem('brightnessMode') === 'dark' ? grey[900] : grey[50] }}>
                <AccordionSummary expandIcon={<ExpandMore />} >
                  <Typography>{goal.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ width: '100%', flexGrow: 0 }}>
                    <GoalCard goal={goal} onClick={handleOpenGoalMenu} />
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </Grid>
          <Menu
            sx={{ mt: '45px' }}
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
            <MenuItem component='a' onClick={() => {handleCloseGoalMenu(); handleEdit(selectedGoal); }}>Edit</MenuItem>
            <MenuItem component='a' onClick={() => {handleCloseGoalMenu(); setGoalToDelete(selectedGoal); }}>Delete</MenuItem>
          </Menu>
        </Collapse>
        </Box>
      ))}
    </List>
    <Button onClick={handleOpenAddGoal}>Add Goal</Button>
    </>
    }
    <GoalModal
      addGoal={addGoal}
      setAddGoal={setAddGoal}
      openAddGoal={openAddGoal}
      handleCloseAddGoal={handleCloseAddGoal}
      handleSubmit={handleSubmit}
      formErrors={formErrors}
      setFormErrors={setFormErrors}
      isEdit={'name' in editedGoal}
      isLoading={isAddLoading} />
    </>
  );
}
