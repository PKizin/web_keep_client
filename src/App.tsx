import './App.scss';
import './context/ThemeContext.scss';
import { useState, useEffect, useRef, useCallback } from 'react';
import { UserModal } from './modal/UserModal'
import { UserInterface } from './modal/UserInterface';
import { Toast } from './toast/Toast'
import { MessageInterface } from './toast/MessageInterface';
import { TodoListContainer } from './todo_list/TodoListContainer';
import { DiaryContainer } from './diary/DiaryContainer';
import { WeeklyContainer } from './weekly/WeeklyContainer';
import { BoxArrowLeft, Gear, Github } from 'react-bootstrap-icons';
import { SettingsModal } from './modal/SettingsModal';
import { TodoLiteral, DiaryLiteral, WeeklyLiteral, SettingsInterface } from './modal/SettingsInterface';
import { Timer } from './timer/Timer';

function App(): JSX.Element {
  const [user, setUser] = useState<UserInterface | null>(null)
  const [type, setType] = useState<SettingsInterface>(TodoLiteral)
  const [showModal, setShowModal] = useState<'user' | 'settings' | null>(null)
  const [message, setMessage] = useState<MessageInterface>({ text: '', type: 'warning' })
  const [darkTheme, setDarkTheme] = useState(false)
  const lastMessageRef = useRef<MessageInterface>({ text: '', type: 'warning' })

  const setMessageCallback = useCallback((message_: MessageInterface) => {
    setMessage({ id: lastMessageRef.current.id === undefined ? 0 : lastMessageRef.current.id + 1, ...message_ })
  }, [])

  useEffect(() => {
    const userSaved = sessionStorage.getItem('user')
    if (userSaved !== null) {
      setUser(JSON.parse(userSaved))
    }
  }, [])

  useEffect(() => {
    const darkThemeSaved = sessionStorage.getItem('darkTheme')
    if (darkThemeSaved !== null) {
      setDarkTheme(darkThemeSaved === 'true')
    }
  }, [])

  useEffect(() => {
    if (user === null) {
      sessionStorage.removeItem('user')
    }
    else {
      sessionStorage.setItem('user', JSON.stringify(user))
    }
  }, [user])

  useEffect(() => {
    if (darkTheme) {
      sessionStorage.setItem('darkTheme', 'true')
    }
    else {
      sessionStorage.removeItem('darkTheme')
    }
  }, [darkTheme])

  useEffect(() => {
    if (user !== null) {
      const typeSaved = sessionStorage.getItem(user.login + 'Type')
      if (typeSaved === DiaryLiteral) {
        setType(DiaryLiteral)
      }
      else if (typeSaved === WeeklyLiteral) {
        setType(WeeklyLiteral)
      }
    }
  }, [user])

  useEffect(() => {
    if (user !== null) {
      if (type === TodoLiteral) {
        sessionStorage.removeItem(user.login + 'Type')
      }
      else {
        sessionStorage.setItem(user.login + 'Type', type as NonNullable<typeof type>)
      }
    }
  }, [user, type])

  useEffect(() => {
    lastMessageRef.current = message
  }, [message])

  /*function getName<Type extends Named>(obj: Type) : string {
    return obj.name
  }

  function getDatabaseCredentials({ name, username = 'defaultUsername', password = 'defaultPassword'}: Database) : string[] {
    return [username, password]
  }*/

  function _logout () {
    setMessageCallback({ text: `User "${user!.login}" logged out`, type: 'success' })
    setUser(null)
  }

  return (
    <div className={`${darkTheme ? 'theme-dark' : 'theme-light'}`}>
      <div className="layout-root themed">
        <div className="layout-header">
          <div className="layout-header-timer">
            <Timer />
          </div>
          <div className="form-check form-switch layout-header-switch">
            <input id="themeSwitch" type="checkbox" className="form-check-input layout-header-switch-input" checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} />
            <label htmlFor="themeSwitch" className="form-check-label">{darkTheme ? 'Dark theme' : 'Light theme'}</label>
          </div>
          <div className="flex-grow-1" />
          <div className="layout-header-auth">
            <a href="/#" className="layout-header-user" onClick={() => setShowModal('user')}>
              {user === null ? 'guest' : user.login}
            </a>
            <a href="/#" onClick={() => (user !== null) && _logout()}>
              <BoxArrowLeft />
            </a>
            <a href="/#" onClick={() => (user !== null) && setShowModal('settings')}>
              <Gear />
            </a>
          </div>
        </div>
        <div className="layout-body">
          <Toast message={message} />
          {user === null ?
            <h5>Hello, guest! Please sign up!</h5> :
            type === TodoLiteral ? 
              <TodoListContainer user={user} /> :
              type === DiaryLiteral ?
                <DiaryContainer user={user} /> :
                <WeeklyContainer user={user} />}
        </div>
        <div className="layout-footer">
          Copyright&nbsp;<Github />&nbsp;2023 Made by Gamekoff
        </div>
      </div>
      {showModal === 'user' && 
        <UserModal hideModal={() => setShowModal(null)} setUser={user => setUser(user)} setMessage={setMessageCallback} />}
      {showModal === 'settings' &&
        <SettingsModal hideModal={() => setShowModal(null)} user={user as NonNullable<UserInterface>} type={type} setType={type => setType(type)}/>}
    </div>
  );
}

export default App;
