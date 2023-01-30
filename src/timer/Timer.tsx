import { useState, useEffect } from 'react';

function Timer () {
  const [timer, setTimer] = useState(_parseDate(new Date()))

  useEffect(() => {
    const timerInterval = setInterval(() => setTimer(_parseDate(new Date())), 1000)
    return () => clearInterval(timerInterval)
  }, [])

  function _parseDate(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  return (
    <>
      {timer}
    </>
  )
}

export { Timer }
