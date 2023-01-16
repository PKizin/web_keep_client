import { useState, useRef } from 'react'
import './Modal.scss'

interface Props {
  title: string,
  titleLoading: string,
  okClicked: (setLoading: (loading: boolean) => void) => void,
  cancelClicked: () => void,
  isDisabled: () => boolean,
  children: any
}

function Modal(props: Props) {
  const [loading, setLoading] = useState(false)
  const okButtonRef = useRef<HTMLButtonElement>(null)

  function setLoadingCallback(loading: boolean) {
    setLoading(loading)
  }

  function _onKeyUp(event: any) {
    if (event.key === 'Enter') {
      okButtonRef.current!.click()
    }
  }

  return (
    <div className="modal-background">
      <div className="modal-window" onKeyUp={_onKeyUp}>
        <div className="modal-window-header">
          {loading ? props.titleLoading : props.title}
        </div>
        <div className="modal-window-body">
          {loading ? <div className="spinner-border" /> : props.children}
        </div>
        <div className="modal-window-footer">
          <button ref={okButtonRef} className={`btn btn-sm btn-link ${loading ? 'd-none' : ''}`} onClick={() => props.okClicked(setLoadingCallback)} disabled={props.isDisabled()}>OK</button>
          <button className={`btn btn-sm btn-link ${loading ? 'd-none' : ''}`} onClick={() => props.cancelClicked()}>CANCEL</button>
        </div>
      </div>
    </div>
  )
}

export { Modal }
