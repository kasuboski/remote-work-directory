import type { FC } from 'hono/jsx'
import WifiIcon from './icons/WifiIcon'
import UtensilsIcon from './icons/UtensilsIcon'
import UsersIcon from './icons/UsersIcon'

interface SpotCardProps {
  slug: string
  name: string
  neighborhood: string | null
  mainPhotoUrl: string | null
  wifiQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown'
  foodAvailable: boolean
  crowdLevelTypical: 'Unknown' | 'Quiet' | 'Moderate' | 'Busy' | 'Varies'
}

const SpotCard: FC<SpotCardProps> = ({
  slug,
  name,
  neighborhood,
  mainPhotoUrl,
  wifiQuality,
  foodAvailable,
  crowdLevelTypical,
}) => {
  const wifiClass = `wifi-${wifiQuality.toLowerCase()}`
  const foodClass = `food-${foodAvailable ? 'yes' : 'no'}`
  const crowdClass = `crowd-${crowdLevelTypical.toLowerCase()}`

  return (
    <div class="spot-card">
      {mainPhotoUrl && (
        <img src={mainPhotoUrl} alt={`${name} - Remote Work Location`} class="spot-image" />
      )}
      <div class="spot-content">
        <h2>{name}</h2>
        {neighborhood && <p class="neighborhood">{neighborhood}</p>}
        <div class="spot-details">
          {wifiQuality && (
            <div class={`detail ${wifiClass}`}>
              <span class="icon"><WifiIcon size={16} /></span>
              {wifiQuality}
            </div>
          )}
          <div class={`detail ${foodClass}`}>
            <span class="icon"><UtensilsIcon size={16} /></span>
            {foodAvailable ? 'Yes' : 'No'}
          </div>
          {crowdLevelTypical && (
            <div class={`detail ${crowdClass}`}>
              <span class="icon"><UsersIcon size={16} /></span>
              {crowdLevelTypical}
            </div>
          )}
        </div>
        <a href={`/spots/${slug}`} class="view-details">
          View Details →
        </a>
      </div>
    </div>
  )
}

export default SpotCard
