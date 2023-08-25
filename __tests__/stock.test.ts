import StockService from '../src/services/stock'; // Update the path to match your project structure
import { readJSONFile } from '../src/utils/fileUtils';
import { Stock } from '../src/models/stock';
import { Transaction } from '../src/models/transaction';

jest.mock('../src/utils/fileUtils', () => ({
  readJSONFile: jest.fn(),
}));

describe('StockService', () => {
  const mockStockData: Stock[] = [
    { sku: 'SKU001', stock: 100 },
    { sku: 'SKU002', stock: 50 },
  ];

  const mockTransactionsData: Transaction[] = [
    { sku: 'SKU001', type: 'order', qty: 10 },
    { sku: 'SKU001', type: 'refund', qty: 5 },
    { sku: 'SKU003', type: 'refund', qty: 45 },
    { sku: 'SKU004', type: 'order', qty: 32 },
  ];

  beforeEach(() => {
    (readJSONFile as jest.Mock).mockReset();
    (readJSONFile as jest.Mock).mockReturnValueOnce(mockStockData);
    (readJSONFile as jest.Mock).mockReturnValueOnce(mockTransactionsData);
  });

  it('should calculate current stock correctly with transactions', () => {
    const stockService = new StockService();
    const result = stockService.getCurrentStock('SKU001');
    expect(result).toEqual({ sku: 'SKU001', qty: 95 });
  });

  it('should calculate current stock correctly without initial stock', () => {
    const stockService = new StockService();
    const result = stockService.getCurrentStock('SKU003');
    expect(result).toEqual({ sku: 'SKU003', qty: 45 });
  });

  it('should calculate current stock correctly without transactions', () => {
    const stockService = new StockService();
    const result = stockService.getCurrentStock('SKU002');
    expect(result).toEqual({ sku: 'SKU002', qty: 50 });
  });

  it('should calculate current stock correctly with only order', () => {
    const stockService = new StockService();
    const result = stockService.getCurrentStock('SKU004');
    expect(result).toEqual({ sku: 'SKU004', qty: -32 });
  });

  it('should handle SKU not found', () => {
    const stockService = new StockService();
    expect(() => stockService.getCurrentStock('NONEXISTENT_SKU')).toThrow(
      "SKU doesn't exisit"
    );
  });
});
