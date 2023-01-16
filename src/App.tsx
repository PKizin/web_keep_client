import './App.scss';
import { useState, useEffect, useRef } from 'react';
import { UserModal } from './modal/UserModal'
import { UserInterface } from './modal/UserInterface';
import { Toast } from './toast/Toast'
import { MessageInterface } from './toast/MessageInterface';
import { TodoListContainer } from './todo_list/TodoListContainer';
import _ from 'lodash';

function App() {
  const [timer, setTimer] = useState(_parseDate(new Date()))
  const [user, setUser] = useState<UserInterface | null>(null)
  const [showUserModal, setShowUserModal] = useState<boolean>(false)
  const [message, setMessage] = useState<MessageInterface>({ text: '', type: 'warning' })
  const lastMessageRef = useRef<MessageInterface>({ text: '', type: 'warning' })

  useEffect(() => {
    const userSaved = sessionStorage.getItem('user')
    if (userSaved !== null) {
      setUser(JSON.parse(userSaved))
    }
  }, [])

  useEffect(() => {
    const timerInterval = setInterval(() => setTimer(_parseDate(new Date())), 1000)
    return () => clearInterval(timerInterval)
  }, [])

  useEffect(() => {
    if (user !== null) {
      sessionStorage.setItem('user', JSON.stringify(user))
    }
    else {
      sessionStorage.removeItem('user')
    }
  }, [user])

  useEffect(() => {
    lastMessageRef.current = message
  }, [message])

  /*function getName<Type extends Named>(obj: Type) : string {
    return obj.name
  }

  function getDatabaseCredentials({ name, username = 'defaultUsername', password = 'defaultPassword'}: Database) : string[] {
    return [username, password]
  }*/

  function _setUserCallback(user: UserInterface | null) {
    setUser(user)
  }

  function _setShowUserModalCallback(showUserModal: boolean) {
    setShowUserModal(showUserModal)
  }

  function _setMessageCallback(message_: MessageInterface) {
    setMessage({ id: lastMessageRef.current.id === undefined ? 0 : lastMessageRef.current.id + 1, ... message_ })
  }

  function _parseDate(date: Date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  function _logout() {
    if (user !== null) {
      _setMessageCallback({ text: `User "${user.login}" logged out`, type: 'success' })
      _setUserCallback(null)
    }
  }

  return (
    <>
      <div className="layout-root">
        <div className="layout-header">
          <div className="layout-header-timer">
            {timer}
          </div>
          <div className="flex-grow-1" />
          <div className="layout-header-auth">
            <a href="#" className="layout-header-user" onClick={() => setShowUserModal(true)}>
              {user === null ? 'guest' : user.login}
            </a>
            <a href="#" onClick={() => _logout()}>
              <i className="bi bi-box-arrow-left" />
            </a>
          </div>
        </div>
        <div className="layout-body">
          <Toast {...message} />
          <TodoListContainer user={user} />
        </div>
        <div className="layout-footer">
          Copyright © 2023 Made by Gamekoff
        </div>
      </div>
      {showUserModal && 
        <UserModal setUser={_setUserCallback} setShowUserModal={_setShowUserModalCallback} setMessage={_setMessageCallback} />}
    </>
  );
}

export default App;
