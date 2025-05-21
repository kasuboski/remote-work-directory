import type { FC } from 'hono/jsx'
import WifiIcon from './icons/WifiIcon'
import UtensilsIcon from './icons/UtensilsIcon'
import UsersIcon from './icons/UsersIcon'
import PowerPlugIcon from './icons/PowerPlugIcon' // Icon for power availability

interface SpotCardProps {
  slug: string
  name: string
  address: string | null
  neighborhood: string | null
  mainPhotoUrl: string | null
  wifiQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Unknown'
  wifiNotes?: string | null
  foodAvailable: boolean
  foodNotes?: string | null
  crowdLevelTypical: 'Unknown' | 'Quiet' | 'Moderate' | 'Busy' | 'Varies'
  crowdNotes?: string | null
  powerAvailability?: 'Plenty' | 'Some' | 'Few' | 'None' | 'Unknown' | null
  descriptionAdmin: string | null
}

const SpotCard: FC<SpotCardProps> = ({
  slug,
  name,
  address,
  neighborhood,
  mainPhotoUrl,
  wifiQuality,
  wifiNotes,
  foodAvailable,
  foodNotes,
  crowdLevelTypical,
  crowdNotes,
  powerAvailability,
  descriptionAdmin,
}) => {
  const ourTakeSnippet = descriptionAdmin
    ? descriptionAdmin.length > 250
      ? descriptionAdmin.substring(0, 250) + '...'
      : descriptionAdmin
    : null;

  return (
    <article class="spot-card">
      {mainPhotoUrl && (
        <img src={mainPhotoUrl} alt={`Photo of ${name}`} class="spot-image" />
      )}
      <div class="spot-content">
        <h3 class="spot-name">{name}</h3>
        {(address || neighborhood) && (
          <p class="spot-address-neighborhood">
            {address}
            {address && neighborhood && <span class="separator"> • </span>}
            {neighborhood}
          </p>
        )}

        <div class="at-a-glance">
          <ul>
            {wifiQuality !== 'Unknown' && (
              <li>
                <strong><span class="icon"><WifiIcon size={16} /></span>WiFi:</strong> 
                {wifiQuality}
                {wifiNotes && <span class="notes"> ({wifiNotes})</span>}
              </li>
            )}
            <li>
              <strong><span class="icon"><UtensilsIcon size={16} /></span>Food:</strong> 
              {foodAvailable ? 'Yes' : 'No'}
              {foodNotes && <span class="notes"> ({foodNotes})</span>}
            </li>
            {crowdLevelTypical !== 'Unknown' && (
              <li>
                <strong><span class="icon"><UsersIcon size={16} /></span>Crowd:</strong> 
                {crowdLevelTypical}
                {crowdNotes && <span class="notes"> ({crowdNotes})</span>}
              </li>
            )}
            {powerAvailability && powerAvailability !== 'None' && (
              <li>
                <strong><span class="icon"><PowerPlugIcon size={16} /></span>Outlets:</strong> 
                {powerAvailability}
              </li>
            )}
          </ul>
        </div>

        {ourTakeSnippet && (
          <div class="our-take">
            <h4 class="our-take-heading">Our Take ✨</h4>
            <p class="our-take-text">{ourTakeSnippet}</p>
          </div>
        )}

        <a href={`/spots/${slug}`} class="btn btn-primary view-details-btn">
          Full Spot Profile
        </a>
      </div>
    </article>
  )
}

export default SpotCard
