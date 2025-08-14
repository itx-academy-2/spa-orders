export type QuantitySelectorProps = {
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
}