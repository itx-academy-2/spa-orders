import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

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
