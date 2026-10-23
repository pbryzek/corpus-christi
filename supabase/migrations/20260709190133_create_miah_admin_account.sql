-- Create Miah's admin account (miahamcc@gmail.com) and grant admin access.
--
-- Sets up an email/password login with the temporary password below.
-- Email is pre-confirmed so no verification step is required.
-- The user is added to public.admins, which is what is_admin() checks
-- for full edit access to bulletins, pages, and every CMS table.

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'miahamcc@gmail.com') THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      last_sign_in_at,
      is_super_admin
    )
    VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'miahamcc@gmail.com',
      crypt('MiahCC2026!', gen_salt('bf')),
      now(),
      '',
      '',
      '',
      '',
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      now(),
      now(),
      null,
      false
    );

    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    )
    VALUES (
      gen_random_uuid(),
      new_user_id,
      jsonb_build_object('sub', new_user_id::text, 'email', 'miahamcc@gmail.com', 'email_verified', true),
      'email',
      new_user_id::text,
      now(),
      now(),
      now()
    );

    INSERT INTO public.admins (user_id) VALUES (new_user_id);
  END IF;
END $$;
