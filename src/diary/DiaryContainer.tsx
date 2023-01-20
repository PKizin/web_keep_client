import { useState } from 'react';
import { UserInterface } from '../modal/UserInterface';
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons';
import axios from 'axios';

interface Props {
  user: UserInterface | null
}

function DiaryContainer (props: Props) {
  const [date, setDate] = useState(_parseDate(new Date()))
  const [loading, setLoading] = useState(false)

  function _parseDate (date: Date) {
    return `${date.getFullYear().toString()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  return (
    <>
      {props.user === null ?
        <h5>Hello, guest! Please sign up!</h5> :
        <>
          {loading ?
            <div className="spinner-border" /> :
            <>
              <a href="#">
                <ChevronLeft size={32} />
              </a>
              <a href="#">
                <ChevronRight size={32} />
              </a>
            </>}
        </>}
    </>
  )
}