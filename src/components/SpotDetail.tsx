import type { FC } from 'hono/jsx'
import type { Doc } from '../../convex/_generated/dataModel'
import WifiIcon from './icons/WifiIcon'
import UtensilsIcon from './icons/UtensilsIcon'
import UsersIcon from './icons/UsersIcon'
import PowerPlugIcon from './icons/PowerPlugIcon'

interface SpotDetailProps {
  spot: Doc<'spots'>
}

const SpotDetail: FC<SpotDetailProps> = ({ spot }) => {
  const {
    name,
    address,
    neighborhood,
    map_iframe_url,
    latitude,
    longitude,
    wifi_quality,
    wifi_notes,
    food_available,
    food_notes,
    crowd_level_typical,
    crowd_notes,
    power_outlets,
    other_amenities_text,
    description_admin,
    main_photo_url,
    hours_of_operation_text,
    website_url,
    phone_number,
    date_last_verified_admin,
  } = spot

  const getMapLink = () => {
    if (map_iframe_url) {
      return <iframe src={map_iframe_url} width="100%" height="400" style="border:0;" loading="lazy" />
    }
    if (latitude && longitude) {
      return (
        <a
          href={`https://www.google.com/maps?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google Maps →
        </a>
      )
    }
    return <p>Map not available</p>
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not yet verified'
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article class="spot-detail">
      <header>
        <h1>{name}</h1>
        {neighborhood && <p class="neighborhood">{neighborhood}</p>}
        <p class="address">{address}</p>
      </header>

      {main_photo_url && (
        <img src={main_photo_url} alt={`${name} - Remote Work Location`} class="main-image" />
      )}

      <section class="map-section">{getMapLink()}</section>

      <section class="details-grid">
        {(wifi_quality !== 'Unknown' || wifi_notes) && (
          <div class="detail-item wifi-details">
            <h3><span class="icon"><WifiIcon size={20} /></span>WiFi</h3>
            <p class="quality">{wifi_quality}</p>
            {wifi_notes && <p class="notes">{wifi_notes}</p>}
          </div>
        )}

        {(food_available || food_notes) && (
          <div class="detail-item food-details">
            <h3><span class="icon"><UtensilsIcon size={20} /></span>Food</h3>
            <p class="availability">{food_available ? 'Available' : 'Not Available'}</p>
            {food_notes && <p class="notes">{food_notes}</p>}
          </div>
        )}

        {(crowd_level_typical !== 'Unknown' || crowd_notes) && (
          <div class="detail-item crowd-details">
            <h3><span class="icon"><UsersIcon size={20} /></span>Typical Crowd Level</h3>
            <p class="crowd">{crowd_level_typical}</p>
            {crowd_notes && <p class="notes">{crowd_notes}</p>}
          </div>
        )}

        {power_outlets !== 'Unknown' && (
          <div class="detail-item power-details">
            <h3><span class="icon"><PowerPlugIcon size={20} /></span>Power Outlets</h3>
            <p>{power_outlets}</p>
          </div>
        )}
      </section>

      {other_amenities_text && other_amenities_text.trim() && (
        <section class="amenities">
          <h3>Good to Know</h3>
          <p>{other_amenities_text}</p>
        </section>
      )}

      {description_admin && description_admin.trim() && (
        <section class="description">
          <h3>Our Full Review</h3>
          <p>{description_admin}</p>
        </section>
      )}

      {(hours_of_operation_text || website_url || phone_number) && (
        <section class="contact-info">
          <h3>Logistics</h3>
          {hours_of_operation_text && (
            <p class="contact-item">
              <strong>Hours:</strong> {hours_of_operation_text}
            </p>
          )}
          {website_url && (
            <p class="contact-item">
              <strong>Website:</strong> <a href={website_url} target="_blank" rel="noopener noreferrer">Visit Website →</a>
            </p>
          )}
          {phone_number && (
            <p class="contact-item">
              <strong>Phone:</strong> <a href={`tel:${phone_number}`} class="phone">{phone_number}</a>
            </p>
          )}
        </section>
      )}

      <footer>
        <p class="verification-date">
          Information last verified by admin on {formatDate(date_last_verified_admin)}
        </p>
      </footer>
    </article>
  )
}

export default SpotDetail
