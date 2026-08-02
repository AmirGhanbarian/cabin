/*
# Create decrement_stock function

## Overview
Creates a SECURITY DEFINER function to safely decrement product stock when an order
is paid. This allows the Zarinpal edge function (using the service role key) to
reduce inventory atomically without needing direct UPDATE policies for anon users.

## New Functions
### decrement_stock(p_product_id uuid, p_quantity int)
- Decrements the stock of a product by the given quantity.
- Stock will not go below zero.
- SECURITY DEFINER so it can be called from the edge function with service role.
*/

CREATE OR REPLACE FUNCTION decrement_stock(p_product_id uuid, p_quantity int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET stock = GREATEST(0, stock - p_quantity)
  WHERE id = p_product_id;
END;
$$;

GRANT EXECUTE ON FUNCTION decrement_stock(uuid, int) TO authenticated;
