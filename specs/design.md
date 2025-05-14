# Austin Remote Work Spot Finder - Design System (MVP)

## 1. Introduction & Vibe
The website should feel **Reliable, Friendly, and Professional**, with a **cozy welcoming vibe**. It is designed for remote workers, students, and freelancers in Austin seeking productive and comfortable work locations.

## 2. Target Audience
Primary: Remote workers (freelancers, employees of remote-first companies, entrepreneurs) residing in Austin, TX.
Secondary: Students, digital nomads visiting Austin, or anyone looking for a temporary workspace.

## 3. Color Palette
*   **Primary Text/Button:** `#333333` (Dark Gray - for main text, headings, primary buttons)
*   **Secondary Background:** `#cce0ff` (Soft Blue - can be used for alternating card backgrounds or specific sections)
*   **Accent:** `#007bff` (Vibrant Blue - for interactive elements like borders on focus, links, or highlights)
*   **Neutral - Background:** `#f8f5f0` (Soft Peachy/Beige - main page background color)
*   **Neutral - Element Background:** `#ffffff` (White - for cards, input fields, and other prominent elements)
*   **Neutral - Borders/Dividers:** `#cccccc` (Light Gray - for borders, rules, and subtle separators)
*   **Neutral - Small Text/Caption:** `#6c757d` (Medium Gray - for less prominent text)

*   **Semantic - Excellent/Yes/Quiet:** `#28a745` (Green)
*   **Semantic - Good/Moderate/Some:** `#ffc107` (Yellow/Orange)
*   **Semantic - Fair/Few/Busy:** `#fd7e14` (Orange/Reddish-Orange)
*   **Semantic - Poor/None:** `#dc3545` (Red)
*   **Semantic - Unknown:** `#6c757d` (Gray - same as Small Text for simplicity)

