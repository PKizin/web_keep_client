import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppDispatch } from '../custom_hook/useAppDispatch'
import { useAppSelector } from '../custom_hook/useAppSelector'
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect'
import { Modal } from '../modal/Modal'
import { selectUser, signinAsync, signupAsync, getUser, getUserPending } from '../redux/userSlice'
import './UserModal.scss'

interface Props {
  hideModal: () => void
}

function UserModal(props: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(true)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectUser).loading

  const okClickedCallback = useCallback(async () => {
    /*if (!registered) {
      await dispatch(signupAsync({
        username: username,
        password: password
      }))
    }
    dispatch(signinAsync({ 
      username: username, 
      password: password
    }))*/
    dispatch(getUser({
      username: username,
      password: password
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registered, username, password])

  useEffect(() => {
    usernameInputRef.current!.focus()
  }, [])

  useUpdatePropEffect(() => {
    if (!loading) {
      props.hideModal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  return (
    <Modal title={registered ? 'Log in' : 'Sign up'} titleLoading={registered ? 'Logging in...' : 'Signing up...'} loading={loading}
      okClicked={() => okClickedCallback()} 
      cancelClicked={() => props.hideModal()}
      isDisabled={() => username.length === 0 || password.length === 0}>
      <div className="user-modal-root">
        <div className="user-modal-row">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input ref={usernameInputRef} type="text" id="usernameInput" className="form-control" value={username} onChange={e => setUsername(e.target.value)} autoComplete="off"></input>
        </div>
        <div className="user-modal-row">
          <label htmlFor="passwordInput" className="form-label">Password</label>
          <input type="password" id="passwordInput" className="form-control" value={password} onChange={e => setPassword(e.target.value)}></input>
        </div>
        <div className="user-modal-row">
          <input id="registeredCheckbox" type="checkbox" className="form-check-input me-2" checked={registered} onChange={() => setRegistered(!registered)} />
          <label htmlFor="registeredCheckbox" className="form-check-label">Already registered</label>
        </div>
      </div>
    </Modal>
  )
}

export { UserModal }
