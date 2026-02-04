import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import { ReservedLabelProps } from "@/components/reserved-label/ReservedLabel.types";

import styled from "@emotion/styled";

const StyledLabel = styled(AppBox)`
  display: inline-flex;
  width: fit-content;
  background-color: #751fff;
  color: #ffffff;
  padding: 5px 8px;
  border-radius: 15px;
  font-size: 15px;
  white-space: nowrap;
`;

const ReservedLabel = ({ className }: ReservedLabelProps) => {
  return (
    <StyledLabel
      data-testid="reserved-label"
      className={className}
    >
      <AppTypography
        variant="caption-small"
        translationKey="productsTable.label.reservedLabel"
      />
    </StyledLabel>
  );
}

export default ReservedLabel;
