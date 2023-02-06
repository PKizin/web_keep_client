import { useState, useEffect, useRef } from 'react'
import { useAppDispatch } from '../custom_hook/useAppDispatch'
import { useAppSelector } from '../custom_hook/useAppSelector'
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect'
import { Modal } from '../modal/Modal'
import { MessageInterface } from '../toast/MessageInterface'
import { selectUser, signinAsync } from '../redux/userSlice'
import './UserModal.scss'
import axios from 'axios'

interface Props {
  hideModal: () => void,
  setMessage: (message: MessageInterface) => void
}

function UserModal(props: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(true)
  const usernameInputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const { user, loading, failed, failedMessage } = useAppSelector(selectUser)

  useEffect(() => {
    usernameInputRef.current!.focus()
  }, [])

  useUpdatePropEffect(() => {
    if (!loading) {
      props.hideModal()
      if (failed) {
        props.setMessage({ text: failedMessage, type: 'danger' })
      }
      else if (user !== null) {
        props.setMessage({ text: `User "${user.login}" logged in`, type: 'success' })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading])

  function _signup(setLoading: (loading: boolean) => void) {
    setLoading(true)
    setTimeout(() => axios
      .post('http://localhost:3001/user', null, {
        params: {
          'username': username,
          'password': password
        }
      })
      .then(() => {
        props.setMessage({ text: `User "${username}" added`, type: 'success' })
        //_signin(setLoading)
      })
      .catch(error => {
        props.setMessage({ text: `Error: ${error.response && error.response.data && error.response.data.length > 0 ? error.response.data : error}`, type: 'danger' })
      })
      .finally(() => {
        setLoading(false)
        props.hideModal()
      }), 1000)
  }

  return (
    <Modal title={registered ? 'Log in' : 'Sign up'} titleLoading={registered ? 'Logging in...' : 'Signing up...'} loading={loading}
      okClicked={() => dispatch(signinAsync({ username: username, password: password }))} 
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
