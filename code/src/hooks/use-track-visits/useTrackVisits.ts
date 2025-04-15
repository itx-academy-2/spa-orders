import { useEffect } from "react";

import { LOCAL_STORAGE_KEYS } from "@/constants/common";
import getPreviousVisitsData from "@/utils/get-previous-visits-data/get-previous-visits-data";

const useTrackVisits = (type: "product" | "category", id: string) => {
  useEffect(() => {
    const prevLocalStorageData = getPreviousVisitsData();

    const mergedVisits = {
      ...prevLocalStorageData,
      [type]: id,
      lastVisitedType: type
    };

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.visitsTracking,
      JSON.stringify(mergedVisits)
    );
  }, [type, id]);
};

export default useTrackVisits;
