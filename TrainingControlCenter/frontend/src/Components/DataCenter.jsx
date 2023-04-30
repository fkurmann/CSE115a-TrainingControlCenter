import React from 'react';

import ResponsiveAppBar from './appBar';

export default function DataCenter() {
  return (
    <>
      <ResponsiveAppBar>
      </ResponsiveAppBar>
    <h1>Training Control Center, {localStorage.getItem('user')}: Data Center</h1>
    </>
  );
}
