import * as React from 'react';
import moment from 'moment';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import SportIcon from './sportIcon';
import StravaIcon from './images/strava_icon.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ActivityMap from './activityMap';
import { getActivityDetails } from './stravaData';
import { CircularProgress } from '@mui/material';

/**
 * Creates an MUI Card based on specified activity, whether or manual or strava.
 *
 * @param {Object} activity - manual or strava activity with detailed information.
 * @param {int} [width] - optional parameter denoting width of MUI card.
 * @return {HTMLElement} - creates and returns the activity card for specified activity.
 */
export default function ActivityCard({ activity, width = 300 }) {
  const name = activity.name;
  const activityJson = activity.json;
  const manual_description = activity.description;
  const sport = activity.sport_type ? activity.sport_type : activity.sport ? activity.sport : '';
  const distance = activityJson.distance;
  const moving_time = activityJson.moving_time;
  const pace = moment.utc((moving_time || 0) * 1000 / ((distance || 1000) / 1000)).format('mm:ss');
  const strava_link = `http://strava.com/activities/${activityJson.id}`;
  // const elapsed_time = activity.elapsed_time;
  const elevation_gain = activityJson.total_elevation_gain;
  const date = moment(new Date(activity.start_date || 0));
  const start_latlng = activityJson.start_latlng;
  const end_latlng = activityJson.end_latlng;
  // const achievement_count = activity.achievement_count;
  // const kudos_count = activity.kudos_count;
  // const comment_count = activity.comment_count;
  // const photo_count = activity.total_photo_count;
  const map = activityJson.map;
  const map_width = width - 33;
  const map_height = map_width * 7 / 8;

  const [expanded, setExpanded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [detailedActivity, setDetailedActivity] = React.useState(null);

  const secondsToDigital = (secs) => {
    return moment.utc(secs*1000).format('HH:mm:ss');
  }

  React.useEffect(() => {
    if (!loading && expanded && detailedActivity == null) {
      setLoading(true);
      getActivityDetails(activityJson.id).then((res) => {
        setLoading(false);
        setDetailedActivity(res);
      }).catch((error) => {
        console.log('Error when getting detailed activity', error);
      });
    }
  }, [expanded, loading, detailedActivity, activity.id]);

  return (
    <Card sx={{backgroundColor: '#f9f9f9', width: width}}>
      {name == null ? <></> : <>
      <CardHeader
        title={name}
        subheader={activity.username ? '' : date.format('llll')}
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
            <strong>Distance:</strong> {(distance / 1000).toFixed(2)} km
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
            <strong>Pace:</strong> {pace} min/km
          </Typography>
        }
        {
          !elevation_gain ? <></> :
          <Typography>
            <strong>Elevation gain:</strong> {elevation_gain} m
          </Typography>
        }
        {
          !manual_description ? <></> :
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
              <img src={StravaIcon} style={{width: 20, height: 20}} />
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
          <Typography>
            <strong>Description:</strong> {detailedActivity.description}
          </Typography>
          <Typography>
            <strong>Calories:</strong> {detailedActivity.calories}
          </Typography>
          <Typography>
            <strong>Device:</strong> {detailedActivity.device_name}
          </Typography>
          </>
          }
        </CardContent>
      </Collapse>
      </>}
    </Card>
  );
}
