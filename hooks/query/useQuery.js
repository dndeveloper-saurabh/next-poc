import React from 'react';
import {useRouter} from "next/router";

function useQuery() {
  const { query } = useRouter();

  return React.useMemo(() => {
    console.log('query - ', query);
    return new URLSearchParams(query)
  }, [query]);
}

export default useQuery;
