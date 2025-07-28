import { ChangeEvent } from "react";

import Slider from "@mui/material/Slider";

import AppBox from "@/components/app-box/AppBox";
import AppInput from "@/components/app-input/AppInput";
import { AppRangeSliderProps } from "@/components/app-range-slider/AppRangeSlider.types";
import parseRangeValues from "@/components/app-range-slider/utils/parse-range-values/parseRangeValues";
import AppTypography from "@/components/app-typography/AppTypography";

import cn from "@/utils/cn/cn";

import "@/components/app-range-slider/AppRangeSlider.scss";

const AppRangeSlider = ({
  className,
  onChange,
  min = 0,
  max = 20000,
  step,
  value,
  ...props
}: AppRangeSliderProps) => {
  const rangeStart = value?.[0].toString() ?? "";
  const rangeEnd = value?.[1].toString() ?? "";

  const { sliderRange, inputData } = parseRangeValues({
    rangeStart,
    rangeEnd,
    min,
    max
  });

  const updateWithValue = (value: Array<string | number>) => {
    onChange?.(value as number[]);
  };

  const handleSliderChange = (event: Event, value: number | number[]) => {
    updateWithValue(value as number[]);
  };

  const handleRangeStartChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWithValue([event.target.value, rangeEnd]);
  };

  const handleRangeEndChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateWithValue([rangeStart, event.target.value]);
  };

  const minValue = Number(inputData.start.value);
  const maxValue = Number(inputData.end.value);

  const isRangeOrderInvalid = minValue > maxValue;

  const isRangeStartInputInvalid = !inputData.start.isValid || isRangeOrderInvalid;
  const isRangeEndInputInvalid = !inputData.end.isValid || isRangeOrderInvalid;

  return (
    <AppBox className={cn("spa-range-slider", className?.root)}>
      <AppBox className={cn("spa-range-slider__toolbar", className?.toolbar)}>
        <AppBox className={cn("spa-range-slider__toolbar-title-input", className?.toolbarInput)}>
          <AppTypography variant="caption" translationKey="filters.from" className="spa-range-slider__toolbar-title" />
          <AppInput
            fullWidth
            type="number"
            className={cn(className?.toolbarInput)}
            inputProps={{
              step,
              "data-testid": "range-start",
              "data-cy": "price-range-from"
            }}
            value={inputData.start.value}
            error={isRangeStartInputInvalid}
            color={isRangeStartInputInvalid ? "danger" : undefined}
            onChange={handleRangeStartChange}
            placeholder={min.toString()}
            helperText={
              isRangeStartInputInvalid ? (
                isRangeOrderInvalid ? (
                  <AppTypography
                    variant="caption"
                    translationKey="filters.invalidValueRange"
                    className="spa-range-slider__toolbar-input-helper-text"
                  />
                ) : (
                <AppTypography
                  variant="caption"
                  translationKey="filters.invalidMinPrice"
                  translationProps={{
                    values: {
                      minValue: min
                    }
                  }}
                />
              )
            ) : undefined
            }
          />
        </AppBox>
        <AppBox className={cn("spa-range-slider__toolbar-title-input", className?.toolbarInput)}>
          <AppTypography variant="caption" translationKey="filters.to" className="spa-range-slider__toolbar-title" />
          <AppInput
            fullWidth
            type="number"
            className={cn(className?.toolbarInput)}
            inputProps={{
              step,
              "data-testid": "range-end",
              "data-cy": "price-range-to"
            }}
            value={inputData.end.value}
            error={isRangeEndInputInvalid}
            color={isRangeEndInputInvalid ? "danger" : undefined}
            onChange={handleRangeEndChange}
            placeholder={max.toString()}
            helperText={
              isRangeEndInputInvalid ? (
                isRangeOrderInvalid ? (
                  <AppTypography
                    variant="caption"
                    translationKey="filters.invalidValueRange"
                    className="spa-range-slider__toolbar-input-helper-text"
                  />
                ) : (
                <AppTypography
                  variant="caption"
                  translationKey="filters.invalidMaxPrice"
                  translationProps={{
                    values: {
                      maxValue: max
                    }
                  }}
                />
              )
              ) : undefined
            }
          />
        </AppBox>
      </AppBox>
      <Slider
        data-testid="range-slider"
        className={cn("spa-range-slider__range", className?.range)}
        value={sliderRange}
        onChange={handleSliderChange}
        step={step}
        min={min}
        max={max}
        {...props}
      />
    </AppBox>
  );
};

export default AppRangeSlider;
