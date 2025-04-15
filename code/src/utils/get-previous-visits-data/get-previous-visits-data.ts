import { LOCAL_STORAGE_KEYS } from "@/constants/common";
import { PreviousVisitsData } from "@/types/common";

const getPreviousVisitsData = () => {
  const localStorageVisits = window.localStorage.getItem(
    LOCAL_STORAGE_KEYS.visitsTracking
  );

  let visits = {};

  if (localStorageVisits) {
    try {
      const parsedVisits = JSON.parse(localStorageVisits);

      visits = parsedVisits;
    } catch {
      // If the visits is invalid, initial visits is returned
    }
  }

  return visits as PreviousVisitsData;
};

export default getPreviousVisitsData;
