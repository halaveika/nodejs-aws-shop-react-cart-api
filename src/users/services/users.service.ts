import { Injectable } from '@nestjs/common';
import { Client } from 'pg';
import { v4 } from 'uuid';
import { User } from '../models';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UsersService {
  private readonly client: Client;

  constructor() {
    this.client = new Client({
      user: process.env.PG_DB_USER || process.env.EB_PG_DB_USER,
      host: process.env.PG_DB_HOST || process.env.EB_PG_DB_HOST,
      database: process.env.PG_DB_DATABASE || process.env.EB_PG_DB_DATABASE,
      password: process.env.PG_DB_PASSWORD || process.env.EB_PG_DB_PASSWORD,
      port: process.env.PG_DB_PORT ? parseInt(process.env.PG_DB_PORT) : 5432,
    });

    this.client.connect();
  }

  async findOne(userId: string): Promise<User> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [userId];
    const result = await this.client.query(query, values);

    if (result.rows.length > 0) {
      return result.rows[0];
    }

    return null;
  }

  async findOneByName(name: string): Promise<User> {
    const query = 'SELECT * FROM users WHERE name = $1';
    const values = [name];
    const result = await this.client.query(query, values);

    if (result.rows.length > 0) {
      console.log('findOneByName',result.rows[0]);
      return result.rows[0];
    }

    return null;
  }

  async createOne({ name, password }: User): Promise<User> {
    const id = v4();
    const query = 'INSERT INTO users (id, name, password) VALUES ($1, $2, $3)';
    const values = [id, name, password];
    await this.client.query(query, values);

    const newUser: User = { id, name, password };
    return newUser;
  }
}
