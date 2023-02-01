import { RefObject, useEffect } from 'react';

function useOutsideClickEffect<T extends HTMLElement> (ref: RefObject<T>, effect: () => void, dependencies: any[]) {
  
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        effect()
      }
    }
    document.addEventListener('mousedown', listener)
    return () => document.removeEventListener('mousedown', listener)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export { useOutsideClickEffect }
