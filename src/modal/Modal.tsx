import { useRef } from 'react'
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import './Modal.scss'

interface Props {
  title: string,
  titleLoading?: string,
  loading?: boolean,
  okClicked: () => void,
  cancelClicked: () => void,
  isDisabled?: () => boolean,
  children: any
}

function Modal(props: Props) {
  const okButtonRef = useRef<HTMLButtonElement>(null)
  const cancelButtonRef = useRef<HTMLButtonElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)

  useKeyupEffect(windowRef, ['Enter'], () => {
    if (okButtonRef.current) {
      okButtonRef.current.click()
    }
  }, [])

  useKeyupEffect(windowRef, ['Escape'], () => {
    if (cancelButtonRef.current) {
      cancelButtonRef.current.click()
    }
  }, [])

  return (
    <div className="modal-background">
      <div className="modal-window themed" ref={windowRef}>
        <div className="modal-window-header themed">
          {props.loading ? props.titleLoading : props.title}
        </div>
        <div className="modal-window-body themed">
          {props.loading ? <div className="spinner-border" /> : props.children}
        </div>
        <div className="modal-window-footer themed">
          <button ref={okButtonRef} className={`btn btn-sm btn-link ${props.loading ? 'd-none' : ''}`} onClick={() => props.okClicked()} disabled={props.isDisabled && props.isDisabled()}>OK</button>
          <button ref={cancelButtonRef} className={`btn btn-sm btn-link ${props.loading ? 'd-none' : ''}`} onClick={() => props.cancelClicked()}>CANCEL</button>
        </div>
      </div>
    </div>
  )
}

export { Modal }
