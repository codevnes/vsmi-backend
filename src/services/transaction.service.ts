import { prisma } from '../config';
import { NotFoundError } from '../utils/error';

export const createTransaction = async (data: {
  userId: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  transactionDate: Date;
}) => {
  const stock = await prisma.stock.findUnique({ where: { symbol: data.symbol }, select: { name: true } });
  if (!stock) throw new NotFoundError('Stock not found');
  
  return prisma.transaction.create({
    data: {
      ...data,
      stockName: stock.name,
      price: data.price.toFixed(4),
    },
  });
};
