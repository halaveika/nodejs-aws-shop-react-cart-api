INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, 'a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, CURRENT_DATE, CURRENT_DATE, 'OPEN'),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, 'b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, CURRENT_DATE, CURRENT_DATE, 'ORDERED');

INSERT INTO cart_items (cart_id, product_id, count)
VALUES
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80aa'::uuid, 20),
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a1'::uuid, 10),
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a3'::uuid, 5),
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-48c5-9345-fc73348a80a1'::uuid, 15),
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a2'::uuid, 23),
  ('a28dcf42-b10c-48c5-9345-fc73c48a80aa'::uuid, '7567ec4b-b10c-45c5-9345-fc73c48a80a1'::uuid, 15),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80aa'::uuid, 8),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a1'::uuid, 10),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a3'::uuid, 23),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-48c5-9345-fc73348a80a1'::uuid, 15),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-48c5-9345-fc73c48a80a2'::uuid, 23),
  ('b38dcf42-b10c-48c5-9345-fc73c48a80a1'::uuid, '7567ec4b-b10c-45c5-9345-fc73c48a80a1'::uuid, 15);

COMMIT;