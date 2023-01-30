import { useState, useEffect, useRef } from 'react';
import { useUpdateEffect } from '../custom_hook/useUpdateEffect';
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import { UserInterface } from '../modal/UserInterface';
import { Pencil, PencilFill, Trash3 } from 'react-bootstrap-icons';
import '../custom_prototype/DatePrototype';
import './Diary.scss';
import axios from 'axios';

interface Props {
  user: UserInterface,
  previosDateClicked: object,
  nextDateClicked: object,
  currentDateClicked: object
}

function Diary (props: Props): JSX.Element {
  const [date, setDate] = useState(new Date())
  const [text, setText] = useState('')
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useUpdateEffect(() => {
    _getDiary()
  }, [date])

  useUpdateEffect(() => {
    if (edit) {
      _focusEdit()
    }
  }, [edit])

  useUpdatePropEffect(() => {
    _postDiary()
  }, [text])

  useUpdatePropEffect(() => {
    setDate(new Date(date.getTime() - 1000 * 60 * 60 * 24))
    _focusEdit()
  }, [props.previosDateClicked])

  useUpdatePropEffect(() => {
    setDate(new Date(date.getTime() + 1000 * 60 * 60 * 24))
    _focusEdit()
  }, [props.nextDateClicked])

  useUpdatePropEffect(() => {
    setDate(new Date())
    _focusEdit()
  }, [props.currentDateClicked])

  useKeyupEffect(textareaRef, ['Escape'], () => {
    _closeEdit()
  }, [edit])

  function _closeEdit () {
    if (edit) {
      setEdit(false)
    }
  }

  function _focusEdit () {
    if (edit && textareaRef.current) {
      textareaRef.current.focus()
    }
  }
  
  function _parseDate (date: Date) {
    return `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }

  function _parseDateLiterally (date: Date) {
    return `${date.getMonthName()} ${date.getDate()}, ${date.getFullYear()}`
  }

  function _getDiary () {
    setLoading(true)
    setTimeout(() => axios
      .get('http://localhost:3001/diary', {
        params: {
          user_id: props.user.id,
          date: _parseDate(date)
        }
      })
      .then(response => {
        if (response && response.data && response.data.length > 0) {
          setText(response.data[0].text)
        }
        else {
          setText('')
        }
      })
      .finally(() => {
        setLoading(false)
      }), 100)
  }

  function _postDiary () {
    axios
      .post('http://localhost:3001/diary', null, {
        params: {
          user_id: props.user.id,
          date: _parseDate(date),
          text: text
        }
      })
  }

  return (
    <div className="card diary-card themed">
      <div className="card-body">
        <h5 className="card-title user-select-none">
          <div className="card-title-layout">
            {_parseDateLiterally(date)}
            <div className="flex-grow-1" />
            <a href="#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)}>
              {edit ?
                <PencilFill /> :
                <Pencil />}
            </a>
            <a href="#" className="card-title-layout-button additional-margin" onClick={() => { setText(''); _closeEdit() }}>
              <Trash3 />
            </a>
          </div>
        </h5>
        {edit ?
          <>
            <textarea className="form-control flex-grow-1" ref={textareaRef} value={text} onChange={event => setText(event.target.value)} placeholder="Write your data..." />
            <div className="form-text">Data will be saved authomatically...</div>
          </> :
          loading ?
            <div className="spinner-border spinner-border-sm" /> :
            <div className="diary-text">{text}</div>}
      </div>
    </div>
  )
}

export { Diary }
