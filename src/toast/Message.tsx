import { MessageInterface } from './MessageInterface'
import './Message.scss'

interface Props {
  message: MessageInterface,
  onDelete: (message: MessageInterface) => void
}

function Message(props: Props) {
  return (
    <div className={`alert alert-dismissible alert-${props.message.type} user-select-none custom-message`}>
      {props.message.text}
      <div className="btn-close" onClick={() => props.onDelete(props.message)} />
    </div>
  )
}

export { Message }