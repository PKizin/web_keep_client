import { useEffect, useRef } from 'react';

function useUpdatePropEffect (effect: () => void, dependencies: any[]) {
  const isMounted = useRef(false)
  const isPropMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    }
    else if (!isPropMounted.current) {
      isPropMounted.current = true
    }
    else {
      effect()
    }
  }, dependencies)
}

export { useUpdatePropEffect }
