import * as React from 'react';
import moment from 'moment';
import { 
  Box, 
  Card, 
  CardActions, 
  CardContent, 
  CardHeader, 
  CircularProgress, 
  Collapse, 
  Divider, 
  IconButton, 
  Tooltip, 
  Typography 
} from '@mui/material';
import SportIcon from './sportIcon';
import StravaIcon from './images/strava_icon.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ActivityMap from './activityMap';
import { getActivityDetails } from './stravaData';
import { grey } from '@mui/material/colors';

/**
 * Creates an MUI Card based on specified activity, whether or manual or strava.
 *
 * @param {Object} activity - manual or strava activity with detailed information.
 * @param {int} [width] - optional parameter denoting width of MUI card.
 * @return {HTMLElement} - creates and returns the activity card for specified activity.
 */
export default function ActivityCard({ activity, width = 300, realign = () => {} }) {
  const activityJson = activity.json;
  const isMetric = localStorage.getItem('isMetric') ? localStorage.getItem('isMetric') === 'true' : false;
  const dist_unit = isMetric ? 'km' : 'mi';
  const meters_per_unit = isMetric ? 1000 : 1609.34;
  const name = activity.name;
  const manual_description = activity.description;
  const sport = activity.sport_type ? activity.sport_type : activity.sport ? activity.sport : '';
  const distance = activityJson.distance;
  const moving_time = activityJson.moving_time;
  const pace = moment.utc((moving_time || 0) * 1000 / ((distance || 1000) / meters_per_unit)).format('m:ss');
  const strava_link = `http://strava.com/activities/${activityJson.id}`;
  const elevation_gain = isMetric ? activityJson.total_elevation_gain : activityJson.total_elevation_gain * 3.28;
  const elevation_unit = isMetric ? 'm' : 'ft';
  const date = activityJson.start_date ? moment(new Date(activityJson.start_date)) : null;
  const start_latlng = activityJson.start_latlng;
  const end_latlng = activityJson.end_latlng;
  const map = activityJson.map;
  const map_width = width - 33;
  const map_height = map_width * 7 / 8;
  // const achievement_count = activity.achievement_count;
  // const kudos_count = activity.kudos_count;
  // const comment_count = activity.comment_count;
  // const photo_count = activity.total_photo_count;

  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [detailedActivity, setDetailedActivity] = React.useState(null);

  /**
   * Returns time formatted as {days}d {hours}:{mins}:{secs}
   *
   * @param {int} secs - Number of seconds.
   * @return {int} - Returns the formatted time. 599 -> '9:59', 7200 -> '2:00:00', 86400 -> '1d 00:00:00'
   */
  const secondsToDigital = (secs) => {
    let format = '';
    if(secs / 60 < 10) format = 'm:ss';
    else if(secs / 3600 < 1) format = 'mm:ss';
    else if(secs / 3600 < 10) format = 'H:mm:ss';
    else if(secs / 86400 < 1) format = 'HH:mm:ss';
    else return Math.floor(secs / 86400) + 'd ' + moment.utc(secs*1000).format('HH:mm:ss');
    return moment.utc(secs*1000).format(format);
  }

  React.useEffect(() => {
    if (!loading && expanded && detailedActivity == null) {
      setLoading(true);
      realign();
      getActivityDetails(activityJson.id).then((res) => {
        setLoading(false);
        setDetailedActivity(res);
        realign();
      }).catch((error) => {
        console.log('Error when getting detailed activity', error);
      });
    }
  }, [expanded, loading, detailedActivity, activityJson.id]);

  return (
    <Card sx={{bgcolor: localStorage.getItem('brightnessMode') === 'dark' ? grey[900] : grey[50], width: width}}>
      {name == null ? <></> : <>
      <CardHeader
        title={name}
        subheader={date ? date.format('llll') : ''}
        action={<Box sx={{mr: 1.3, mt: 1.5}}>
                  <SportIcon sport={sport} fontSize='large' />
                </Box>}
      />
      <CardContent>
        {
          !map ? <></> :
          <Box sx={{ mt: -3.5, mb: 0.7 }}>
            <ActivityMap start_latlng={start_latlng} end_latlng={end_latlng} map={map} width={map_width} height={map_height} />
          </Box>
        }
        {
          !distance ? <></> :
          <Typography>
            <strong>Distance:</strong> {(distance/meters_per_unit).toFixed(2)} {dist_unit}
          </Typography>
        }
        {
          !moving_time ? <></> :
          <Typography>
            <strong>Time:</strong> {secondsToDigital(moving_time)}
          </Typography>
        }
        {
          !distance || !moving_time ? <></> :
          <Typography>
            <strong>Pace:</strong> {pace} min/{dist_unit}
          </Typography>
        }
        {
          !elevation_gain ? <></> :
          <Typography>
            <strong>Elevation gain:</strong> {Math.floor(elevation_gain)} {elevation_unit}
          </Typography>
        }
        {
          !manual_description || activityJson.id ? <></> :
          <Typography>
            <strong>Description:</strong> {manual_description}
          </Typography>
        }
      </CardContent>
      <CardActions sx={{mt: -3}} disableSpacing>
        {
          !activityJson.id ? <></> :
          <>
          <Tooltip title='View on Strava'>
            <IconButton target='_blank' href={strava_link}>
              <img src={StravaIcon} style={{width: 20, height: 20}} alt='Strava Logo'/>
            </IconButton>
          </Tooltip>
          <Tooltip title='More details'>
            <IconButton sx={{marginLeft: 'auto'}} onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Tooltip>
          </>
        }
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <Divider />
        <CardContent>
          { !detailedActivity ?
          <CircularProgress /> :
          <>
          {
            detailedActivity.description ?
            <Typography>
              <strong>Description:</strong> {detailedActivity.description}
            </Typography> : <></>
          }
          {
            detailedActivity.athlete_count > 1 ?
            <Typography>
              <strong>Number of athletes:</strong> {detailedActivity.athlete_count}
            </Typography> : <></>
          }
          <Typography>
            <strong>Calories:</strong> {detailedActivity.calories}
          </Typography>
          <Typography>
            <strong>Device:</strong> {detailedActivity.device_name}
          </Typography>
          {
            detailedActivity.kudos_count > 0 ?
            <Typography>
              <strong>Kudos:</strong> {detailedActivity.kudos_count}
            </Typography> : <></>
          }
          {
            detailedActivity.comment_count > 0 ?
            <Typography>
              <strong>Comments:</strong> {detailedActivity.comment_count}
            </Typography> : <></>
          }
          {
            detailedActivity.total_photo_count > 0 ?
            <Typography>
              <strong>Photos:</strong> {detailedActivity.total_photo_count}
            </Typography> : <></>
          }
          </>
          }
        </CardContent>
      </Collapse>
      </>}
    </Card>
  );
}
