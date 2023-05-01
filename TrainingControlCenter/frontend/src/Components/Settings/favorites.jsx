import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Divider from '@mui/material/Divider';

export default function Favorites() {
  const user = localStorage.getItem('user');
  const [addFav, setAddFav] = React.useState({username: user, sport: ''});
  const [myFavorites, setMyFavorites] = React.useState(JSON.parse(localStorage.getItem('favorites')) || []);
  const [myShownFavorites, setMyShownFavorites] = React.useState(myFavorites);
 
  

  const handleSubmit = (e) => {
    e.preventDefault();
    let sport = addFav.sport;
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
    localStorage.setItem('favorites', JSON.stringify(myFavs));
    /*
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams(addFav), {
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
      })
      .catch((err) => {
        alert(`Error adding favorite: ${sport}`);
        const myFavs = myFavorites.filter((favSport) => favSport !== sport);
        const myShownFavs = myShownFavorites.filter((favSport) => favSport !== sport);
        setMyFavorites(myFavs);
        setMyShownFavorites(myShownFavs);
        localStorage.setItem('favorites', JSON.stringify(myFavs));
      });
    */
  }

  const handleDelete = (sport) => {
    if(!myFavorites.includes(sport)){
      return;
    }
    const deleteFav = {username: user, sport: sport};
    const myFavs = myFavorites.filter((favSport) => favSport !== sport);
    setMyFavorites(myFavs);
    localStorage.setItem('favorites', JSON.stringify(myFavs));
    /*
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams(deleteFav), {
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
      })
      .catch((err) => {
        alert(`Error deleting favorite: ${sport}`);
        const myFavs = [ ...myFavorites, sport];
        setMyFavorites(myFavs);
        localStorage.setItem('favorites', JSON.stringify(myFavs));
      });
    */
  }

  const handleReadd = (sport) => {
    if(myFavorites.includes(sport) || !myShownFavorites.includes(sport)){
      return;
    }
    const myFavs = [ ...myFavorites, sport];
    setMyFavorites(myFavs);
    localStorage.setItem('favorites', JSON.stringify(myFavs));
    /*
    fetch('http://localhost:3010/v0/favorites?' + new URLSearchParams({username: user, sport: sport}), {
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
      })
      .catch((err) => {
        alert(`Error re-adding favorite: ${sport}`);
        const myFavs = myFavorites.filter((favSport) => favSport !== sport);
        setMyFavorites(myFavs);
        localStorage.setItem('favorites', JSON.stringify(myFavs));
      });
    */
  }

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 222}}>
      {myShownFavorites.map((sport) => (
        <div key={sport}>
        <ListItem disablePadding>
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
      <TextField name='sport' label='Sport' value={addFav.sport} required onChange={(e) => setAddFav({ ...addFav, sport: e.target.value })} />
      <Button type='submit'>Add Favorite</Button>
    </Box>
    </>
  );
}