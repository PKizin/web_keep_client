import { useState, useEffect } from 'react';
import { useUpdateEffect } from '../custom_hook/useUpdateEffect';
import { Modal } from './Modal';
import { UserInterface } from './UserInterface';
import './SettingsModal.scss';

interface Props {
  user: UserInterface,
  hideModal: () => void
}

function SettingsModal (props: Props) {
  const [type, setType] = useState<'todo' | 'diary' | 'weekly' | null>(null)

  useEffect(() => {
    const typeSaved = sessionStorage.getItem(props.user.login + 'Type')
    if (typeSaved === 'diary') {
      setType('diary')
    }
    else if (typeSaved === 'weekly') {
      setType('weekly')
    }
    else {
      setType('todo')
    }
  }, [])

  useUpdateEffect(() => {
    if (type === 'todo') {
      sessionStorage.removeItem(props.user.login + 'Type')
    }
    else {
      sessionStorage.setItem(props.user.login + 'Type', type as NonNullable<typeof type>)
    }
  }, [type])

  return (
    <Modal title="Settings" okClicked={() => props.hideModal()} cancelClicked={() => props.hideModal()}>
      <div className="settings-modal-root">
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType1" name="todoListType" checked={type === 'todo'} onChange={() => setType('todo')} />
            <label className="form-check-label" htmlFor="todoListType1">Todo list</label>
          </div>
        </div>
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType2" name="todoListType" checked={type === 'diary'} onChange={() => setType('diary')} />
            <label className="form-check-label" htmlFor="todoListType2">Diary</label>
          </div>
        </div>
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType3" name="todoListType" checked={type === 'weekly'} onChange={() => setType('weekly')} />
            <label className="form-check-label" htmlFor="todoListType3">Weekly</label>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { SettingsModal }
