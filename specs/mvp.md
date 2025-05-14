Remote Work Directory Project Breakdown

Overview
This project is to build the first version of the "Austin Remote Work Spot Finder," a web directory designed to help people in Austin, TX, find good public places for remote work. Users will be able to browse a curated list of spots, view detailed information about each, and perform basic searches and filtering. The backend will use Convex for data storage and management, with an administrator manually inputting and maintaining the spot data via the Convex dashboard. The frontend will be built with Hono, serving server-rendered JSX from Cloudflare Workers, ensuring a fast and search-engine-friendly experience.

Tasks

1.  **[x] Setup Convex Backend and Define `spots` Schema**
    *   **Description:** Initialize the Convex project and define the database schema for storing information about remote work spots. Create a table named `spots` with the following fields. This schema will be used by administrators to input data via the Convex dashboard and by the frontend to display spot information.
    *   **`spots` Table Schema:**
        *   `name`: (String, Required) e.g., "Cosmic Coffee + Beer Garden"
        *   `address`: (String, Required) e.g., "121 Pickle Rd, Austin, TX 78704"
        *   `neighborhood`: (String, Optional) e.g., "South Congress"
        *   `google_places_id`: (String, Optional) For admin reference.
        *   `map_iframe_url`: (String, Optional) URL for an embeddable Google Map iframe.
        *   `latitude`: (Number, Optional) Latitude for map pin.
        *   `longitude`: (Number, Optional) Longitude for map pin.
        *   `wifi_quality`: (String, Required) Values: "Excellent", "Good", "Fair", "Poor", "Unknown".
        *   `wifi_notes`: (Text, Optional) e.g., "Password on receipt".
        *   `food_available`: (Boolean, Required) True if food is served.
        *   `food_notes`: (Text, Optional) e.g., "Coffee & pastries only".
        *   `crowd_level_typical`: (String, Required) Values: "Quiet", "Moderate", "Busy", "Varies".
        *   `crowd_notes`: (Text, Optional) e.g., "Usually busy mornings".
        *   `power_outlets`: (String, Required) Values: "Plenty", "Some", "Few", "None", "Unknown".
        *   `other_amenities_text`: (Text, Optional) e.g., "Outdoor seating, Pet-friendly".
        *   `description_admin`: (Text, Optional) Admin's summary of the spot.
        *   `main_photo_url`: (String, Optional) URL to a representative image.
        *   `hours_of_operation_text`: (Text, Optional) e.g., "Mon-Fri 7am-8pm".
        *   `website_url`: (String, Optional) Official website.
        *   `phone_number`: (String, Optional) Contact number.
        *   `date_last_verified_admin`: (Number, Required) Timestamp of when admin last verified info.
        *   `is_published`: (Boolean, Required, Default: true) Controls if the spot is visible on the live site.
    *   **Technical Context:** Use `convex/schema.ts` to define this table. Administrators will use the Convex dashboard to manage data in this table.
    *   **Demoable:** The Convex dashboard shows the `spots` table with the correct schema. An administrator can manually add, view, edit, and delete entries, including setting the `is_published` flag.

2.  **[x] Initialize Hono Frontend on Cloudflare Workers with Basic Layout**
    *   **Description:** Set up a new Hono project configured for Cloudflare Workers. Create a basic site structure including a shared layout component (e.g., `Layout.tsx`). This layout should include a simple header with the site title "Austin Remote Work Spot Finder," a main content area placeholder, and a simple footer.
    *   **Technical Context:** This involves setting up Hono routing, JSX for templating, and configuring the Cloudflare Workers deployment. The Convex client SDK will need to be installable for later tasks.
    *   **Demoable:** A basic HTML page is served from a Cloudflare Worker URL, displaying the site title in the header and a footer.

