import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

export default function Favorites() {
  const user = localStorage.getItem('user');
  const [addFav, setAddFav] = React.useState({username: user, sport: ''});
  const [myFavorites, setMyFavorites] = React.useState(JSON.parse(localStorage.getItem('favorites')));

  const handleSubmit = (e) => {
    e.preventDefault();
    let sport = addFav.sport;
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
        return res;
      })
      .then((res) => {
        const myFavs = [ ...myFavorites, sport];
        setMyFavorites(myFavs);
        localStorage.setItem('favorites', JSON.stringify(myFavs));
      })
      .catch((err) => {
        alert('Error adding favorite');
      });
  }

  const handleDelete = (sport) => {
    const deleteFav = {username: user, sport: sport};
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
        return res;
      })
      .then((res) => {
        const myFavs = myFavorites.filter((favSport) => favSport !== sport);
        setMyFavorites(myFavs);
        localStorage.setItem('favorites', JSON.stringify(myFavs));
      })
      .catch((err) => {
        alert('Error deleting favorite');
      });
  }

  return (
    <>
    <List sx={{ width: '100%', maxWidth: 222}}>
      {myFavorites.map((sport) => (
        <ListItem key={sport} secondaryAction={
          <IconButton edge='end' aria-label='delete' onClick={() => {handleDelete(sport)}}>
            <DeleteIcon />
          </IconButton>
        }>
          {sport}
        </ListItem>
      ))}
    </List>
    <Box component='form' noValidate onSubmit={handleSubmit}>
      <TextField name='sport' label='Sport' value={addFav.sport} required onChange={(e) => setAddFav({ ...addFav, sport: e.target.value })} />
      <Button type='submit'>Add Favorite</Button>
    </Box>
    </>
  );
}