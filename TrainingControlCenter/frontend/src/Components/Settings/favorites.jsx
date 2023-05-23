import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Typography, Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

export default function Favorites() {
  const user = localStorage.getItem('user');
  const [addFav, setAddFav] = React.useState({username: user, sport: ''});
  const [myFavorites, setMyFavorites] = React.useState(localStorage.getItem('favorites') === null ? [] : JSON.parse(localStorage.getItem('favorites')));
  const [myShownFavorites, setMyShownFavorites] = React.useState(myFavorites);
  const [isLoading, setIsLoading] = React.useState([]);

  const getFavoriteTypes = () => {
    const favoriteTypes = [
        "Ride",
        "Run",
        "Swim",
        "Walk",
        "Weight Training",
        "Row",
        "Ski",
        "VirtualRide",
        "VirtualRun",
      ];
    return favoriteTypes;
  };

  // Updates localStorage whenever myFavorites is updated
  React.useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(myFavorites));
  }, [myFavorites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sport = addFav.sport;
    setAddFav({...addFav, sport: ''});
    if(sport === ''){
      return;
    }
    if(myFavorites.includes(sport)){
      console.log(`${sport} is already in favorites`);
      return;
    }
    else if(myShownFavorites.includes(sport)){
      handleReadd(sport);
      return;
    }
    const myFavs = [ ...myFavorites, sport];
    setMyFavorites(myFavs);
    setMyShownFavorites([ ...myShownFavorites, sport]);
    setIsLoading([ ...isLoading, sport]);
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams({username: user, sport: encodeURIComponent(sport.trim())}), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        console.log(`Added ${sport} to favorites`);
        setIsLoading(isLoading.filter(s => s !== sport));
      })
      .catch((err) => {
        alert(`Error adding favorite: ${sport}`);
      });
  }

  const handleDelete = (sport) => {
    if(!myFavorites.includes(sport)){
      return;
    }
    const myFavs = myFavorites.filter((favSport) => favSport !== sport);
    setMyFavorites(myFavs);
    setIsLoading([ ...isLoading, sport]);
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams({username: user, sport: encodeURIComponent(sport.trim())}), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        console.log(`Deleted ${sport} from favorites`);
        setIsLoading(isLoading.filter(s => s !== sport));
      })
      .catch((err) => {
        alert(`Error deleting favorite: ${sport}`);
      });
  }

  const handleReadd = (sport) => {
    if(myFavorites.includes(sport) || !myShownFavorites.includes(sport)){
      return;
    }
    const myFavs = [ ...myFavorites, sport];
    setMyFavorites(myFavs);
    setIsLoading([ ...isLoading, sport]);
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams({username: user, sport: encodeURIComponent(sport.trim())}), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw res;
        }
        console.log(`Re-added ${sport} to favorites`);
        setIsLoading(isLoading.filter(s => s !== sport));
      })
      .catch((err) => {
        alert(`Error re-adding favorite: ${sport}`);
      });
  }

  return (
    <>
    <List sx={{ width: '100%'}}>
      {myShownFavorites.map((sport) => (
        <div key={sport}>
        <ListItem disablePadding secondaryAction={isLoading.includes(sport) ? <CircularProgress size={24} /> : <></>}>
          <ListItemButton onClick={() => myFavorites.includes(sport) ? handleDelete(sport) : handleReadd(sport) }>
            <ListItemIcon>
              {myFavorites.includes(sport) ? <StarRoundedIcon /> : <StarBorderRoundedIcon />}
            </ListItemIcon>
            <ListItemText primary={sport} />
          </ListItemButton>
        </ListItem>
        <Divider/>
        </div>
      ))}
    </List>
    <Box component='form' noValidate onSubmit={handleSubmit}>

      <Typography variant="h6">New Favorite</Typography>
      <Select
        name='sport' 
        value={addFav.sport} 
        required 
        onChange={(e) => setAddFav({ ...addFav, sport: e.target.value })}
      >
        {getFavoriteTypes().map((favoriteType, index) => (
          <MenuItem key={favoriteType} value={favoriteType} id={`menu-item-${favoriteType}-${index}`}>
            {favoriteType}
          </MenuItem>
        ))}
      </Select>
      <Button type='submit'>Add Favorite</Button>
    </Box>
    </>
  );
}