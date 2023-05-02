import React, { useState } from 'react';

const username = localStorage.getItem('user');

export default function AddWorkoutForm() {
  const [{ name, type, sport, distance, time}, setState] = useState({
    name: '',
    type: '',
    sport: '',
    distance: '',
    time: ''
  });

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3010/v0/activities?' , {
        method: "POST",
        body: JSON.stringify({
          username: username,
          name: name,
          sport: sport,
          distance: distance,
          time: time,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      if (response.status === 200) {
        setShowSuccessMessage(true);
        setState({ name: "", type: "", sport: "", distance: "", time: "" });
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 10000);        
      } else {
        const data = await response.json();
        setErrorMessage(data.message);
        setTimeout(() => {
          setErrorMessage('');
        }, 10000);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('An error occurred. Please try again.');
  
      setTimeout(() => {
        setErrorMessage('');
      }, 10000);
    }
  };
  
  


  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        value={name}
        onChange={(e) => setState(prevState => ({...prevState, name: e.target.value}))}
        required
      />
      <label htmlFor="type">Type</label>
      <input
        id="type"
        value={type}
        onChange={(e) => setState(prevState => ({...prevState, type: e.target.value}))}
      />
      <label htmlFor="sport">Sport</label>
      <input
        id="sport"
        value={sport}
        onChange={(e) => setState(prevState => ({...prevState, sport: e.target.value}))}
      />
      <label htmlFor="distance" style={{ marginBottom: 8 }}>Distance (mile)</label>
      <input
        id="distance"
        value={distance}
        onChange={(e) => setState(prevState => ({...prevState, distance: e.target.value}))}
        type="number"
        style={{ marginBottom: 16 }}
      />
      <label htmlFor="time" style={{ marginBottom: 8 }}>Time (min)</label>
      <input
        id="time"
        value={time}
        onChange={(e) => setState(prevState => ({...prevState, time: e.target.value}))}
        type="number"
        style={{ marginBottom: 16 }}
      />
      <button type="submit">Add Workout</button>
      {showSuccessMessage && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'green',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
            zIndex: 9999
          }}
        >
          Workout added successfully!
        </div>
      )}
      {errorMessage && (
        <div
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'red',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            boxShadow: '2px 2px 2px rgba(0, 0, 0, 0.25)',
            zIndex: 9999
          }}
        >
          {errorMessage}
        </div>                  
      )}
    </form>
  );
}
