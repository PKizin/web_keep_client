import { useState, useEffect, useRef, useCallback } from "react";
import { useAppSelector } from '../custom_hook/useAppSelector';
import { Message } from './Message';
import { MessageInterface, selectMessage } from '../redux/messageSlice';
import './Toast.scss';

function Toast (): JSX.Element {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const messagesRef = useRef<MessageInterface[]>([])
  const message = useAppSelector(selectMessage).message

  const deleteMessageCallback = useCallback((message: MessageInterface) => {
    const messageIndex = messagesRef.current.findIndex(m => m.id === message.id)
    if (messageIndex >= 0) {
      setMessages([...messagesRef.current.slice(0, messageIndex), ...messagesRef.current.slice(messageIndex + 1)])
    }
  }, [])

  useEffect(() => {
    if (message !== null) {
      const extMessage = {
        ...message,
        id: (messagesRef.current.length > 0) ? (messagesRef.current[0].id! - 1) : 0
      }
      setMessages([extMessage, ...messagesRef.current])
      setTimeout(() => deleteMessageCallback(extMessage), 5000)
    }
  }, [message, deleteMessageCallback])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  return (
    <div className="my-toast">
      {messages.map((msg, i) => 
        <Message message={msg} onDelete={deleteMessageCallback} key={msg.id} />)}
    </div>
  )
}

export { Toast }
