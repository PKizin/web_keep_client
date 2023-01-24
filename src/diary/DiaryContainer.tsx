import { useState } from 'react';
import { UserInterface } from '../modal/UserInterface';
import { ChevronLeft, ChevronRight, ArrowClockwise } from 'react-bootstrap-icons';
import { Diary } from './Diary';

interface Props {
  user: UserInterface | null
}

function DiaryContainer (props: Props) {
  const [previousDateClicked, setPreviousDateClicked] = useState({})
  const [nextDateClicked, setNextDateClicked] = useState({})
  const [currentDateClicked, setCurrentDateClicked] = useState({})

  return (
    <>
      {props.user === null ?
        <h5>Hello, guest! Please sign up!</h5> :
        <>
          <Diary user={props.user} previosDateClicked={previousDateClicked} nextDateClicked={nextDateClicked} currentDateClicked={currentDateClicked} />
          <a href="#" onClick={() => setPreviousDateClicked({})}>
            <ChevronLeft size={32} />
          </a>
          <a href="#" onClick={() => setNextDateClicked({})}>
            <ChevronRight size={32} />
          </a>
          <a href="#" onClick={() => setCurrentDateClicked({})}>
            <ArrowClockwise size={32} />
          </a>
        </>}
    </>
  )
}

export { DiaryContainer }
