import { useState, useEffect, useRef } from 'react';
import { useUpdateEffect } from '../custom_hook/useUpdateEffect';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import { TodoItemInterface } from './TodoItemInterface';
import './TodoItem.scss';
import { Pencil, Trash3 } from 'react-bootstrap-icons';

interface Props {
  todoItem: TodoItemInterface,
  changeTodoItem: (label: string, checked: boolean) => void,
  postTodoItem: () => void,
  deleteTodoItem: () => void
}

function TodoItem (props: Props) {
  const [edit, setEdit] = useState<boolean>(false)
  const labelInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (edit) {
      labelInputRef.current!.focus()
    }
  }, [edit])

  useKeyupEffect(labelInputRef, ['Enter', 'Escape'], () => {
    if (edit) {
      setEdit(false)
    }
  }, [edit])

  useUpdateEffect(() => {
    props.postTodoItem()
  }, [props.todoItem.label, props.todoItem.checked])

  return (
    <div className="todo-item-layout">
      <input id={`itemCheckbox${props.todoItem.id}`} type="checkbox" 
        className="form-check-input me-2" checked={props.todoItem.checked} 
        onChange={() => props.changeTodoItem(props.todoItem.label, !props.todoItem.checked)} />
      {edit ?
        <input type="text" className="form-control w-auto" ref={labelInputRef} value={props.todoItem.label}
          onChange={event => props.changeTodoItem(event.target.value, props.todoItem.checked)} /> :
        <label htmlFor={`itemCheckbox${props.todoItem.id}`} className={`form-check-label ${props.todoItem.checked ? 'todo-item-label-checked' : ''}`}>{props.todoItem.label}</label>}
      <div className="flex-grow-1" />
      <a href="#" className="todo-item-layout-button ms-3" onClick={() => setEdit(!edit)}>
        <Pencil />
      </a>
      <a href="#" className="todo-item-layout-button additional-margin" onClick={() => props.deleteTodoItem()}>
        <Trash3 />
      </a>
    </div>
  )
}

export { TodoItem }
