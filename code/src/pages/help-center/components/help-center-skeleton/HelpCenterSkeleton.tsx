import Skeleton from "@mui/material/Skeleton";

const HelpCenterArticlesSkeleton = () => {
  return (
    <>
      {Array.from(new Array(8)).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={50}
          style={{ marginBottom: 6 }}
        />
      ))}
    </>
  );
};

export default HelpCenterArticlesSkeleton;
