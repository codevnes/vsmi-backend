export * from './auth.types';
export * from './user.types';

// These type files are not yet implemented
export * from './stock.types';
// export * from './transaction.types';
export * from './image.types';
export * from './category.types';
export * from './post.types';
export * from './currency.types';

export interface SelectedStocksData {
  id: string;
  symbol: string;
  date: Date;
  close?: number;
  return?: number;
  qIndex?: number;
  volume?: number;
  createdAt: Date;
  updatedAt: Date;
}
