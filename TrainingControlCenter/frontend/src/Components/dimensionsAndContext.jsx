import React, {useState, useEffect} from 'react';
import {styled} from '@mui/material/styles';

// Global context
export const UserContext = React.createContext();


// **Dimensions is useful when scaling for smaller screens, backlog item**
// Dimensions context and helpers
export const DimensionsContext = React.createContext();
// Dimension handling functions for mailbox display
export const winDims = () => ({
  height: window.innerHeight,
  width: window.innerWidth,
});

export const DimensionsProvider = ({children}) => {
  const [dimensions, setDimensions] = useState(winDims);
  useEffect(() => {
    const handleResize = () => {
      setDimensions(winDims);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  return (
    <DimensionsContext.Provider value={dimensions}>
      {children}
    </DimensionsContext.Provider>
  );
};
// **Dimensions is useful when scaling for smaller screens, backlog item**

export const Demo = styled('div')(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
}));