## 4. Typography
*   **Font Family:** Rubik (Used for all text elements - Headings and Body)
    *   [Link to Rubik on Google Fonts](https://fonts.google.com/specimen/Rubik)

*   **H1 (Page Title):** Font: Rubik, Size: `36px`, Weight: `Bold`, Color: Primary Text/Button (`#333333`)
*   **H2 (Section Title / Spot Name):** Font: Rubik, Size: `24px`, Weight: `Semi-Bold`, Color: Primary Text/Button (`#333333`)
*   **Body Text (Paragraphs, Descriptions):** Font: Rubik, Size: `18px`, Weight: `Regular`, Color: Primary Text/Button (`#333333`)
*   **Small Text / Caption:** Font: Rubik, Size: `14px`, Weight: `Regular`, Color: Neutral - Small Text/Caption (`#6c757d`)

## 5. Spacing
*   **Base Unit:** `8px`
*   All padding, margins, and gaps between elements should be multiples of this base unit (e.g., 8px, 16px, 24px, 32px, 40px, 48px). This creates a consistent and clean layout with comfortable whitespace.

## 6. Components

### 6.1. Buttons
*   **Primary Button (e.g., "Suggest a Spot", "Start Free Trial" in reference):**
    *   Appearance: Solid fill with **Primary Text/Button Color (`#333333`)**.
    *   Text Color: **White (`#ffffff`)**.
    *   Border Radius: `8px` (using the base spacing unit).
    *   Padding: `16px` horizontal, `12px` vertical.
    *   Hover State: Background color darkens slightly (e.g., to a darker shade of `#333333`).

*   **Secondary Button (if needed, e.g., "Book a demo" in reference):**
    *   Appearance: White background, `1px` solid border using **Primary Text/Button Color (`#333333`)**.
    *   Text Color: **Primary Text/Button Color (`#333333`)**.
    *   Border Radius: `8px`.
    *   Padding: `16px` horizontal, `12px` vertical.
    *   Hover State: Background color changes slightly (e.g., to Neutral Background `#f8f5f0`).

### 6.2. Input Fields & Dropdowns (Search, Filters)
*   **Appearance:** **White (`#ffffff`) background**. `1px` solid border using **Neutral - Borders/Dividers Color (`#cccccc`)**.
*   Border Radius: `8px`.
*   Padding: `12px` vertical, `16px` horizontal.
*   Text Color: Primary Text/Button Color (`#333333`).
*   Placeholder Text Color: Neutral - Small Text/Caption Color (`#6c757d`).
*   Focus State: Border color changes to the **Accent Color (`#007bff`)**.

### 6.3. Spot Card (List View Item)
*   **Overall Appearance:** Rectangular card with **White (`#ffffff`) background**. `1px` solid border using **Neutral - Borders/Dividers Color (`#cccccc`)**.
*   **Information Display:**
    *   Name: Displayed using **H2 typography style**.
    *   Neighborhood: Displayed using **Small Text typography style**, placed below the Name.
    *   Thumbnail Image (`main_photo_url`): Positioned logically (e.g., at the top of the card). Should have a fixed height (e.g., `150px`) and use `object-fit: cover` to maintain aspect ratio.
    *   Key Indicators (WiFi, Food, Power): Displayed as **colored "pills" with icons and text labels**.
        *   Pill Background Color: Based on the **Semantic Colors** corresponding to the status (e.g., Green for Excellent WiFi).
        *   Pill Text Color: Use **Primary Text/Button Color (`#333333`)** if the background is light, or **White (`#ffffff`)** if the background is dark, to ensure sufficient contrast.
        *   Pill Content: Include the relevant **Lucide icon** and a short text label (e.g., "Excellent", "Yes", "Plenty").
        *   Pill Styling: Padding of `8px` horizontal and `4px` vertical. High border-radius (e.g., `999px` or `50%`) for a pill shape.
    *   Spacing: Use multiples of the **8px base unit** for all internal spacing between elements (image, name, neighborhood, indicators, etc.).
*   Hover State: Background color changes slightly to the **Neutral - Background Color (`#f8f5f0`)** to indicate it's clickable.

### 6.4. Filters
*   Appearance: Styled as **Dropdown menus**, following the **Input Field styling**.
*   Location: Positioned near the Search bar on the Homepage.

### 6.5. Typography Styles
(Defined in Section 4)

### 6.6. Map Embed (on Detail Page)
*   Appearance: Should fill the width of its container.
*   Border/Shadow: Include a `1px` solid border using the **Neutral - Borders/Dividers Color (`#cccccc`)**.

## 7. Iconography
*   **Library:** Heroicons (heroicons.com)
*   **Style:** Use the Solid variant of Heroicons
*   **Implementation:** Icons are implemented as JSX components using the SVG paths from Heroicons. To add a new icon:
    1. Go to heroicons.com
    2. Select the Solid variant of the desired icon
    3. Copy the SVG path
    4. Create a new component in `src/components/icons` following the existing pattern
*   **Essential Icons:**
    *   WiFi Quality: WiFi icon
    *   Food Available: Fork+Knife icon
    *   Crowd Level: Users icon
    *   Search: Magnifying Glass icon
    *   Filter: Funnel icon
    *   Map Pin: Map Pin icon
    *   Suggest a Spot: Plus icon

## 8. Layouts & Responsiveness

### 8.1. Homepage / List View
*   **Desktop Layout:** Search bar across the top, followed by Filters. The list of Spot Cards displayed in a grid below, aiming for 3-4 cards per row on larger screens. Use 8px multiples for spacing between search, filters, and the grid.
*   **Mobile Layout:** Search bar and Filters should stack vertically or be presented in a mobile-friendly manner (e.g., filters collapsible). The Spot Card grid should adapt to display fewer cards per row, likely 1 card per row on typical mobile phone screens, and potentially 2 per row on tablets.

### 8.2. Spot Detail View
*   **Desktop Layout:** A two-column layout. One column contains the embedded Map (and potentially the main photo). The other column contains all the detailed information (Name, Address, WiFi details, Food details, etc.) structured into clear sections. Use 8px multiples for the gap between columns and spacing within sections.
*   **Mobile Layout:** The two-column layout should collapse into a single-column stack. The Map (and main photo) should appear first, followed by all the detailed sections stacked vertically. Each section should have clear headings (H2) and appropriate internal spacing (multiples of 8px).

## 9. Interaction Design (Basic)
*   Clicking on a Spot Card navigates the user to the Spot Detail View for that location.
*   Applying filters or performing a search updates the list of Spot Cards displayed on the Homepage.
*   Interactive elements (buttons, input fields, spot cards) should have visual feedback on hover and focus as described in the Components section.
*   The "Suggest a Spot" link/button opens the Fillout form (external link or embedded iframe).