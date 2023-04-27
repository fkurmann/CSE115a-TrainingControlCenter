import React from 'react';
import { Button } from 'react-bootstrap';


export default function StravaButton() {

  return (
      <Button
        bsPrefix="token-button"
        href={`https://www.strava.com/oauth/authorize` +
        `?client_id=105448` +
        `&response_type=code` +
        `&redirect_uri=http://localhost:3000/stravaAuth` +
        `&approval_prompt=force&scope=read_all,activity:read_all,profile:read_all`}
      >
        Go to Strava's site to grant access.
      </Button>
  );
}
