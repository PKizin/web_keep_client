import { useState, useEffect, useRef, useCallback } from "react";
import { Message } from './Message';
import { MessageInterface } from './MessageInterface';
import './Toast.scss';

interface Props {
  message: MessageInterface
}

function Toast(props: Props) {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const messagesRef = useRef<MessageInterface[]>([])

  const deleteMessageCallback = useCallback((message: MessageInterface) => {
    const messageIndex = messagesRef.current.findIndex(m => m.id === message.id)
    if (messageIndex >= 0) {
      setMessages([...messagesRef.current.slice(0, messageIndex), ...messagesRef.current.slice(messageIndex + 1)])
    }
  }, [])

  useEffect(() => {
    if (props.message.id !== undefined) {
      setMessages([props.message, ...messagesRef.current])
      setTimeout(() => deleteMessageCallback(props.message), 5000)
    }
  }, [props.message, deleteMessageCallback])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  return (
    <div className="my-toast">
      {messages.map((message, i) => 
        <Message message={message} onDelete={deleteMessageCallback} key={message.id} />)}
    </div>
  )
}

export { Toast }
