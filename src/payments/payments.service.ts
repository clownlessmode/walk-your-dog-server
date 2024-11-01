import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/prodamus.dto';
import { Hmac } from './hmac';

@Injectable()
export class PaymentsService {
  private readonly secretKey: string;
  private readonly payformUrl: string;
  logger = new Logger('PaymentsService');
  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.getOrThrow<string>(
      'PRODAMUS_SECRET_KEY'
    );
    this.payformUrl = this.configService.getOrThrow<string>(
      'PRODAMUS_PAYFORM_URL'
    );
  }

  private createSignature(data: Record<string, any>): string {
    const sortedData = Object.keys(data)
      .sort()
      .reduce((acc, key) => {
        if (key !== 'signature') {
          acc[key] = data[key];
        }
        return acc;
      }, {});

    const jsonString = JSON.stringify(sortedData);
    return crypto
      .createHmac('sha256', this.secretKey)
      .update(jsonString)
      .digest('hex');
  }

  async createPaymentLink(dto: CreatePaymentDto): Promise<string> {
    try {
      this.logger.debug('Creating payment with data:', dto);

      const paymentData = {
        ...dto,
        do: 'pay',
      };

      // Remove any undefined values
      const cleanPaymentData = Object.entries(paymentData).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      this.logger.debug('Cleaned payment data:', cleanPaymentData);

      const signature = Hmac.create(cleanPaymentData, this.secretKey);

      if (signature === false) {
        throw new Error('Failed to create payment signature');
      }

      this.logger.debug('Generated signature:', signature);

      // Convert arrays to form-data compatible format
      const formData = this._flattenData(cleanPaymentData);
      formData.signature = signature;

      this.logger.debug('Final form data:', formData);

      const params = new URLSearchParams(formData);
      const url = `${this.payformUrl}?${params.toString()}`;

      this.logger.debug('Generated URL:', url);

      return url;
    } catch (error) {
      this.logger.error('Error creating payment link:', error);
      throw error;
    }
  }

  private _flattenData(data: any, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {};

    for (const key in data) {
      const value = data[key];
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${newKey}[${index}]`;
          if (typeof item === 'object') {
            Object.assign(result, this._flattenData(item, arrayKey));
          } else {
            result[arrayKey] = String(item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(result, this._flattenData(value, newKey));
      } else {
        result[newKey] = String(value);
      }
    }

    return result;
  }
}
