import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models';

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
    const query = `
      SELECT id, items
      FROM carts
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      const { rows } = await this.client.query(query, values);

      if (rows.length === 0) {
        return null;
      }

      const { id, items } = rows[0];

      return { id, items };
    } catch (error) {
      throw new Error(`Error retrieving cart for user ${userId}: ${error}`);
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    const id = uuidv4();
    const query = `
      INSERT INTO carts (id, user_id, items)
      VALUES ($1, $2, $3);
    `;
    const values = [id, userId, []];

    try {
      await this.client.query(query, values);

      return { id, items: [] };
    } catch (error) {
      throw new Error(`Error creating cart for user ${userId}: ${error}`);
    }
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);

    if (cart) {
      return cart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);

    const query = `
      UPDATE carts
      SET items = $1
      WHERE id = $2;
    `;
    const values = [items, cart.id];

    try {
      await this.client.query(query, values);

      return { ...cart, items: [...items] };
    } catch (error) {
      throw new Error(`Error updating cart for user ${userId}: ${error}`);
    }
  }

  async removeByUserId(userId: string): Promise<void> {
    const query = `
      DELETE FROM carts
      WHERE user_id = $1;
    `;
    const values = [userId];

    try {
      await this.client.query(query, values);
    } catch (error) {
      throw new Error(`Error removing cart for user ${userId}: ${error}`);
    }
  }
}
