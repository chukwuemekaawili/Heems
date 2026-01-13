-- Create Admin Account for techfieldstechnologies@gmail.com
-- Run this in Supabase SQL Editor

-- IMPORTANT: First, you need to sign up at http://localhost:5173/signup
-- Use email: techfieldstechnologies@gmail.com
-- Then come back and run this script

-- Step 1: Check if you have signed up (check auth.users)
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'techfieldstechnologies@gmail.com';

-- If you see a result above, copy the 'id' and use it below
-- If no result, go sign up first at /signup

-- Step 2: Update the profile role to admin
-- Replace 'YOUR_USER_ID' with the id from Step 1
UPDATE profiles 
SET role = 'admin'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email = 'techfieldstechnologies@gmail.com'
);

-- Step 3: Verify the update worked
SELECT p.id, au.email, p.full_name, p.role, p.created_at 
FROM profiles p
JOIN auth.users au ON p.id = au.id
WHERE au.email = 'techfieldstechnologies@gmail.com';

-- You should see role = 'admin' in the result

-- Alternative: If profile doesn't exist, create it manually
-- (Only use this if you've already signed up but profile wasn't created)
/*
INSERT INTO profiles (id, full_name, role)
SELECT id, 'Admin User', 'admin'
FROM auth.users 
WHERE email = 'techfieldstechnologies@gmail.com'
ON CONFLICT (id) DO UPDATE 
SET role = 'admin';
*/
