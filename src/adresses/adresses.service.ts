import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/entites/user.entity';
import { CreateAddressDto } from './dto/CreateAdress.dto';
import { EntityManager } from 'typeorm';
import { Address } from './entities/address.entity';
import { UpdateAddressDto } from './dto/UpdateAdress.dto';
interface AddressResponse {
  id: string;
  address: string;
  lat: number;
  lon: number;
  apartment: string | null;
  doorcode: string | null;
  entrance: string | null;
  created_at: string;
  updated_at: string;
}
@Injectable()
export class AdressesService {
  constructor(private readonly manager: EntityManager) {}

  async update(id: string, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.manager.findOne(Address, { where: { id } });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // Обновляем адрес с использованием данных из DTO
    this.manager.merge(Address, address, dto);
    return await this.manager.save(address);
  }

  async create(dto: CreateAddressDto): Promise<AddressResponse> {
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
      apartment: newAddress.apartment,
      doorcode: newAddress.doorcode,
      entrance: newAddress.entrance,
      created_at: newAddress.created_at,
      updated_at: newAddress.updated_at,
    };
  }
}
