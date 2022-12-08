import {useEffect, useState} from "react";

export const useOverlayLoader = (init) => {
  const [loading, setLoading] = useState(init ?? false);

  useEffect(() => {
    if(loading) {
      document.body.style.pointerEvents = 'none';
    } else {
      document.body.style.pointerEvents = 'all';
    }
  }, [loading])

  return [loading, setLoading];
}
