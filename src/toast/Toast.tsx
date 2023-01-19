import { useState, useEffect, useRef } from "react";
import { Message } from './Message';
import { MessageInterface } from './MessageInterface';
import './Toast.scss';

function Toast(message: MessageInterface) {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const lastMessagesRef = useRef<MessageInterface[]>([])

  useEffect(() => {
    if (message.id !== undefined) {
      _addMessage(message)
    }
  }, [message.id])

  useEffect(() => {
    lastMessagesRef.current = messages
  }, [messages])

  function _addMessage(message: MessageInterface) {
    setMessages([message, ...messages])
    setTimeout(() => _deleteMessage(message), 5000)
  }

  function _deleteMessage(message: MessageInterface) {
    const messageIndex = lastMessagesRef.current.findIndex(m => m.id === message.id)
    if (messageIndex >= 0) {
      setMessages([...lastMessagesRef.current.slice(0, messageIndex), ...lastMessagesRef.current.slice(messageIndex + 1)])
    }
  }

  return (
    <div className="my-toast">
      {messages.map((message, i) => 
        <Message message={message} onDelete={_deleteMessage} key={message.id} />)}
    </div>
  )
}

export { Toast }
