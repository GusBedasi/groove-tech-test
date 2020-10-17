export class CustomerPayload {
  id: string;
  customer_key: number;
  customer_name: string;
  signature: Promise<string>;
}