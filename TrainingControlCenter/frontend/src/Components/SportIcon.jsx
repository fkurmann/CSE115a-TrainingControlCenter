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
//      import SportIcon from '../sportIcon';
// 2. Use it with sport name
//      <SportIcon sport='running' />
export default function SportIcon({sport}) {
  sport = sport.toLowerCase()
  if(sport.includes('Run')) return <DirectionsRunIcon />
  if(sport.includes('cycl') || sport.includes('bike') || sport.includes('Ride')) return <DirectionsBikeIcon />
  if(sport.includes('Swim')) return <PoolIcon />
  if(sport.includes('Walk')) return <DirectionsWalkIcon />
  if(sport.includes('Hike') || sport.includes('hiking')) return <HikingIcon />
  if(sport.includes('Kayak') || sport.includes('canoe')) return <KayakingIcon />
  if(sport.includes('Row')) return <RowingIcon />
  if(sport.includes('Surf')) return <SurfingIcon />
  if(sport.includes('Ski')) return <DownhillSkiingIcon />
  if(sport.includes('Snowboard')) return <SnowboardingIcon />
  if(sport.includes('Skate')) return <IceSkatingIcon />
  if(sport.includes('Weight')) return <FitnessCenterIcon />

  return <SportsIcon />
}