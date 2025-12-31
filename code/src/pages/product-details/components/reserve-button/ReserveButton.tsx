import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";
import AppLoader from "@/components/app-loader/AppLoader";

type ReserveButtonProps = {
  isReserved: boolean;
  isLoading?: boolean;
  onToggle: () => void;
};

const ReserveButton = ({
  isReserved,
  isLoading,
  onToggle,
}: ReserveButtonProps) => {
  return (
    <AppButton
      onClick={onToggle}
      disabled={isLoading}
      className="reserve-button"
    >
      {isLoading ? (
        <AppLoader size="small" />
      ) : (
        isReserved ? (
          <AppTypography translationKey="productDetailsPage.reservedButton" />
        ) : (
          <AppTypography translationKey="productDetailsPage.reserveButton" />
        )
      )}
    </AppButton>
  );
};

export default ReserveButton;
