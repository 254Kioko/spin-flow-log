-- Fix RLS policy for laundry_orders to allow public submissions
-- Drop the existing insert policy that's not working
DROP POLICY IF EXISTS "Allow insert for all" ON public.laundry_orders;

-- Create a new policy that explicitly allows anyone (including anonymous users) to insert
CREATE POLICY "Public can submit orders" 
ON public.laundry_orders 
FOR INSERT 
WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.laundry_orders ENABLE ROW LEVEL SECURITY;