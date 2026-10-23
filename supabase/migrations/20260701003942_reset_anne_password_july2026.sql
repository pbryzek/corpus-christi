UPDATE auth.users
SET encrypted_password = crypt('CorpusChristi2026!', gen_salt('bf'))
WHERE id = '015714af-8a2b-418d-bd38-0f62ff0cc3cd';