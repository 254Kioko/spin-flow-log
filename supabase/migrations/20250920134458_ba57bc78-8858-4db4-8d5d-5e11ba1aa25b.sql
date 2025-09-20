-- Add missing UPDATE policy for laundry_orders table
CREATE POLICY "Allow update for all" 
ON public.laundry_orders 
FOR UPDATE 
USING (true);