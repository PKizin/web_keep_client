import { useState, useEffect, useRef } from 'react'
import { Modal } from '../modal/Modal'
import { MessageInterface } from '../toast/MessageInterface'
import { UserInterface } from './UserInterface'
import './UserModal.scss'
import axios from 'axios'

interface Props {
  setUser: (user: UserInterface | null) => void,
  setShowUserModal: (showUserModal: boolean) => void,
  setMessage: (message: MessageInterface) => void
}

function UserModal(props: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(true)
  const usernameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    usernameInputRef.current!.focus()
  }, [])
  
  function _signin(setLoading: (loading: boolean) => void) {
    setLoading(true)
    setTimeout(() => axios
      .get('http://localhost:3001/user', {
        params: {
          'username': username,
          'password': password
        }
      })
      .then(response => {
        if (response && response.data && response.data.length > 0) {
          props.setMessage({ text: `User "${username}" logged in`, type: 'success' })
          props.setUser(response.data[0])
        }
        else {
          props.setMessage({ text: `User "${username}" not found`, type: 'danger' })
          //props.setUser(null)
        }
      })
      .catch(error => {
        props.setMessage({ text: `Error: ${error.response && error.response.data && error.response.data.length > 0 ? error.response.data : error}`, type: 'danger' })
      })
      .finally(() => {
        setLoading(false)
        props.setShowUserModal(false)
      }), 1000)
  }

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
        _signin(setLoading)
      })
      .catch(error => {
        props.setMessage({ text: `Error: ${error.response && error.response.data && error.response.data.length > 0 ? error.response.data : error}`, type: 'danger' })
      })
      .finally(() => {
        setLoading(false)
        props.setShowUserModal(false)
      }), 1000)
  }

  return (
    <Modal title={registered ? 'Log in' : 'Sign up'} titleLoading={registered ? 'Logging in...' : 'Signing up...'}
      okClicked={(setLoading: (loading: boolean) => void) => registered ? _signin(setLoading) : _signup(setLoading)} 
      cancelClicked={() => props.setShowUserModal(false)}
      isDisabled={() => username.length === 0 || password.length === 0}>
      <div className="user-modal-root">
        <div className="user-modal-row">
          <label htmlFor="usernameInput" className="form-label">Username</label>
          <input ref={usernameInputRef} type="text" id="usernameInput" className="form-control" value={username} onChange={e => setUsername(e.target.value)}></input>
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
