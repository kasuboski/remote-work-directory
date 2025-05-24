## Austin Remote Work Spot Finder: Design Specification

This document outlines the design philosophy, system, and page-by-page breakdown for the Austin Remote Work Spot Finder MVP. The goal is to create an application that is a joy to use, visually appealing with a vintage-modern aesthetic, and highly functional.

## 1. Design Philosophy: "Austin Analog"

Our design philosophy, "Austin Analog," aims to capture the warm, tangible, and friendly spirit of Austin's local culture and apply it to the digital experience of finding a great remote work spot.

*   **Vibe & Feel:**
    *   **Welcoming & Trustworthy:** Like a recommendation from a good friend who knows all the best local haunts. The app should feel reliable and personally curated.
    *   **Nostalgic Modernity:** We'll lean into a vintage aesthetic inspired by mid-century print and packaging (drawing inspiration from classic designs like the provided beer can), but apply it with modern usability, speed, and clarity. It’s the charm of the old, powered by the efficiency of the new.
    *   **Effortlessly Cool & Unpretentious:** Austin's vibe is cool without trying too hard. The design should be stylish but approachable, avoiding overly slick or corporate aesthetics.
    *   **Joyful Discovery:** The act of finding a new spot should be a small delight. The interface will be intuitive, information clear, and the overall experience smooth and pleasant.

*   **Core Principles:**
    *   **Clarity First:** Information must be easy to find, read, and understand.
    *   **Mobile-First, Progressively Enhanced:** Design for the small screen experience, then thoughtfully expand for larger displays.
    *   **Accessible to All:** Ensure the design is usable by people of all abilities.
    *   **Authentically Austin:** The design should have a personality that feels at home in Austin – through color, typography, and a generally friendly tone.

## 2. Design System: "Super Stoked System"

This system translates the "Austin Analog" philosophy into concrete, reusable design elements.

### A. Color Palette

Inspired by vintage aesthetics, adjusted for UI/UX and accessibility.

