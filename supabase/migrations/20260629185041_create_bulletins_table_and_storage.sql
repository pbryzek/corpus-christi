-- Storage bucket for bulletin PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('bulletins', 'bulletins', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "bulletins_public_read"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'bulletins');

CREATE POLICY "bulletins_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'bulletins');

CREATE POLICY "bulletins_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'bulletins');

-- Bulletins metadata table
CREATE TABLE bulletins (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  published_date date NOT NULL,
  file_url    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE bulletins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bulletins_select_public" ON bulletins FOR SELECT
  TO anon, authenticated USING (true);

CREATE POLICY "bulletins_insert_admin" ON bulletins FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "bulletins_update_admin" ON bulletins FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "bulletins_delete_admin" ON bulletins FOR DELETE
  TO authenticated USING (true);

-- Seed the existing June 21 bulletin
INSERT INTO bulletins (title, published_date, file_url)
VALUES ('Twelfth Sunday in Ordinary Time', '2026-06-21', '/bulletins/june21_(1).pdf');
