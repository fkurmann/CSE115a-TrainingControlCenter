const dbActivities = require('../db/dbActivities');
const dbPlans = require('../db/dbPlans');

const { spawn } = require('child_process');

/**
 * General graphing function
 *
 * @async
 */
exports.drawGraph = async (req, res) => {
  // Parameters
  let {username, duration, graphType, sport, goal, startDate, outFile} = req.body;

  // Format date
  startDate = new Date(startDate);

  // Set end date for DB searching
  let endDate = new Date(startDate);
  if (duration === 'Day') {
    endDate = endDate.setDate(endDate.getDate() + 14);
    endDate = new Date(endDate);
  } else if (duration === 'Week') {
    endDate = endDate.setDate(endDate.getDate() + 84);
    endDate = new Date(endDate);
  } else {
    endDate = endDate = endDate.setFullYear(endDate.getFullYear() + 1)
    endDate = new Date(endDate);
  }

  // Convert the date object to a YYYY/MM/DD format
  let formattedStartDate = startDate ? startDate.toISOString().substring(0, 10) : undefined;
  let formattedEndDate = endDate ? endDate.toISOString().substring(0, 10) : undefined;

  let pieGraph = false;
  let planPieGraph = false;
  if (sport == "Pie") {
    pieGraph = true;
  }
  if (sport == "PlanPie") {
    planPieGraph = true;
  }
  if (sport == "Pie" || sport == "PlanPie"|| sport == "All Sports"){
    sport = undefined;
  }

  // Database call
  let returnValue;
  if (planPieGraph == true) {
    returnValue = await dbPlans.findPlannedActivity(username, undefined, sport, undefined, undefined, undefined, undefined, undefined, formattedStartDate, formattedEndDate);
  } else {
    returnValue = await dbActivities.findActivity(username, undefined, sport, undefined, undefined, undefined, undefined, undefined, formattedStartDate, formattedEndDate);
  }
  // Error case
  if (returnValue === -1) {
    res.status(401).send('Error getting activities from graph.js');
  }

  // Spawn python graphing child processs
  let responseData;

  // Pie chart
  if (pieGraph == true || planPieGraph == true) {
    const python = await spawn('python3', ['./src/graphing/pieGraphs.py', username, duration, graphType,
    startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), JSON.stringify(returnValue), outFile]);
    // Stdout data
    python.stdout.on('data', (data) => {
      responseData = data.toString();
      console.log(responseData);
    });

    // Error data
    python.stderr.on('data', (data) => {
      console.log('Error: ' + data);
    });

    // Close process, return the activities that went into the graph
    python.on('close', (code) => {
      console.log('Closing: ' + code);
      res.status(200).json(returnValue);
  });

  // Line chart
  } else {
    if (sport == "All Sports"){
      sport = 'all sports';
    }
    const python = await spawn('python3', ['./src/graphing/generalGraphs.py', username, duration, graphType, sport, goal,
    startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), JSON.stringify(returnValue), outFile]);

    // Stdout data
    python.stdout.on('data', (data) => {
      responseData = data.toString();
      console.log(responseData);
    });

    // Error data
    python.stderr.on('data', (data) => {
      console.log('Error: ' + data);
    });

    // Close process, return the activities that went into the graph
    python.on('close', (code) => {
      //console.log('Closing: ' + code);
      res.status(200).json(returnValue);
    });
  }
};
