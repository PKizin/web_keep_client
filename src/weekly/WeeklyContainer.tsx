import { useState, useEffect } from 'react';
import { Weekly } from './Weekly';
import { UserInterface } from '../modal/UserInterface';
import _ from 'lodash';

interface Props {
  user: UserInterface
}

function WeeklyContainer (props: Props): JSX.Element {
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
            <Weekly user={props.user as NonNullable<UserInterface>} day={i} key={i} />)}
        </>}
    </>
  )
}

export { WeeklyContainer }
