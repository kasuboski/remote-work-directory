export interface PlaceFrontmatter {
  name: string;
  slug: string;
  address: string;
  neighborhood?: string;
  google_places_id?: string;
  wifi_quality: "Excellent" | "Good" | "Fair" | "Poor" | "Unknown";
  wifi_notes?: string;
  food_available: boolean;
  food_notes?: string;
  crowd_level_typical: "Quiet" | "Moderate" | "Busy" | "Varies" | "Unknown";
  crowd_notes?: string;
  power_outlets: "Plenty" | "Some" | "Few" | "None" | "Unknown";
  other_amenities_text?: string;
  description_admin?: string;
  main_photo_url?: string;
  hours_of_operation_text?: string;
  website_url?: string;
  phone_number?: string;
  date_last_verified_admin: string;
  is_published: boolean;
}

export interface ParsedPlace extends PlaceFrontmatter {
  content: string;
}
