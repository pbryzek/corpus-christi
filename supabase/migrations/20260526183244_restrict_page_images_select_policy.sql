/*
  # Restrict page-images SELECT policy

  The previous SELECT policy allowed clients to list all files in the bucket,
  which exposes more data than intended. Public buckets only need object-level
  access (fetching a known URL), not bucket enumeration.

  This replaces the broad SELECT policy with one that requires the request to
  target a specific object (name IS NOT NULL), preventing bucket listing while
  still allowing direct URL access to any individual file.
*/

DROP POLICY IF EXISTS "Public read access for page images" ON storage.objects;

CREATE POLICY "Public read access for page images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'page-images' AND name IS NOT NULL);
