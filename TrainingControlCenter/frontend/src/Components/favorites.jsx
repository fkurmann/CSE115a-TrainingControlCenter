import React from 'react';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';

export default function Favorites() {
  return (
    <List>
        {localStorage.getItem('favorites').split(',').map((sport) => (
            <ListItemText key={sport}>{sport}</ListItemText>
        ))}
    </List>
  );
}