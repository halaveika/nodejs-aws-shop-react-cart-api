import { Module } from '@nestjs/common';
import { OrderModule } from '../order/order.module';
import { CartController } from './cart.controller';
import { CartService } from './services';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [ OrderModule, UsersModule ],
  providers: [ CartService ],
  controllers: [ CartController ]
})
export class CartModule {}
