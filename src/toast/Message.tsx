import { MessageInterface } from './MessageInterface'

interface Props {
  message: MessageInterface,
  onDelete: (message: MessageInterface) => void
}

function Message(props: Props) {
  return (
    <div className={`alert alert-dismissible alert-${props.message.type} user-select-none`}>
      {props.message.text}
      <div className="btn-close" onClick={() => props.onDelete(props.message)} />
    </div>
  )
}

export { Message }