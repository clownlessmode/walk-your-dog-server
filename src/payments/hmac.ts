import * as crypto from 'crypto';

export class Hmac {
  static create(
    data: any,
    key: string,
    algo: string = 'sha256'
  ): string | false {
    if (!crypto.getHashes().includes(algo)) {
      return false;
    }

    // Remove undefined and null values
    const cleanData = this._removeEmptyValues(data);

    // Sort and convert values to strings
    const preparedData = this._strValAndSort(cleanData);

    // Create JSON string with escaped slashes
    const jsonString = JSON.stringify(preparedData).replaceAll('/', '\\/');

    console.log('Debug: Prepared Data Object:', preparedData);
    console.log('Debug: JSON String for HMAC:', jsonString);
    console.log('Debug: Secret Key:', key);

    const signature = crypto
      .createHmac(algo, key)
      .update(jsonString)
      .digest('hex');

    console.log('Debug: Generated Signature:', signature);

    return signature;
  }

  private static _removeEmptyValues(obj: any): any {
    const clean: any = {};

    for (const key in obj) {
      if (obj[key] !== null && obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
          const nested = this._removeEmptyValues(obj[key]);
          if (Object.keys(nested).length > 0) {
            clean[key] = nested;
          }
        } else {
          clean[key] = obj[key];
        }
      }
    }

    return clean;
  }

  private static _strValAndSort(data: any): any {
    // If it's an array, convert its elements but keep the order
    if (Array.isArray(data)) {
      return data.map((item) =>
        typeof item === 'object' && item !== null
          ? this._strValAndSort(item)
          : String(item)
      );
    }

    // If it's an object, sort keys and convert values
    const sorted = {};
    const keys = Object.keys(data).sort();

    for (const key of keys) {
      const value = data[key];
      if (value !== null && value !== undefined) {
        if (typeof value === 'object') {
          sorted[key] = this._strValAndSort(value);
        } else {
          sorted[key] = String(value);
        }
      }
    }

    return sorted;
  }

  static verify(
    data: any,
    key: string,
    sign: string,
    algo: string = 'sha256'
  ): boolean {
    const _sign = this.create(data, key, algo);
    return _sign && _sign.toLowerCase() === sign.toLowerCase();
  }
}
