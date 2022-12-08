import React, {useContext, useMemo} from 'react';
import {UserContext} from "../../context";
import {getAvailableGrades} from "../../database/home/fetcher";

export default function useStandardGrade(grade) {
  const [user] = useContext(UserContext).user;

  return useMemo(() => {
    if (!user || !user.grade) return null;
    const availableGrades = getAvailableGrades();
    return availableGrades.some(c => c.value === user.grade && c.standard);
  }, [user?.grade]);
}
