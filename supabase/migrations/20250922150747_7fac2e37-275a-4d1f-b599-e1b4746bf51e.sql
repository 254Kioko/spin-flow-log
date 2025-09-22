-- Test and fix RLS policies for laundry_orders
-- First, let's see current policies
SELECT policyname, cmd, permissive, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'laundry_orders';

-- Drop all existing policies and recreate them properly
DROP POLICY IF EXISTS "Public can submit orders" ON public.laundry_orders;
DROP POLICY IF EXISTS "Allow insert for all" ON public.laundry_orders;
DROP POLICY IF EXISTS "Allow select for admins" ON public.laundry_orders;
DROP POLICY IF EXISTS "Allow update for admins" ON public.laundry_orders;
DROP POLICY IF EXISTS "Allow full access for service_role" ON public.laundry_orders;

-- Create proper policies
CREATE POLICY "Enable insert for all users" 
ON public.laundry_orders 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Enable select for admins" 
ON public.laundry_orders 
FOR SELECT 
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enable update for admins" 
ON public.laundry_orders 
FOR UPDATE 
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Enable all for service_role" 
ON public.laundry_orders 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);