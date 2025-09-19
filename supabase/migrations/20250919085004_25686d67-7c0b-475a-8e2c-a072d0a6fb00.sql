-- Fix the id column to auto-increment
CREATE SEQUENCE IF NOT EXISTS laundry_orders_id_seq;
ALTER TABLE laundry_orders ALTER COLUMN id SET DEFAULT nextval('laundry_orders_id_seq');
ALTER SEQUENCE laundry_orders_id_seq OWNED BY laundry_orders.id;