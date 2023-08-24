import StockService from './src/services/stock';


const sku = process.argv[2];
async function getStockInfo(sku: string) {
    try {
        const stockService = new StockService();
        const stockInfo = stockService.getCurrentStock(sku);
        return stockInfo;
    } catch (error) {
        throw new Error(error);
    }
}

getStockInfo(sku)
    .then(stockInfo => console.log(stockInfo))
    .catch(error => console.error(error));