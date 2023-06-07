import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Handles favorites page in settings.
 */
export default function Favorites() {
  const user = localStorage.getItem('user');
  const [addFav, setAddFav] = React.useState('');
  const [myFavorites, setMyFavorites] = React.useState(localStorage.getItem('favorites') === null ? [] : JSON.parse(localStorage.getItem('favorites')));
  const [myShownFavorites, setMyShownFavorites] = React.useState(myFavorites);
  const [isUpdating, setIsUpdating] = React.useState([]); // Favorite sports that are currently being updated in backend
  const [wantToAdd, setWantToAdd] = React.useState([]); // Favorite sports that are in queue to be added
  const [wantToReadd, setWantToReadd] = React.useState([]); // Favorite sports that are in queue to be re-added
  const [wantToDelete, setWantToDelete] = React.useState([]); // Favorite sports that are in queue to be deleted

  const getFavoriteTypes = () => {
    const favoriteTypes = [
        "Ride",
        "Run",
        "Swim",
        "Walk",
        "Hike",
        "Weight Training",
        "Workout",
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

  React.useEffect(() => {
    if (isUpdating.length === 0 && (wantToAdd.length > 0 || wantToReadd.length > 0 || wantToDelete.length > 0)) {
      const add_favorites = wantToAdd;
      const readd_favorites = wantToReadd;
      const delete_favorites = wantToDelete;
      setIsUpdating(add_favorites.concat(readd_favorites.concat(delete_favorites)));
      setWantToAdd([]);
      setWantToReadd([]);
      setWantToDelete([]);
      let params = {username: user};
      if (add_favorites.length > 0 || readd_favorites.length > 0) {
        params.add_favorites = encodeURIComponent(add_favorites.concat(readd_favorites));
      }
      if (delete_favorites.length > 0) {
        params.delete_favorites = encodeURIComponent(delete_favorites);
      }
      fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams(params), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw res;
          }
          if (params.add_favorites) {
            console.log(`Added ${JSON.stringify(add_favorites.concat(readd_favorites))} to favorites`);
          }
          if (params.delete_favorites) {
            console.log(`Deleted ${JSON.stringify(delete_favorites)} from favorites`);
          }
          setIsUpdating([]);
        })
        .catch((err) => {
          console.error('Error updating favorites:', err);
        });
    }
  }, [user, isUpdating, wantToAdd, wantToReadd, wantToDelete, myFavorites, myShownFavorites]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const sport = addFav;
    if (sport === '') {
      return;
    }
    if (myFavorites.includes(sport)) {
      console.log(`${sport} is already in favorites`);
    }
    else if (myShownFavorites.includes(sport)) {
      setWantToReadd([...wantToReadd, sport]);
      setMyFavorites([...myFavorites, sport]);
    }
    else {
      setWantToAdd([...wantToAdd, sport]);
      setMyFavorites([...myFavorites, sport]);
      setMyShownFavorites([...myShownFavorites, sport]);
    }
    setAddFav('');
  }

  const handleDelete = (sport) => {
    if(!myFavorites.includes(sport)){
      return;
    }
    setWantToDelete([...wantToDelete, sport]);
    setMyFavorites(myFavorites.filter((s) => s !== sport));
  }

  const handleReadd = (sport) => {
    if(myFavorites.includes(sport) || !myShownFavorites.includes(sport)){
      return;
    }
    setWantToReadd([...wantToReadd, sport]);
    setMyFavorites([...myFavorites, sport]);
  }

  return (
    <>
    <List sx={{ width: '100%'}}>
      {myShownFavorites.map((sport) => (
        <div key={sport}>
        <ListItem disablePadding secondaryAction={isUpdating.includes(sport) || wantToAdd.includes(sport) || wantToReadd.includes(sport) || wantToDelete.includes(sport) ? <CircularProgress size={24} /> : <></>}>
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

      <Select
        name='sport' 
        value={addFav} 
        required 
        onChange={(e) => setAddFav(e.target.value)}
      >
        {getFavoriteTypes().map((favoriteType) => (
          <MenuItem key={favoriteType} value={favoriteType}>
            {favoriteType}
          </MenuItem>
        ))}
      </Select>
      <Button type='submit'>Add Favorite</Button>
    </Box>
    </>
  );
}
