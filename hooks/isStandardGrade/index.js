import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "../../context";
import {getAvailableGrades} from "../../helpers";
import useIsProduction from "../isProduction";

export default function useStandardGrade(grade) {
  const [user] = useContext(UserContext).user;
  const [grades, setGrades] = useState(null);
  const isProduction = useIsProduction();

  useEffect(() => {
    if (!user?.grade) return;
    const availableGrades = getAvailableGrades(null, null, isProduction);
    setGrades(availableGrades.some(c => c.value === user.grade && c.standard));
  }, [user?.grade, isProduction]);

  return grades;
}
