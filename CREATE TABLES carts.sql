CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  created_at DATE NOT NULL,
  updated_at DATE NOT NULL,
  status VARCHAR(10)
);

CREATE TABLE IF NOT EXISTS cart_items (
  cart_id UUID,
  product_id UUID,
  count INT
);
