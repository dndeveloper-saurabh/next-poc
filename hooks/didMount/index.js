import React, { useEffect, useRef } from 'react';

/**
 * It will prevent the callback to run on the very first render.
 * @param func
 * @param deps
 */
const useDidMountEffect = (func, deps) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      func();
    }
    else {
      let f = func(true);
      if(f) {
        didMount.current = true
      }
    }
  }, deps);
}

export default useDidMountEffect;
