import { TodoItemInterface } from './TodoItemInterface';
import './TodoItem.scss';
import axios from 'axios';

interface Props {
  todoItem: TodoItemInterface,
  setTodoItem: (todoItem: TodoItemInterface, checked: boolean) => void
}

function TodoItem (props: Props) {
  return (
    <div>
      <input id={`itemCheckbox${props.todoItem.id}`} type="checkbox" className="form-check-input me-2" checked={props.todoItem.checked} onChange={() => props.setTodoItem(props.todoItem, !props.todoItem.checked)} />
      <label htmlFor={`itemCheckbox${props.todoItem.id}`} className={`form-check-label ${props.todoItem.checked ? 'todo-item-label-checked' : ''}`}>{props.todoItem.label}</label>
    </div>
  )
}

export { TodoItem }
