import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import SportsIcon from '@mui/icons-material/Sports';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import HikingIcon from '@mui/icons-material/Hiking';
import KayakingIcon from '@mui/icons-material/Kayaking';
import RowingIcon from '@mui/icons-material/Rowing';
import SurfingIcon from '@mui/icons-material/Surfing';
import DownhillSkiingIcon from '@mui/icons-material/DownhillSkiing';
import SnowboardingIcon from '@mui/icons-material/Snowboarding';
import IceSkatingIcon from '@mui/icons-material/IceSkating';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

/**
 * Function for generating all needed MUI sport icons.
 * Example usage:
 * 1. Import it
 *      import SportIcon from '../SportIcon';
 * 2. Use it with sport name
 *      <SportIcon sport='running' />
 *
 * @param {string} sport - sport type, i.e. run, bike, swim
 * @param {string} [fontSize] - default to medium, can specify size of icon
 * @return {HTMLElement} - return MUI sports icon
 */
export default function SportIcon({sport, fontSize='medium'}) {
  if(!sport) return <SportsIcon />
  sport = sport.toLowerCase()
  fontSize = fontSize.toLowerCase()
  if(sport.includes('run') || sport.includes('virtual run')) return <DirectionsRunIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('cycle') || sport.includes('bike') || sport.includes('ride') || sport.includes('virtual ride'))
    return <DirectionsBikeIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('swim')) return <PoolIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('walk')) return <DirectionsWalkIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('hike') || sport.includes('hiking')) return <HikingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('kayak') || sport.includes('canoe')) return <KayakingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('row')) return <RowingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('surf')) return <SurfingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('ski')) return <DownhillSkiingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('snowboard')) return <SnowboardingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('skate')) return <IceSkatingIcon sx={{fontSize: fontSize}}/>
  if(sport.includes('weight')) return <FitnessCenterIcon sx={{fontSize: fontSize}}/>

  return <SportsIcon />
}
