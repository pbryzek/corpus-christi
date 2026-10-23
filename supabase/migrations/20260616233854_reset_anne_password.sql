UPDATE auth.users
SET encrypted_password = crypt('CorpusChristi2026!', gen_salt('bf'))
WHERE email = 'annezehren@mac.com';