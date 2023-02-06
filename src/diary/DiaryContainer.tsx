import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowClockwise } from 'react-bootstrap-icons';
import { Diary } from './Diary';

function DiaryContainer (): JSX.Element {
  const [previousDateClicked, setPreviousDateClicked] = useState({})
  const [nextDateClicked, setNextDateClicked] = useState({})
  const [currentDateClicked, setCurrentDateClicked] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 150)
  }, [])

  return (
    <>
      {loading ?
        <div className="spinner-border" /> :
        <>
          <Diary previosDateClicked={previousDateClicked} nextDateClicked={nextDateClicked} currentDateClicked={currentDateClicked} />
          <a href="/#" onClick={() => setPreviousDateClicked({})}>
            <ChevronLeft size={32} />
          </a>
          <a href="/#" onClick={() => setNextDateClicked({})}>
            <ChevronRight size={32} />
          </a>
          <a href="/#" onClick={() => setCurrentDateClicked({})}>
            <ArrowClockwise size={32} />
          </a>
        </>}
    </>
  )
}

export { DiaryContainer }
