import { MessageInterface } from './MessageInterface';
import { XLg } from 'react-bootstrap-icons';
import './Message.scss';

interface Props {
  message: MessageInterface,
  onDelete: (message: MessageInterface) => void
}

function Message(props: Props) {
  return (
    <div className={`alert alert-${props.message.type} user-select-none custom-message`}>
      <div className="d-flex">
        <div className="flex-grow-1">
          {props.message.text}
        </div>
        <div>
          <a href="/#" onClick={() => props.onDelete(props.message)} data-testid="deleteMessageButton">
            <XLg size={24}/>
          </a>
        </div>
      </div>
    </div>
  )
}

export { Message }