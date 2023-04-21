// General graphing function

/* To be implemented in sprint 3, can use matplotlib or other graphing 
library, save image files in a folder in the frontend directory, then
call those files via the JSX files. */


exports.drawGraph = async (req, res) => {
  let returnValue = 0;
  if (returnValue !== -1) {
    res.status(401).send('Error');
  } else {
    res.status(200).json({
      success: 'Blank'
    });    
  }
};