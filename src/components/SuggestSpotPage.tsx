import type { FC } from 'hono/jsx'

interface SuggestSpotPageProps {
  success?: boolean;
  error?: string;
}

const SuggestSpotPage: FC<SuggestSpotPageProps> = ({ success, error }) => {
  if (success) {
    return (
      <div class="page-container suggest-spot-page">
        <div class="success-message">
          <h1>Thank You!</h1>
          <p>Your suggestion has been submitted successfully. We'll review it and add it to our list soon!</p>
          <a href="/" class="back-link">← Back to all spots</a>
        </div>
      </div>
    )
  }

  return (
    <div class="page-container suggest-spot-page">
      <header class="page-header">
        <h1>Suggest a New Spot</h1>
      </header>
      <p class="intro-text">
        Know a great place for remote work in Austin? Help us grow our list by suggesting it below! 
        The more details you can provide, the better. We'll review all suggestions before publishing.
      </p>
      
      {error && (
        <div class="error-message">
          <p>{error}</p>
        </div>
      )}
      
      <form class="suggest-form" method="post" action="/suggest">
        <div class="form-group">
          <label for="spotName">Spot Name (Required)</label>
          <input type="text" id="spotName" name="spotName" required />
        </div>

        <div class="form-group">
          <label for="spotAddress">Address</label>
          <input type="text" id="spotAddress" name="spotAddress" />
        </div>

        <div class="form-group">
          <label for="spotNeighborhood">Neighborhood</label>
          <input type="text" id="spotNeighborhood" name="spotNeighborhood" />
        </div>

        <div class="form-group">
          <label for="reason">Why is this a good spot? (e.g., vibe, specific features)</label>
          <textarea id="reason" name="reason" rows={4}></textarea>
        </div>

        <fieldset>
          <legend>Optional Details (helps us verify faster!)</legend>
          <div class="form-group">
            <label for="wifiNotes">WiFi Notes (e.g., password, speed, reliability)</label>
            <textarea id="wifiNotes" name="wifiNotes" rows={2}></textarea>
          </div>
          <div class="form-group">
            <label for="foodNotes">Food/Drink Notes (e.g., coffee quality, food menu)</label>
            <textarea id="foodNotes" name="foodNotes" rows={2}></textarea>
          </div>
          <div class="form-group">
            <label for="crowdNotes">Crowd Notes (e.g., usually quiet, busy at lunch)</label>
            <textarea id="crowdNotes" name="crowdNotes" rows={2}></textarea>
          </div>
          <div class="form-group">
            <label for="powerNotes">Power Outlet Notes (e.g., plenty of outlets, hard to find)</label>
            <textarea id="powerNotes" name="powerNotes" rows={2}></textarea>
          </div>
          <div class="form-group">
            <label for="otherNotes">Other Amenities/Notes (e.g., parking, outdoor seating)</label>
            <textarea id="otherNotes" name="otherNotes" rows={2}></textarea>
          </div>
        </fieldset>

        <fieldset>
          <legend>Your Information (Optional)</legend>
          <div class="form-group">
            <label for="suggesterName">Your Name</label>
            <input type="text" id="suggesterName" name="suggesterName" />
          </div>
          <div class="form-group">
            <label for="suggesterEmail">Your Email (in case we have questions)</label>
            <input type="email" id="suggesterEmail" name="suggesterEmail" />
          </div>
        </fieldset>

        <button type="submit" class="btn btn-primary">Submit Suggestion</button>
      </form>
    </div>
  )
}

export default SuggestSpotPage
