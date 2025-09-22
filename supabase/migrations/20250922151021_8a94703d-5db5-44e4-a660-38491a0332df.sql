-- Fix the laundry_orders table structure and ensure proper auto-increment
-- Create sequence for id if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'laundry_orders_id_seq') THEN
        CREATE SEQUENCE public.laundry_orders_id_seq;
        -- Set the sequence to start from the next available number
        PERFORM setval('public.laundry_orders_id_seq', COALESCE((SELECT MAX(id) FROM public.laundry_orders), 0) + 1);
        -- Set the default value for the id column
        ALTER TABLE public.laundry_orders ALTER COLUMN id SET DEFAULT nextval('public.laundry_orders_id_seq');
        -- Make sure the sequence is owned by the column
        ALTER SEQUENCE public.laundry_orders_id_seq OWNED BY public.laundry_orders.id;
    END IF;
END $$;

-- Test that insertion works by trying a sample insert and then deleting it
INSERT INTO public.laundry_orders (name, contact, clothes, status) 
VALUES ('Test User', '1234567890', 'Test Item', 'Pending');

-- Get the inserted ID for cleanup
WITH test_record AS (
    SELECT id FROM public.laundry_orders 
    WHERE name = 'Test User' AND contact = '1234567890' 
    ORDER BY created_at DESC 
    LIMIT 1
)
DELETE FROM public.laundry_orders 
WHERE id IN (SELECT id FROM test_record);