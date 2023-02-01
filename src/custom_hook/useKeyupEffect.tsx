import React, { useEffect } from "react";

function useKeyupEffect<T extends HTMLElement> (element: T, keys: string[], effect: () => void, dependencies: React.DependencyList | undefined) {

  useEffect(() => {
    console.log('useKeyupEffect hook')
    if (element) {
      const listener = (event: KeyboardEvent) => {
        if (keys.includes(event.key)) {
          effect()
        }
      }
      element.addEventListener('keyup', listener)
      return () => element.removeEventListener('keyup', listener)
    }
  }, [dependencies, element, keys, effect])
}

export { useKeyupEffect }
