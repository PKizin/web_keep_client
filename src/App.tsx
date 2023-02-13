import './App.scss';
import './context/ThemeContext.scss';
import { useState, useEffect } from 'react';
import { useAppSelector } from './custom_hook/useAppSelector';
import { useAppDispatch } from './custom_hook/useAppDispatch';
import { selectUser, logout, signin } from './redux/userSlice';
import { pushMessage } from './redux/messageSlice';
import { UserModal } from './modal/UserModal'
import { Toast } from './toast/Toast'
import { TodoListContainer } from './todo_list/TodoListContainer';
import { DiaryContainer } from './diary/DiaryContainer';
import { WeeklyContainer } from './weekly/WeeklyContainer';
import { BoxArrowLeft, Gear, Github } from 'react-bootstrap-icons';
import { SettingsModal } from './modal/SettingsModal';
import { TodoLiteral, DiaryLiteral, WeeklyLiteral, SettingsInterface } from './modal/SettingsInterface';
import { Timer } from './timer/Timer';

function App(): JSX.Element {
  const [type, setType] = useState<SettingsInterface>(TodoLiteral)
  const [showModal, setShowModal] = useState<'user' | 'settings' | null>(null)
  const [darkTheme, setDarkTheme] = useState(false)
  const user = useAppSelector(selectUser).user
  const dispatch = useAppDispatch()

  useEffect(() => {
    const userSaved = sessionStorage.getItem('user')
    if (userSaved !== null) {
      dispatch(signin(JSON.parse(userSaved)))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      else {
        setType(TodoLiteral)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  /*function getName<Type extends Named>(obj: Type) : string {
    return obj.name
  }

  function getDatabaseCredentials({ name, username = 'defaultUsername', password = 'defaultPassword'}: Database) : string[] {
    return [username, password]
  }*/

  function _logout () {
    dispatch(pushMessage({ text: `User "${user!.login}" logged out`, type: 'success' }))
    dispatch(logout())
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
          <Toast />
          {user === null ?
            <h5>Hello, guest! Please sign up!</h5> :
            type === TodoLiteral ? 
              <TodoListContainer /> :
              type === DiaryLiteral ?
                <DiaryContainer /> :
                <WeeklyContainer />}
        </div>
        <div className="layout-footer">
          Copyright&nbsp;<Github />&nbsp;2023 Made by Gamekoff
        </div>
      </div>
      {showModal === 'user' && 
        <UserModal hideModal={() => setShowModal(null)} />}
      {showModal === 'settings' &&
        <SettingsModal hideModal={() => setShowModal(null)} type={type} setType={type => setType(type)}/>}
    </div>
  );
}

export default App;
