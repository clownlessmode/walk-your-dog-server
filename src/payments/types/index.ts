// prodamus.types.ts
export enum PaymentMethod {
  AC = 'AC', // Bank card
  PC = 'PC', // Yandex.Money
  QW = 'QW', // Qiwi Wallet
  WM = 'WM', // Webmoney
  GP = 'GP', // Payment terminal
}

export enum TaxType {
  NO_VAT = 0,
  VAT_0 = 1,
  VAT_10 = 2,
  VAT_18 = 3,
  VAT_10_110 = 4,
  VAT_18_118 = 5,
  VAT_20 = 6,
  VAT_20_120 = 7,
}

export enum PaymentMethodType {
  FULL_PREPAYMENT = 1,
  PARTIAL_PREPAYMENT = 2,
  ADVANCE = 3,
  FULL_PAYMENT = 4,
  PARTIAL_CREDIT = 5,
  CREDIT = 6,
  CREDIT_PAYMENT = 7,
}

export enum PaymentObjectType {
  PRODUCT = 1,
  EXCISE = 2,
  JOB = 3,
  SERVICE = 4,
  GAMBLING_BET = 5,
  GAMBLING_PRIZE = 6,
  LOTTERY = 7,
  LOTTERY_PRIZE = 8,
  INTELLECTUAL = 9,
  PAYMENT = 10,
  AGENT_COMMISSION = 11,
  COMPOSITE = 12,
  OTHER = 13,
}

export enum NpdIncomeType {
  FROM_INDIVIDUAL = 'FROM_INDIVIDUAL',
  FROM_LEGAL_ENTITY = 'FROM_LEGAL_ENTITY',
  FROM_FOREIGN_AGENCY = 'FROM_FOREIGN_AGENCY',
}