*   **Primary Blue (Stoked Blue):** `#2A7AB0`
    *   Use: Primary buttons, active navigation elements, key headers, or accent backgrounds.
    *   Text on Stoked Blue: `Paper White` (#FDFBF4) or `#FFFFFF` (WCAG AA+).
*   **Accent Orange (Sunset Orange):** `#E87D1E`
    *   Use: Secondary CTAs (like "Suggest a Spot"), tags, highlights, icons.
    *   Text on Sunset Orange: `Charcoal Type` (#333333) (WCAG AA+).
*   **Accent Yellow (Golden Hour Yellow):** `#F7C52D`
    *   Use: Subtle highlights, decorative elements, potentially for "Excellent" ratings if visual cues are used. Use sparingly for text backgrounds.
    *   Text on Golden Hour Yellow: `Charcoal Type` (#333333) (WCAG AA+).
*   **Accent Red (ATX Red):** `#D95A49`
    *   Use: For text on light backgrounds or for very specific, high-emphasis elements.
    *   ATX Red text on Paper White: (WCAG AA+).
*   **Background Cream (Paper White):** `#FDFBF4`
    *   Use: Main background for content areas, card/entry backgrounds.
*   **Text Primary (Charcoal Type):** `#333333`
    *   Use: Main body text, headlines. (Excellent contrast on Paper White).
*   **Text Secondary (Slate Grey):** `#5A6268`
    *   Use: Sub-text, captions, placeholder text. (Good contrast on Paper White).
*   **Border/Divider (Line Work Grey):** `#D1D5DB`
    *   Use: Input field borders, subtle section dividers, item separators.
*   **Utility Background (Tinted Blue):** `#F0F5FA` (A light tint of Stoked Blue)
    *   Use: For visually distinct sections like the "At a Glance" box.

### B. Typography

A blend of vintage character and modern readability. All fonts from Google Fonts.

*   **Primary Headings (H1, H2): `League Spartan` (Bold, ExtraBold)**
    *   Usage: Site title, main page titles.
    *   Color: `Charcoal Type` or `Stoked Blue`.
*   **Secondary Headings & Accents (H3, H4, Blockquotes): `Roboto Slab` (Regular, Bold)**
    *   Usage: Spot names, section subheadings (e.g., "Our Take").
    *   Color: `Charcoal Type`.
*   **Body Text & UI Elements: `Inter` (Regular, Medium, SemiBold)**
    *   Usage: Paragraphs, descriptions, form labels, button text, captions.
    *   Color: `Charcoal Type` for primary, `Slate Grey` for secondary.
    *   Line Height: ~1.6 for body copy.

*   **Font Sizing (Mobile Base / Desktop Base - adjust as needed):**
    *   H1: 30px / 42px
    *   H2: 24px / 32px
    *   H3 (Spot Names, Section Titles): 20px / 26px
    *   Body (1rem): 16px
    *   Small/Caption: 14px
    *   Micro/Tags: 12px

### C. Iconography

Simple, clear, outline-style icons. Consider Feather Icons or Phosphor Icons.

*   **Examples:** WiFi, Food (coffee cup/fork-knife), Crowd (users), Power (plug), Map Pin, Search, Filters (funnel), External Link, Chevron.
*   **Color:** `Charcoal Type` or `Slate Grey`. `Stoked Blue` or `Sunset Orange` for active/highlighted states.
*   **Accessibility:** Icons used as interactive elements must have `aria-label` or be accompanied by visible text.

### D. Buttons & Interactive Elements

*   **Primary Buttons (e.g., "Search", "Apply Filters", "Full Spot Profile"):**
    *   Background: `Stoked Blue`. Text: `Paper White`. Font: `Inter` (SemiBold).
    *   Padding: `10px 20px` (mobile), `12px 24px` (desktop). Border Radius: `6px`.
    *   Hover: Slightly darker `Stoked Blue` (e.g., `#226997`).
    *   Focus: `Stoked Blue` with a `2px Golden Hour Yellow` outline offset by `2px`.
*   **Secondary/Link Buttons (e.g., "Clear Filters"):**
    *   Background: `Transparent`. Text: `Stoked Blue`. Font: `Inter` (SemiBold).
    *   Border: `2px solid Stoked Blue` (optional, can be text-only). Border Radius: `6px`.
    *   Hover: Text underline, or light `Stoked Blue` tint background (`#E9F1F8`).
    *   Focus: `Stoked Blue` text with a `2px Stoked Blue` outline offset by `2px`.
*   **Special CTA Button ("Suggest a Spot"):**
    *   Background: `Sunset Orange`. Text: `Paper White`. Font: `Inter` (SemiBold).
    *   Padding & Border Radius: Same as primary.
    *   Hover: Slightly darker `Sunset Orange` (e.g., `#D06B12`).
    *   Focus: `Sunset Orange` with a `2px Stoked Blue` outline offset by `2px`.
*   **Links:**
    *   Text: `Stoked Blue`, `Inter` (Medium). Hover/Focus: Underlined.

### E. Forms

*   **Input Fields (Text, Select):**
    *   Background: `Paper White`. Border: `1px solid Line Work Grey`.
    *   Text: `Charcoal Type`, `Inter` (Regular). Padding: `10px 12px`. Border Radius: `4px`.
    *   Focus: Border color `Stoked Blue`, `2px` thick.
    *   Labels: `Inter` (Medium), `Charcoal Type`, positioned above inputs.

### F. Layout & Spacing

*   **Base Unit:** `8px`. All spacing (margins, paddings) should be multiples of this.
*   **Grid:** Use CSS Flexbox or Grid.
*   **Max Content Width (Desktop):** `~900px` for single-column guidebook style, `~1100px` for detail pages with more complex layouts.

### G. Accessibility Principles

*   **Color Contrast:** Adhere to WCAG AA for text and interactive elements.
*   **Keyboard Navigation:** All interactive elements fully navigable and operable.
*   **Focus States:** Clearly defined for all interactive elements.
*   **Semantic HTML:** Use appropriate tags (`<nav>`, `<main>`, `<article>`, etc.).
*   **ARIA Attributes:** Use where necessary (e.g., `aria-live` for search results, `aria-label` for icon buttons).
*   **Image `alt` Text:** Mandatory and descriptive.

## 3. Page Descriptions

### Shared Components (`Layout.tsx`)

*   **Header:**
    *   Background: `Paper White`. Bottom Border: `1px solid Line Work Grey`.
    *   Padding: `16px` vertical, `24px` horizontal.
    *   **Site Title ("Austin Remote Work Spot Finder"):**
        *   Font: `League Spartan` (Bold), `Stoked Blue`. Size: H2 (Desktop), H3 (Mobile).
        *   Link: To homepage (`/`). Alignment: Left.
    *   **"Suggest a Spot" Link/Button:**
        *   Style: Special CTA Button (`Sunset Orange` background). Alignment: Right.
        *   Mobile: May stack below title or remain right if space allows.
*   **Footer:**
    *   Background: `Slate Grey`. Text: `Paper White` (or light grey `#E2E8F0`).
    *   Font: `Inter` (Regular), 14px.
    *   Content: "© [Year] Austin Remote Work Spot Finder. Happy WFH-away-from-home!"
    *   Padding: `24px` vertical, `24px` horizontal. Alignment: Centered text.

### Homepage: Spot Listing View (`/`) - "Annotated Guidebook Entry" Layout

*   **Purpose:** Browse, search, and filter remote work spots using a rich, informative single-column list.
*   **Overall Structure (Mobile First):**
    1.  Header
    2.  Search & Filter Section
    3.  Spot List Area (Single column of "Guidebook Entries") / "No Results" Message
    4.  Footer

*   **Search & Filter Section:**
    *   Background: `Paper White` or `Utility Background (Tinted Blue)`. Padding: `16px`.
    *   Border Radius: `8px` (if using a distinct background).
    *   Arrangement:
        *   Mobile: Search input full-width. Filters below, potentially stacked.
        *   Desktop: Horizontal bar. Search input on left, filter dropdowns to its right, then "Apply" and "Clear" buttons.
    *   **Keyword Search Input (`<input type="search">`):**
        *   Label: "Search by Name" (visually hidden or above). Placeholder: "e.g., Merit Coffee, Central Library".
        *   Icon: Magnifying glass icon inside or next to the input.
        *   Accompanied by a Primary Button: "Search".
    *   **Filter Controls (`<select>`):**
        *   Labels: "WiFi", "Food", "Crowd" (above each dropdown).
        *   Options: `wifi_quality`: "Excellent", "Good"; `food_available`: "Yes", "No"; `crowd_level_typical`: "Quiet", "Moderate".
    *   **Action Buttons for Filters:**
        *   "Apply Filters" (Primary Button).
        *   "Clear Filters" (Secondary/Link Button): Links to `/`.

*   **Spot List Area:**
    *   **"No Spots Found" Message:**
        *   Text: "No spots found matching your search. Try a different keyword or adjust your filters!"
        *   Font: `Inter` (Regular), `Charcoal Type`. Centered. Displayed conditionally.
    *   **Individual Spot Entry (Guidebook Style):**
        *   Container: `article` tag. Background: `Paper White`. Padding: `16px` (mobile), `20px` (desktop).
        *   Separation: `margin-bottom: 24px` or `32px`. Optionally, a `1px solid Line Work Grey` horizontal rule between entries.
        *   **Structure per Spot:**
            1.  **Spot Name (`name`):**
                *   Font: `Roboto Slab` (Bold), H3 size (e.g., 20px mobile / 24px desktop), `Charcoal Type`.
                *   `margin-bottom: 4px`.
            2.  **Address (`address`) & Neighborhood (`neighborhood`):**
                *   Font: `Inter` (Regular), 15px, `Slate Grey`.
                *   Display: Address on one line, Neighborhood below or inline if space allows.
                *   `margin-bottom: 12px`.
            3.  **"At a Glance" Box:**
                *   Container: `div` or `aside`. Background: `Utility Background (Tinted Blue) #F0F5FA`.
                *   Padding: `12px`. Border Radius: `4px`. `margin-bottom: 16px`.
                *   Heading (Optional, small): "Key Info" (`Inter` SemiBold, 12px, `Slate Grey`).
                *   Content: List (`ul`) of key-value pairs. `Inter` (Regular), 14px.
                    *   Labels (e.g., "WiFi:", "Food:", "Crowd:", "Power:"): `Inter` (SemiBold), `Charcoal Type`.
                    *   Values: `Inter` (Regular), `Charcoal Type`. Include short notes from `wifi_notes`, `food_notes`, `crowd_notes` if concise.
                        *   Example: `<li><strong>WiFi:</strong> Excellent (Password on receipt)</li>`
                        *   Example: `<li><strong>Food:</strong> Yes (Coffee & pastries only)</li>`
                        *   Example: `<li><strong>Crowd:</strong> Moderate (Usually busy mornings)</li>`
                        *   Example: `<li><strong>Power:</strong> Some</li>`
            4.  **"Our Take" Section (from `description_admin`):**
                *   Heading: "Our Take ✨" or "Why We Dig It" (`Roboto Slab` (Bold), 16px mobile / 18px desktop, `Charcoal Type` or `Sunset Orange`). `margin-bottom: 6px`.
                *   Text: `Inter` (Regular), 15px, `Charcoal Type`. Display 2-3 sentences.
                *   `margin-bottom: 16px`.
            5.  **Optional Thumbnail Photo (`main_photo_url`):**
                *   If used: Small (e.g., 80x80px or 100x75px), `float: right` or integrated thoughtfully. Rounded corners. `alt` text: "[Spot Name]".
                *   Consideration: May be omitted from list view to keep entries text-focused and compact, deferring visuals to detail page.
            6.  **Call to Action Button:**
                *   Text: "Full Spot Profile & Directions →" or "View Details & Map →".
                *   Style: Primary Button. Full width on mobile if desired, or aligned left/right on desktop.

### Spot Detail Page (`/spots/:slug`)

*   **Purpose:** Display comprehensive information about a single remote work spot.
*   **Layout (Mobile First, Single Column Flowing):**
    1.  Header
    2.  Spot Name (`name`) - H1, `League Spartan` (Bold), `Charcoal Type`.
    3.  Main Photo (`main_photo_url`) - Large, responsive image. Rounded corners (`8px`). `alt` text: "Photo of [Spot Name]". `margin-top: 16px; margin-bottom: 16px;`
    4.  Address (`address`) & Neighborhood (`neighborhood`) - `Inter` (Regular), `Charcoal Type` for address, `Slate Grey` for neighborhood. `margin-bottom: 20px;`
    5.  Map Area - `margin-bottom: 24px;`
        *   If `map_iframe_url`: Embed iframe, responsive. Border: `1px solid Line Work Grey`.
        *   Else if `latitude`, `longitude`: Link "View on Google Maps" (Primary Button style, or Link style with map icon).
        *   Else: "Map not available" (`Inter` (Regular), `Slate Grey`).
    6.  **Detailed Information Section:** `margin-top: 24px`. Use clear key-value pairs or small subheadings.
        *   Each item: Label (`Inter` SemiBold, `Charcoal Type`), Value (`Inter` Regular, `Charcoal Type`).
        *   `wifi_quality`, `wifi_notes`
        *   `food_available` (as "Yes" or "No"), `food_notes`
        *   `crowd_level_typical`, `crowd_notes`
        *   `power_outlets`
        *   `other_amenities_text`
        *   `hours_of_operation_text`
        *   `website_url` (as a clickable link: "[Spot Name] Website" with external link icon)
        *   `phone_number` (as a clickable `tel:` link)
    7.  **Admin's Description (`description_admin`) - "Our Full Take":** `margin-top: 24px`.
        *   Heading: "Our Full Take 📝" or "The Full Scoop" (`Roboto Slab` (Bold), H3 size, `Charcoal Type`).
        *   Text: `Inter` (Regular), `Charcoal Type`. Full description.
    8.  **Last Verified Note:** `margin-top: 24px; margin-bottom: 32px;`
        *   Text: "Info last verified: [formatted `date_last_verified_admin`]."
        *   Font: `Inter` (Regular), 14px, `Slate Grey`.
    9.  Footer

### "Suggest a Spot" Link

*   **Location:** Prominently in the site Footer (as a Special CTA Button).
*   **Functionality:** Links to an external Fillout form URL (provided by admin). Opens in a new tab/window.

## 4. General Styling, Responsiveness, and Accessibility (MVP Task 8)

*   **Styling:** Apply the "Super Stoked System" consistently. Aim for a clean, professional, yet characterful look. Use whitespace effectively.
*   **Responsiveness:**
    *   Ensure the single-column "Annotated Guidebook Entry" layout on the homepage reflows gracefully on all screen sizes. Text should remain readable, buttons accessible.
    *   The Spot Detail Page should adapt well, with images resizing and text wrapping appropriately.
    *   Test on common mobile (e.g., 360px, 375px, 414px widths), tablet (e.g., 768px), and desktop (e.g., 1024px, 1280px+) viewport sizes.
*   **Accessibility:**
    *   **Semantic HTML:** Use `<header>`, `<footer>`, `<nav>`, `<main>`, `<article>` (for each spot entry), `<aside>` (for "At a Glance" box if appropriate), `<button>`, `<a>` correctly.
    *   **Color Contrast:** Double-check all text/background combinations using a contrast checker.
    *   **Keyboard Navigation:** Ensure all interactive elements (links, buttons, form inputs, select dropdowns) are focusable and operable via keyboard.
    *   **Focus States:** Implement the defined focus states from the Design System.
    *   **Image `alt` Text:** Ensure all `main_photo_url` images have descriptive alt text (e.g., "Photo of [Spot Name] showing its interior seating").
    *   **Forms:** Associate labels with inputs correctly.
    *   **ARIA:** Use `aria-live="polite"` for search result updates. Use `aria-label` for icon-only buttons.

This comprehensive design document should provide your developer with all the necessary details to build a fantastic and joy-to-use Austin Remote Work Spot Finder!