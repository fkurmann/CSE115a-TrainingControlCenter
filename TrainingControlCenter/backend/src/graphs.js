const {spawn} = require('child_process');

// General graphing function
exports.drawGraph = async (req, res) => {
  // Parameters
  let {username, duration, graphType, sport, goal, startDate, outFile} = req.body;
  
  
  // Spawn python graphing child processs
  let responseData;
  const python = await spawn('python3', ['./src/graphing/generalGraphs.py', username, duration, graphType, sport, goal, startDate, outFile]);
  
  // Stdout data
  python.stdout.on('data', (data) => {
    responseData = data.toString();
    console.log('stdout: ' + data);
  });
  
  // Error data
  python.stderr.on('data', (data) => {
    console.log('Error: ' + data);
  });

  // Close process
  python.on('close', (code) => {
    console.log('Closing: ' + code);
    console.log(responseData)
    res.send(responseData)
  });
};