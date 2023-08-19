import { readJSONFile } from '../utils/fileUtils';
import { Stock } from '../models/stock';
import { Transaction } from '../models/transaction';
var path = require("path");


class StockService {
    private stockData: Stock[];
    private transactionsData: Transaction[];

    constructor() {
        this.stockData = readJSONFile<Stock[]>(path.resolve(__dirname, "../../data/stock.json"));
        this.transactionsData = readJSONFile<Transaction[]>(path.resolve(__dirname, "../../data/transactions.json"));
    }

    getCurrentStock(sku: string): { sku: string, qty: number } {
        const stock = this.stockData.find(entry => entry.sku === sku);
        const transactions = this.transactionsData.filter(entry => entry.sku === sku);

        if(!stock && transactions.length === 0){
            throw new Error(`SKU doesn't exisit`);
            
        }
        const startingStock = stock ? stock.stock : 0;

        let currentStock = startingStock;
        for (const transaction of transactions) {
            if (transaction.type === 'order') {
                currentStock -= transaction.qty;
            } else if(transaction.type === 'refund') {
                currentStock += transaction.qty;
            }
        }

        return { sku, qty: currentStock };
    }
}

export default StockService;
