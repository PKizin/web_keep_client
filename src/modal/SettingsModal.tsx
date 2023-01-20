import { Modal } from './Modal';
import { UserInterface } from './UserInterface';
import { TodoLiteral, DiaryLiteral, WeeklyLiteral, SettingsInterface } from './SettingsInterface';
import './SettingsModal.scss';

interface Props {
  user: UserInterface,
  type: SettingsInterface,
  setType: (type: SettingsInterface) => void
  hideModal: () => void
}

function SettingsModal (props: Props) {

  return (
    <Modal title="Settings" okClicked={() => props.hideModal()} cancelClicked={() => props.hideModal()}>
      <div className="settings-modal-root">
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType1" name="todoListType" checked={props.type === TodoLiteral} onChange={() => props.setType(TodoLiteral)} />
            <label className="form-check-label" htmlFor="todoListType1">Todo list</label>
          </div>
        </div>
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType2" name="todoListType" checked={props.type === DiaryLiteral} onChange={() => props.setType(DiaryLiteral)} />
            <label className="form-check-label" htmlFor="todoListType2">Diary</label>
          </div>
        </div>
        <div className="settings-modal-row">
          <div className="form-check">
            <input className="form-check-input" type="radio" id="todoListType3" name="todoListType" checked={props.type === WeeklyLiteral} onChange={() => props.setType(WeeklyLiteral)} />
            <label className="form-check-label" htmlFor="todoListType3">Weekly</label>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export { SettingsModal }
