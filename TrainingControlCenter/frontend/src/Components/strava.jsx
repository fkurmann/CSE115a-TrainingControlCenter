import React from 'react';
import { Link } from 'react-router-dom'


export default function StravaButton() {

  return (
    <div>
      <Link to={{ pathname: "google.com"}} target="_blank">Click to open Strava authentication (new tab)</Link>
    </div>
  );
}


