const dbActivities = require('../db/dbActivities');
const {spawn} = require('child_process');

// General graphing function
exports.drawGraph = async (req, res) => {
  // Parameters
  let {username, duration, graphType, sport, goal, startDate, outFile} = req.body;
  
  // Format date
  startDate = new Date(startDate);

  // Set end date for DB searching
  let endDate = new Date(startDate);
  if (duration === 'Day'){
    endDate = endDate.setDate(endDate.getDate() + 14);
    endDate = new Date(endDate);
  } else if (duration === 'Week'){
    endDate = endDate.setDate(endDate.getDate() + 84);
    endDate = new Date(endDate);
  } else {
    endDate = endDate = endDate.setFullYear(endDate.getFullYear() + 1)
    endDate = new Date(endDate);
  }

  // Convert the date object to a YYYY/MM/DD format
  let formattedStartDate = startDate ? startDate.toISOString().substring(0, 10) : null;  
  let formattedEndDate = endDate ? endDate.toISOString().substring(0, 10) : null;

  // console.log(formattedStartDate)
  // console.log(formattedEndDate)

  // Database call
  const returnValue = await dbActivities.findActivity(username, null, sport, null, null, null, null, null, formattedStartDate, formattedEndDate);
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting activities from graph.js');
  } 

  // Spawn python graphing child processs
  let responseData;
  const python = await spawn('python3', ['./src/graphing/generalGraphs.py', username, duration, graphType, sport, goal, startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), JSON.stringify(returnValue), outFile]);
  
  // Stdout data
  python.stdout.on('data', (data) => {
    responseData = data.toString();
    //console.log('stdout: ' + data);
  });
  
  // Error data
  python.stderr.on('data', (data) => {
    console.log('Error: ' + data);
  });

  // Close process
  python.on('close', (code) => {
    console.log('Closing: ' + code);
    console.log(responseData)
    //res.send(responseData)
    res.status(200).json(returnValue);
  });
};