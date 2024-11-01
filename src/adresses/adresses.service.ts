import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entites/user.entity';
import { CreateAddressDto } from './dto/CreateAdress.dto';
import { EntityManager } from 'typeorm';
import { Address } from './entities/address.entity';

@Injectable()
export class AdressesService {
  constructor(private readonly manager: EntityManager) {}

  async create(dto: CreateAddressDto): Promise<any> {
    const user = await this.manager.findOne(User, {
      where: { id: dto.userId },
      relations: {
        meta: {
          addresses: true,
        },
      },
    });

    const newAddress = this.manager.create(Address, {
      ...dto,
      owner: user.meta,
    });
    await this.manager.save(newAddress);

    user.meta.addresses.push(newAddress);
    return {
      id: newAddress.id,
      address: newAddress.address,
      lat: newAddress.lat,
      lon: newAddress.lon,
      created_at: newAddress.created_at,
      updated_at: newAddress.updated_at,
    };
  }
}
