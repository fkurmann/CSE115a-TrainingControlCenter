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

// Example usage:
// 1. Import it
//      import SportIcon from '../SportIcon';
// 2. Use it with sport name
//      <SportIcon sport='running' />
export default function SportIcon({sport}) {
  sport = sport.toLowerCase()
  if(sport.includes('run')) return <DirectionsRunIcon />
  if(sport.includes('cycl') || sport.includes('bike') || sport.includes('ride')) return <DirectionsBikeIcon />
  if(sport.includes('swim')) return <PoolIcon />
  if(sport.includes('walk')) return <DirectionsWalkIcon />
  if(sport.includes('hike') || sport.includes('hiking')) return <HikingIcon />
  if(sport.includes('kayak') || sport.includes('canoe')) return <KayakingIcon />
  if(sport.includes('row')) return <RowingIcon />
  if(sport.includes('surf')) return <SurfingIcon />
  if(sport.includes('ski')) return <DownhillSkiingIcon />
  if(sport.includes('snowboard')) return <SnowboardingIcon />
  if(sport.includes('skate')) return <IceSkatingIcon />
  if(sport.includes('weight')) return <FitnessCenterIcon />

  return <SportsIcon />
}