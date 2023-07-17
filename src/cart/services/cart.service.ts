import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { Cart, CartItem } from '../models';

@Injectable()
export class CartService {
  private client: Client;

  constructor() {
    this.client = new Client({
      user: process.env.PG_DB_USER || '',
      host: process.env.PG_DB_HOST || '',
      database: process.env.PG_DB_DATABASE || '',
      password: process.env.PG_DB_PASSWORD || '',
      port: process.env.PG_DB_PORT ? parseInt(process.env.PG_DB_PORT) : 5432,
    });

    this.client.connect();
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    console.log('findByUserId', userId)
    const query = 'SELECT * FROM carts WHERE user_id = $1';
    const values = [userId];

    try {
      const result = await this.client.query(query, values);
      const cart = result.rows[0];

      if (cart) {
        const cartItems = await this.getCartItems(cart.id);
        cart.items = cartItems;
      }

      return cart || null;
    } catch (error) {
      console.error('Error retrieving cart:', error);
      return null;
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    const cartId = uuidv4();
    const createdAt = new Date();
    const updatedAt = createdAt;
    const status = 'OPEN';

    const query = 'INSERT INTO carts (id, user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4, $5)';
    const values = [cartId, userId, createdAt, updatedAt, status];

    try {
      await this.client.query(query, values);
      return { id: cartId, items: [] };
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const existingCart = await this.findByUserId(userId);

    if (existingCart) {
      return existingCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, updatedCart: Cart): Promise<Cart | null> {
    const existingCart = await this.findByUserId(userId);

    if (!existingCart) {
      return null;
    }

    const { id, ...rest } = updatedCart;
    const updatedAt = new Date();
    const query = 'UPDATE carts SET updated_at = $1 WHERE id = $2';
    const values = [updatedAt, id];

    try {
      await this.client.query(query, values);
      return { id, ...rest };
    } catch (error) {
      console.error('Error updating cart:', error);
      return null;
    }
  }

  async removeByUserId(userId: string): Promise<void> {
    const query = 'DELETE FROM carts WHERE user_id = $1';
    const values = [userId];

    try {
      await this.client.query(query, values);
    } catch (error) {
      console.error('Error removing cart:', error);
      throw error;
    }
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    const query = 'SELECT * FROM cart_items WHERE cart_id = $1';
    const values = [cartId];

    try {
      const result = await this.client.query(query, values);
      return result.rows;
    } catch (error) {
      console.error('Error retrieving cart items:', error);
      return [];
    }
  }
}
