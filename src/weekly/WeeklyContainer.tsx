import { useState, useEffect } from 'react';
import { Weekly } from './Weekly';
import _ from 'lodash';

function WeeklyContainer (): JSX.Element {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 150)
  }, [])

  return (
    <>
      {loading ?
        <div className="spinner-border" /> :
        <>
          {_.range(7).map(i => 
            <Weekly day={i} key={i} />)}
        </>}
    </>
  )
}

export { WeeklyContainer }
