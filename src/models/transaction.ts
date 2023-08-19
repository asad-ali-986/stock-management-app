export interface Transaction {
    sku: string;
    type: 'order' | 'refund';
    qty: number;
}