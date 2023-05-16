import * as React from 'react';
import { styled } from '@mui/material/styles';
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

import SportIcon from './sportIcon';
import StravaIcon from './images/strava_icon.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ActivityMap from './activityMap';

const example_activity = {"_id":"645d4327bf6230b6ca426e37",
           "username":"dan3",
           "name":"Afternoon Run",
           "type":"Run",
           "sport":"Run",
           "description":"No description",
           "start_date_local":"2023-05-10T15:27:39Z",
           "distance":10558.4,
           "moving_time":3602,
           "json":{
              "resource_state":2,
              "athlete":{"id":22334872,"resource_state":1},
              "name":"Afternoon Run",
              "distance":10558.4,
              "moving_time":3602,
              "elapsed_time":5465,
              "total_elevation_gain":220.7,
              "type":"Run",
              "sport_type":"Run",
              "workout_type":0,
              "id":9049051473,
              "start_date":"2023-05-10T22:27:39Z",
              "start_date_local":"2023-05-10T15:27:39Z",
              "timezone":"(GMT-08:00) America/Los_Angeles",
              "utc_offset":-25200,
              "location_city":null,
              "location_state":null,
              "location_country":"United States",
              "achievement_count":0,
              "kudos_count":6,
              "comment_count":0,
              "athlete_count":1,
              "photo_count":0,
              "map":{
                "id":"a9049051473",
                "summary_polyline":"}qx`Fdp}gVKLq@Hg@r@s@Vk@HEEq@C_@i@Me@S{AYq@CU@s@I_AB[Es@Mm@cAeBi@Us@Da@^YzA?nAXXXt@F`@Ab@BhAMt@Yx@]l@[ZQn@YTK@a@SSB[pASHk@t@GPw@~@q@Ng@j@e@ZSAs@[a@k@QMMYmBr@s@SuAM]QGQ?q@BIC[Dm@Ck@Bg@I}ALaA@q@FUDqAGa@KCs@jAO@a@l@ANJl@ANYdAEt@EP@^Uz@q@h@[j@a@`@[n@s@TiCg@_CY_@Ae@Js@^uAxAU^Yr@KJYdAOJa@z@@LMZoAhAm@v@SNNQ@Kh@Y|AkBr@wAX_ANQL_@p@oAjAkAj@Q`AEJG`BR\\Cz@X^@zDsB`@w@DUAQLUDe@Pi@De@G_AXm@\\]V_AXc@VJA`@?TDBIXKvADfGMhAFZj@VtBf@Z@DIjAMj@f@d@Xf@HZITSNIXCfBk@tAGPMJc@ZYBMPB`@_@BYEg@Rg@x@uARu@Xm@Bq@CwAIc@USKS@c@Kg@Ag@CA?_@F@@e@HWTWNIf@CXBb@TZ\\n@zABz@Jx@CjAH\\PHFxARbA`@l@PJ`@Dd@Cr@Wl@q@d@_@n@L~BbA`Bx@pA?XKVuBHmAH_@f@}@@]GYMOkB_@KOKi@O[{B@eBHGHA|@Mt@[x@]d@Ut@ANDRv@t@c@dBBTCzADh@]z@QRCZJ`@CZYb@BFpAEjCRfAIrAUdAa@|@GdCGz@F^G|@BtCf@l@Al@WR]nCoCzAo@lAQbAJzBj@vAH\\XXAbAa@b@Bp@Zh@HvAd@j@d@@RGf@q@bBBZpAfAnC`BTZN\\LbBF~BMX{@JIJWdAc@z@gClBKVCz@Db@d@bBdA|CA~@EZDhAZr@JhAR|@RlBJ`@r@^|@n@^f@e@i@a@EGKeAs@QoAAc@c@aC[o@Iq@AULoAi@mBAQa@wAEc@]kA?iAFYP{ENo@CGL{@?sCD_CBg@Cg@QKc@i@CYTy@f@iAGW_@OsAEi@To@FmAb@wDXyAGkASoAJKQWAs@c@Q_@_@MSa@cAa@yA?iCd@IEEWZk@CSISICOW}@o@c@Oo@K}@TaBNcETOKsBw@]]}@e@",
                "resource_state":2
              },
              "trainer":false,
              "commute":false,
              "manual":false,
              "private":false,
              "visibility":"everyone",
              "flagged":false,
              "gear_id":null,
              "start_latlng":[36.995033361017704,-122.05330062657595],
              "end_latlng":[36.99499128386378,-122.05339500680566],
              "average_speed":2.931,
              "max_speed":5.672,
              "has_heartrate":false,
              "heartrate_opt_out":false,
              "display_hide_heartrate_option":false,
              "elev_high":296.5,
              "elev_low":132,
              "upload_id":9707981841,
              "upload_id_str":"9707981841",
              "external_id":"3B6F4097-884A-46B6-948C-53401090D76F-activity.fit",
              "from_accepted_tag":false,
              "pr_count":0,
              "total_photo_count":0,
              "has_kudoed":false
            }
          }

// Ideal ratio is width:height = 2:3
export default function ActivityCard({ activity, width=300, height=450 }) {
  const name = activity.name;
  const sport = activity.sport_type;
  const description = activity.description;
  const distance = activity.distance;
  const moving_time = activity.moving_time;
  const pace = moment.utc(moving_time*1000 / (distance/1000)).format('mm:ss');
  const strava_link = `http://strava.com/activities/${activity.id}`;
  const elapsed_time = activity.elapsed_time;
  const elevation_gain = activity.total_elevation_gain;
  const date = moment(new Date(activity.start_date));
  const start_latlng = activity.start_latlng;
  const end_latlng = activity.end_latlng;
  const achievement_count = activity.achievement_count;
  const kudos_count = activity.kudos_count;
  const comment_count = activity.comment_count;
  const photo_count = activity.total_photo_count;
  const map = activity.map;
  const map_width = width-33;
  const map_height = height/2;

  const [expanded, setExpanded] = React.useState(false);

  const secondsToDigital = (secs) => {
    return moment.utc(secs*1000).format('HH:mm:ss');
  }
  
  return (
    <Card sx={{backgroundColor: '#f9f9f9', width: width, height: height}}>
      {name == null ? <></> : <>
      <CardHeader
        title={name}
        subheader={date.format('llll')}
        action={<Box sx={{mr: 1.3, mt: 1.5}}>
                  <SportIcon sport={sport} fontSize='large' />
                </Box>}
      />
      <CardContent>
        <Box sx={{ mt: -3.5, mb: 0.7 }}>
          <ActivityMap start_latlng={start_latlng} end_latlng={end_latlng} map={map} width={map_width} height={map_height} />
        </Box>
        <Typography>
            <strong>Distance:</strong> {(distance/1000).toFixed(2)} km
        </Typography>
        <Typography>
          <strong>Time:</strong> {secondsToDigital(moving_time)}
        </Typography>
        <Typography>
          <strong>Pace:</strong> {pace} min/km
        </Typography>
        <Typography>
          <strong>Elevation gain:</strong> {elevation_gain} m
        </Typography>
      </CardContent>
      <CardActions sx={{mt: -3}} disableSpacing>
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
      </CardActions>
      <Collapse in={false}>
        <CardContent>
          <Typography>
            <strong>Description:</strong> {description}
          </Typography>
          <Typography>
            <strong>Total elapsed time:</strong> {description}
          </Typography>
        </CardContent>
      </Collapse>
      </>}
    </Card>
  );
}
