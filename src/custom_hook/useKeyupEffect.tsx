import { RefObject, useEffect } from "react";

function useKeyupEffect<T extends HTMLElement> (ref: RefObject<T>, keys: string[], effect: () => void, dependencies: any[]) {

  useEffect(() => {
    if (ref.current) {
      const listener = (event: KeyboardEvent) => {
        if (keys.includes(event.key)) {
          effect()
        }
      }
      ref.current.addEventListener('keyup', listener)
      return () => ref.current?.removeEventListener('keyup', listener)
    }
  }, dependencies)
}

export { useKeyupEffect }
