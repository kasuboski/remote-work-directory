import type { FC } from 'hono/jsx'

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
            <div class="detail">
              <span>WiFi:</span> {wifiQuality.charAt(0).toUpperCase() + wifiQuality.slice(1)}
            </div>
          )}
          <div class="detail">
            <span>Food:</span> {foodAvailable ? 'Available' : 'Not Available'}
          </div>
          {crowdLevelTypical && (
            <div class="detail">
              <span>Crowd:</span>{' '}
              {crowdLevelTypical.charAt(0).toUpperCase() + crowdLevelTypical.slice(1)}
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
