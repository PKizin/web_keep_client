import { useEffect, useState, useRef } from 'react';
import { UserInterface } from '../modal/UserInterface';
import { Pencil, PencilFill, Trash3 } from 'react-bootstrap-icons';
import './Weekly.scss';
import axios from 'axios';
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';

interface Props {
  user: UserInterface,
  day: number
}

const Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function Weekly (props: Props): JSX.Element {
  const [text, setText] = useState('')
  const [edit, setEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    if (edit && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [edit])

  useEffect(() => {
    if (loading) {
      setTimeout(() => _getWeekly(), 100)
    }
  }, [loading])

  useUpdatePropEffect(() => {
    _postWeekly()
  }, [text])

  useKeyupEffect(textareaRef.current!, ['Escape'], () => {
    _closeEdit()
  }, [edit])

  function _closeEdit () {
    if (edit) {
      setEdit(false)
    }
  }

  function _getWeekly () {
    axios
      .get('http://localhost:3001/weekly', {
        params: {
          user_id: props.user.id,
          day: props.day
        }
      })
      .then(response => {
        if (response && response.data && response.data.length > 0) {
          setText(response.data[0].text)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  function _postWeekly () {
    axios
      .post('http://localhost:3001/weekly', null, {
        params: {
          user_id: props.user.id,
          day: props.day,
          text: text
        }
      })
  }

  return (
    <div className="card weekly-card themed">
      <div className="card-body">
        <h5 className="card-title user-select-none">
          <div className="card-title-layout">
            {Days[props.day]}
            <div className="flex-grow-1" />
            <a href="/#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)}>
              {edit ?
                <PencilFill /> :
                <Pencil />}
            </a>
            <a href="/#" className="card-title-layout-button additional-margin" onClick={() => { setText(''); _closeEdit() }}>
              <Trash3 />
            </a>
          </div>
        </h5>
        {edit ?
          <textarea className="form-control flex-grow-1" ref={textareaRef} value={text} onChange={event => setText(event.target.value)} placeholder="Write your data..." /> :
          loading ?
            <div className="spinner-border spinner-border-sm" /> :
            <div className="weekly-text">{text}</div>}
      </div>
    </div>
  )
}

export { Weekly }
