import { useState, useEffect, useRef } from 'react';
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import { TodoItemInterface } from './TodoItemInterface';
import './TodoItem.scss';
import { Pencil, PencilFill, Trash3 } from 'react-bootstrap-icons';

interface Props {
  todoItem: TodoItemInterface,
  changeTodoItem: (todoItem: TodoItemInterface, label: string, checked: boolean) => void,
  postTodoItem: (todoItem: TodoItemInterface) => void,
  deleteTodoItem: (todoItem: TodoItemInterface) => void
}

function TodoItem (props: Props): JSX.Element {
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

  useUpdatePropEffect(() => {
    props.postTodoItem(props.todoItem)
  }, [props.todoItem.label, props.todoItem.checked])

  return (
    <div className="todo-item-layout">
      <input id={`itemCheckbox${props.todoItem.id}`} type="checkbox" 
        className="form-check-input me-2" checked={props.todoItem.checked} 
        onChange={() => props.changeTodoItem(props.todoItem, props.todoItem.label, !props.todoItem.checked)} />
      {edit ?
        <input type="text" className="form-control form-control-sm w-auto" ref={labelInputRef} value={props.todoItem.label} size={props.todoItem.label.length}
          onChange={event => props.changeTodoItem(props.todoItem, event.target.value, props.todoItem.checked)} data-testid="todoItemLabelInput" /> :
        <label htmlFor={`itemCheckbox${props.todoItem.id}`} className={`form-check-label ${props.todoItem.checked ? 'todo-item-label-checked' : ''}`} data-testid="todoItemLabel">{props.todoItem.label}</label>}
      <div className="flex-grow-1" />
      <a href="/#" className="todo-item-layout-button ms-3" onClick={() => setEdit(!edit)} data-testid="setEditTodoItemButton">
        {edit ?
          <PencilFill /> :
          <Pencil />}
      </a>
      <a href="/#" className="todo-item-layout-button additional-margin" onClick={() => props.deleteTodoItem(props.todoItem)} data-testid="deleteTodoItemButton">
        <Trash3 />
      </a>
    </div>
  )
}

export { TodoItem }
