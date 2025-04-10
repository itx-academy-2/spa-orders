import Skeleton from "@mui/material/Skeleton";

import AppBox from "@/components/app-box/AppBox";

const HelpCenterAccordionItemSkeleton = () => {
  return (
    <>
      {Array.from(new Array(3)).map((_, index) => (
        <AppBox key={index} style={{ marginBottom: 16 }}>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={40}
            style={{ marginTop: 8 }}
          />
        </AppBox>
      ))}
    </>
  );
};

export default HelpCenterAccordionItemSkeleton;
