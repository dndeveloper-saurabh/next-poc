import {useEffect, useState} from "react";

export default function useIsProduction() {
  const [is, setIs] = useState(false);

  useEffect(() => {
    if(!window) return setIs(false);
    return setIs(window.location.origin.includes('pustack.com'));
  }, [])

  return is;
}

// export const isProduction = window.location.origin.includes('pustack.com');
