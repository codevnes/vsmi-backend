import { Currency, CurrencyPrice } from '@prisma/client';

export interface CurrencyDto {
  code: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCurrencyDto {
  code: string;
  name: string;
}

export interface UpdateCurrencyDto {
  name?: string;
}

export interface CurrencyPriceDto {
  id: string;
  currencyCode: string;
  date: Date;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  trendQ?: number | string | null;
  fq?: number | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCurrencyPriceDto {
  currencyCode: string;
  date: Date;
  open: number | string;
  high: number | string;
  low: number | string;
  close: number | string;
  trendQ?: number | string | null;
  fq?: number | string | null;
}

export interface UpdateCurrencyPriceDto {
  open?: number | string;
  high?: number | string;
  low?: number | string;
  close?: number | string;
  trendQ?: number | string | null;
  fq?: number | string | null;
}

export interface CurrencyPriceQueryParams {
  currencyCode?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

// Response types
export interface CurrencyResponse {
  success: boolean;
  data: CurrencyDto;
  message: string;
}

export interface CurrenciesResponse {
  success: boolean;
  data: CurrencyDto[];
  total: number;
  message: string;
}

export interface CurrencyPriceResponse {
  success: boolean;
  data: CurrencyPriceDto;
  message: string;
}

export interface CurrencyPricesResponse {
  success: boolean;
  data: CurrencyPriceDto[];
  total: number;
  message: string;
} 