3.  **[x] Implement Homepage: Spot Listing View**
    *   **Description:** Develop the main page of the site, which lists available remote work spots. This page will fetch and display a summary of each spot marked as `is_published: true` from the Convex backend.
    *   **Functionality:**
        *   Create a Convex query function to fetch all spots where `is_published` is `true`.
        *   The Hono route for the homepage (`/`) will call this query.
        *   For each spot, display a "card" containing:
            *   `name`
            *   `neighborhood` (if available)
            *   `main_photo_url` (displayed as a thumbnail image with `alt` text, e.g., using the spot's name)
            *   Key indicators for `wifi_quality` (e.g., "WiFi: Excellent")
            *   `food_available` (e.g., "Food: Yes/No")
            *   `crowd_level_typical` (e.g., "Crowd: Moderate")
        *   Each spot card should link to its detail page (e.g., using a URL structure like `/spots/[spot_id]`).
    *   **Technical Context:** Use Hono to handle the request, fetch data from Convex, and render JSX components. Create a reusable `SpotCard.tsx` component. Basic CSS should be applied for a clear, list-based presentation.
    *   **Demoable:** The homepage loads and displays a list of spot cards. Each card shows the specified summary information and links to a unique URL for its detail page. Requires some sample data (at least 2-3 spots) in the Convex `spots` table with `is_published: true`.

4.  **[x] Implement Spot Detail Page**
    *   **Description:** Create a page to show all available information for a single remote work spot, fetched from Convex based on its slugified name.
    *   **Functionality:**
        *   Set up a dynamic Hono route (e.g., `/spots/:slug` where slug is a URL-friendly version of the spot name).
        *   Create a Convex query function to fetch a single spot by its slugified name.
        *   Add a `slug` field to the spots table (String, Required) - this should be auto-generated from the name field when spots are created/updated.
        *   The page should display:
            *   `name`, `address`, `neighborhood`.
            *   An embedded map:
                *   If `map_iframe_url` is available, embed it.
                *   Else, if `latitude` and `longitude` are available, provide a link like `https://www.google.com/maps?q=<latitude>,<longitude>`.
                *   Else, display "Map not available".
            *   WiFi details: `wifi_quality`, `wifi_notes`.
            *   Food details: `food_available` (as "Yes" or "No"), `food_notes`.
            *   Crowd details: `crowd_level_typical`, `crowd_notes`.
            *   Power Outlets: `power_outlets`.
            *   Other Amenities: `other_amenities_text`.
            *   Admin's description: `description_admin`.
            *   `hours_of_operation_text`, `website_url` (as a link), `phone_number`.
            *   `main_photo_url` (displayed as a larger image with `alt` text).
            *   A note: "Information last verified by admin on [formatted `date_last_verified_admin`]".
    *   **Technical Context:** The Hono route handler will extract the spot ID from the URL, use it to query Convex, and pass the data to a `SpotDetail.tsx` component for rendering.
    *   **Demoable:** Clicking on a spot from the homepage list navigates to its detail page. The detail page correctly displays all the specified information for that spot, including the map or map link.

5.  **[x] Implement Keyword Search by Spot Name**
    *   **Description:** Add functionality to the homepage allowing users to search for spots by their name.
    *   **Functionality:**
        *   Add a search input field (e.g., within an HTML form using the GET method) on the homepage (Spot Listing View).
        *   Modify the Convex query for fetching spots to accept an optional search term. This query should filter spots where the `name` field (case-insensitive, if possible via Convex indexing) contains the search term.
        *   The Hono route for the homepage should read the search term from a URL query parameter (e.g., `/?search=Cosmic`) and pass it to the Convex query.
        *   The list of spots on the homepage should update to display only matching results. If no spots match, display a "No spots found matching your search." message.
    *   **Technical Context:** This involves updating the Convex query to include search logic (consider indexing the `name` field in Convex for performance). The frontend form will trigger a page reload/data refetch with the search query parameter.
    *   **Demoable:** A user can type a spot name (or part of it) into the search bar on the homepage, submit the search, and the list of spots updates to show only those whose names match the search term.

6.  **[x] Implement Basic Filters for Spot List**
    *   **Description:** Allow users to filter the list of spots on the homepage based on WiFi quality, food availability, and typical crowd level.
    *   **Functionality:**
        *   Add filter controls (e.g., dropdowns `<select>` or radio button groups within a form using the GET method) on the homepage for:
            *   `wifi_quality`: Options "Excellent", "Good".
            *   `food_available`: Options "Yes" (maps to `true`), "No" (maps to `false`).
            *   `crowd_level_typical`: Options "Quiet", "Moderate".
        *   Modify the Convex query for fetching spots to accept these filter parameters. Applied filters should work together (AND logic).
        *   The Hono route for the homepage should read filter values from URL query parameters (e.g., `/?wifi=Excellent&food=true`) and pass them to the Convex query.
        *   The list of spots should update based on the applied filters.
        *   Include a "Clear Filters" link/button that resets all filters and shows all published spots (i.e., navigates to the homepage URL without filter parameters).
    *   **Technical Context:** This extends the Convex query to handle multiple filter conditions. The frontend form will construct the URL with appropriate query parameters. Ensure the UI reflects the currently active filters (e.g., selected dropdown options).
    *   **Demoable:** A user can select options from the filter controls, apply them, and the spot list updates to show only spots matching all selected criteria. The "Clear Filters" button resets the view. Filters should work in conjunction with any active search term.

7.  **[ ] Add "Suggest a Spot" Link to External Fillout Form**
    *   **Description:** Provide a way for users to suggest new spots for the directory by linking to an external Fillout form.
    *   **Functionality:**
        *   Add a "Suggest a Spot" link or button in a prominent, easily accessible location on the website (e.g., in the site header or footer).
        *   This link should direct users to a pre-configured Fillout form URL (this URL will be provided by the project administrator). The form itself and its submission handling (e.g., email to admin) are managed outside of this development task.
    *   **Technical Context:** This is a simple UI addition of a hyperlink.
    *   **Demoable:** A "Suggest a Spot" link/button is visible on the site. Clicking this link opens the specified Fillout form URL in a new browser tab or window.

8.  **[ ] Apply Styling, Ensure Responsiveness, and Basic Accessibility**
    *   **Description:** Refine the visual presentation of the website, ensure it works well on various devices, and implement basic web accessibility features.
    *   **Functionality:**
        *   Apply consistent and clean CSS styling for a professional and intuitive user experience across all pages and components.
        *   Ensure the website layout is fully responsive and usable on common desktop, tablet, and mobile screen sizes.
        *   Implement basic accessibility best practices:
            *   Use semantic HTML elements (e.g., `<nav>`, `<main>`, `<article>`, `<aside>`).
            *   Ensure sufficient color contrast for text and interactive elements.
            *   Verify that all interactive elements (links, buttons, form inputs) are navigable using only a keyboard.
            *   Ensure all images (e.g., `main_photo_url` in spot cards and detail pages) have descriptive `alt` attributes.
        *   Test on latest versions of major browsers (Chrome, Firefox, Safari, Edge).
    *   **Technical Context:** This involves writing CSS, possibly using CSS media queries for responsiveness. Hono's server-side rendering of JSX will contribute to good semantic HTML structure, aiding accessibility and search engine optimization.
    *   **Demoable:** The website is visually appealing, easy to navigate, and adapts gracefully to different screen sizes (desktop, tablet, mobile). Basic accessibility checks pass (e.g., keyboard navigation, alt text for images). Site content loads quickly.

Testing Plan
This plan outlines how to verify the product's functionality as each task is completed. It assumes an administrator has populated the Convex `spots` table with some sample data (at least 5-10 diverse spots, some published, some not) after Task 1.

1.  **Convex Backend and `spots` Schema:**
    *   **Success Criteria:** Log into the Convex dashboard. The `spots` table exists with all specified fields and their correct types (String, Boolean, Number, Text, Optional/Required). Admin can successfully create new spot entries, edit existing ones, and delete them. The `is_published` flag can be toggled.

2.  **Hono Frontend Setup & Basic Layout:**
    *   **Success Criteria:** Navigate to the Cloudflare Worker URL. A basic webpage loads displaying the site title "Austin Remote Work Spot Finder" in a header, and a simple footer is present.

3.  **Homepage: Spot Listing View:**
    *   **Success Criteria:** The homepage (`/`) loads and displays a list of spot "cards". Only spots with `is_published: true` in Convex are shown. Each card correctly displays the spot's `name`, `neighborhood` (if present), a thumbnail from `main_photo_url` with alt text, `wifi_quality`, `food_available` (Yes/No), and `crowd_level_typical`. Each card links to a unique URL like `/spots/[spot_id]`.

4.  **Spot Detail Page:**
    *   **Success Criteria:** Clicking a spot card on the homepage navigates to its detail page. The page displays all specified fields for that spot: `name`, `address`, `neighborhood`, map (embedded iframe, or link, or "Map not available" message), WiFi details, food details, crowd details, power outlet info, other amenities, admin description, hours, website link, phone, larger main photo with alt text, and the "Information last verified..." note with a date.

5.  **Keyword Search by Spot Name:**
    *   **Success Criteria:** On the homepage, entering a full or partial spot name into the search field and submitting updates the list to show only matching spots. If no spots match, an appropriate message is displayed. Search works correctly with various existing spot names.

6.  **Basic Filters for Spot List:**
    *   **Success Criteria:** On the homepage, selecting filter options for `wifi_quality` (Excellent, Good), `food_available` (Yes, No), and `crowd_level_typical` (Quiet, Moderate) and applying them updates the spot list to show only spots matching ALL selected criteria. The "Clear Filters" button resets the list to show all published spots. Filters work correctly in combination with search terms.

7.  **"Suggest a Spot" Link:**
    *   **Success Criteria:** A "Suggest a Spot" link/button is visible on the site. Clicking it opens the administrator-provided Fillout form URL in a new browser tab or window.

8.  **Styling, Responsiveness, and Basic Accessibility:**
    *   **Success Criteria:** The website has a consistent, clean, and professional visual design. All pages and features are usable and look good on desktop, common tablet sizes, and common mobile phone sizes. All interactive elements can be accessed and activated using keyboard-only navigation. All images have appropriate `alt` text. Text has sufficient color contrast. Page load times are fast.