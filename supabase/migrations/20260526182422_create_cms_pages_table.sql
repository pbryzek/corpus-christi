/*
  # Create CMS Pages Table

  ## Summary
  Creates a content management system for parish pages, allowing admins to create,
  edit, publish, and delete custom pages that appear on the website.

  ## New Tables

  ### `cms_pages`
  - `id` (uuid, primary key) - Unique identifier
  - `slug` (text, unique, not null) - URL-friendly identifier used in the page route (e.g. "welcome", "youth-ministry")
  - `title` (text, not null) - Page heading displayed at the top
  - `subtitle` (text) - Optional subheading below the title
  - `body` (text) - Main page content (supports plain text with paragraph breaks)
  - `hero_image_url` (text) - Optional URL for the page hero/banner image
  - `is_published` (boolean, default false) - Whether the page is visible to the public
  - `show_in_nav` (boolean, default false) - Whether to show a link in the site navigation
  - `nav_label` (text) - Label to display in navigation (defaults to title)
  - `meta_description` (text) - SEO description for the page
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last modification timestamp

  ## Security
  - RLS enabled on `cms_pages`
  - Public can SELECT only published pages (is_published = true)
  - Authenticated staff can SELECT all pages (including drafts)
  - Authenticated staff can INSERT, UPDATE, DELETE pages
*/

CREATE TABLE IF NOT EXISTS cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  body text,
  hero_image_url text,
  is_published boolean NOT NULL DEFAULT false,
  show_in_nav boolean NOT NULL DEFAULT false,
  nav_label text,
  meta_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Anyone can view published pages"
  ON cms_pages FOR SELECT
  TO anon
  USING (is_published = true);

-- Authenticated staff can read all pages (including drafts)
CREATE POLICY "Authenticated staff can view all pages"
  ON cms_pages FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

-- Authenticated staff can create pages
CREATE POLICY "Authenticated staff can create pages"
  ON cms_pages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated staff can update pages
CREATE POLICY "Authenticated staff can update pages"
  ON cms_pages FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Authenticated staff can delete pages
CREATE POLICY "Authenticated staff can delete pages"
  ON cms_pages FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);
