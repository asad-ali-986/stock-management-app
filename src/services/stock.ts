import { readJSONFile } from '../utils/fileUtils';
import { Stock } from '../models/stock';
import { Transaction } from '../models/transaction';
var path = require("path");


class StockService {
    private stockData: Stock[];
    private transactionsData: Transaction[];

    constructor() {
        this.stockData = readJSONFile<Stock[]>(path.join(__dirname, '..', '..', 'data', 'stock.json'));
        this.transactionsData = readJSONFile<Transaction[]>(path.join(__dirname, '..', '..', 'data', 'transactions.json'));
    }

    private getStockInfo = (sku: string): Stock | undefined => {
        return this.stockData.find(entry => entry.sku === sku) ;
    }

    private getStockTransactions = (sku: string): Transaction[] => {
        return this.transactionsData.filter(entry => entry.sku === sku);
    }

    private getStockQuantity = (initialStock: number, transactions: Transaction[]): number  => {
        let currentStock = initialStock;
        for (const transaction of transactions) {
            if (transaction.type === 'order') {
                currentStock -= transaction.qty;
            } else if(transaction.type === 'refund') {
                currentStock += transaction.qty;
            }
        }

        return currentStock;
    }

    public getCurrentStock(sku: string): { sku: string, qty: number } {
        const stock = this.getStockInfo(sku);
        const transactions = this.getStockTransactions(sku);

        if(!stock && transactions.length === 0){
            throw new Error(`SKU doesn't exisit`);
        }

        const startingStock = stock ? stock.stock : 0;
        const qty = this.getStockQuantity(startingStock,transactions);

        return { sku, qty };
    }
}

export default StockService;
