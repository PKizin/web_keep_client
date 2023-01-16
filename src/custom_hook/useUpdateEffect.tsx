import { useEffect, useRef } from 'react';

function useUpdateEffect(effect: () => void, dependencies: any[]) {
  const isMountedRef = useRef(false)

  useEffect(() => {
    if (isMountedRef.current) {
      effect()
    }
    else {
      isMountedRef.current = true
    }
  }, dependencies)
}

export { useUpdateEffect }
