import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import styled from "@emotion/styled";

const StyledLabel = styled(AppBox)`
  position: absolute;
  background-color: #751fff;
  color: #ffffff;
  padding: 2px 8px;
  border-radius: 15px;
  font-size: 15px;
  z-index: 1;
`;

const ReservedLabel = () => {
  return (
    <StyledLabel data-testid="reserved-label">
      <AppTypography
        variant="caption-small"
        translationKey="productsTable.label.reservedLabel"
      />
    </StyledLabel>
  );
}

export default ReservedLabel;
