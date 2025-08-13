import { ChangeEvent, useEffect, useRef, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import cn from "@/utils/cn/cn";

import AppBox from "@/components/app-box/AppBox";
import useDebouncedValue from "@/hooks/use-debounced-value/useDebouncedValue";

import * as styles from "@/components/quantity-selector/QuantitySelector.module.scss";

type QuantitySelectorProps = {
  initialQuantity: number;
  onQuantityChange: (quantity: number) => void;
  minQuantity?: number;
}

const QuantitySelector = ({
  initialQuantity,
  onQuantityChange,
  minQuantity = 1,
}: QuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const debouncedQuantity = useDebouncedValue(quantity, 500);
  const lastDebouncedQuantityRef = useRef(debouncedQuantity);

  useEffect(() => {
    if (debouncedQuantity !== lastDebouncedQuantityRef.current && debouncedQuantity > 0) {
      onQuantityChange(debouncedQuantity);
      lastDebouncedQuantityRef.current = debouncedQuantity;
    }
  }, [debouncedQuantity, onQuantityChange]);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => Math.max(prev - 1, minQuantity));

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(0);
    } else {
      const numberValue = parseInt(value, 10);
      if (!isNaN(numberValue) && numberValue > 0) setQuantity(numberValue);
    }
  };

  const handleBlur = () => {
    if (quantity < minQuantity) setQuantity(initialQuantity);
  };

  const disableMinus = quantity <= minQuantity && "disabled";

  return (
    <AppBox className={styles.quantitySelector}>
      <AppBox
        className={cn(styles.quantitySelector_quantityBlock, disableMinus)}
        onClick={handleDecrease}
      >
        <RemoveCircleOutlineIcon />
      </AppBox>
      <input
        value={quantity || ""}
        className={styles.quantitySelector_quantityInput}
        onChange={handleInputChange}
        onBlur={handleBlur}
        maxLength={6}
      />
      <AppBox className={styles.quantitySelector_quantityBlock} onClick={handleIncrease}>
        <AddCircleOutlineIcon />
      </AppBox>
    </AppBox>
  );
};

export default QuantitySelector;
