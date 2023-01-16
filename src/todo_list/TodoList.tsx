import { useState, useEffect, useRef } from "react";
import { TodoListInterface } from './TodoListInterface';
import { TodoItemInterface } from './TodoItemInterface';
import { TodoItem } from './TodoItem';
import './TodoList.scss'
import axios from 'axios';

interface Props {
  todoList: TodoListInterface,
  postTodoList: (title: string) => void,
  deleteTodoList: () => void
}

function TodoList (props: Props) {
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [todoItems, setTodoItems] = useState<TodoItemInterface[]>([])
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!props.todoList.isNew) {
      _getTodoItems()
    }
  }, [])

  useEffect(() => {
    if (edit && titleInputRef.current !== null) {
      titleInputRef.current.focus()
    }
  }, [edit])

  function _setTodoItemsCallback (todoItem: TodoItemInterface, checked: boolean) {
    let newTodoItems = todoItems.slice()
    let newTodoItem = newTodoItems.find(i => i.id === todoItem.id)
    if (newTodoItem) {
      newTodoItem.checked = checked
      setTodoItems(newTodoItems)
      _postTodoItem(newTodoItem)
    }
  }

  function _getTodoItems () {
    setLoading(true)
    setTimeout(() => axios
      .get('http://localhost:3001/todo_item', {
        params: {
          id: props.todoList.id
        }
      })
      .then(response => {
        if (response && response.data) {
          setTodoItems(response.data)
        }
      })
      .finally(() => {
        setLoading(false)
      }), 100)
  }

  function _postTodoItem (todoItem: TodoItemInterface) {
    axios
      .post('http://localhost:3001/todo_item', null, {
        params: {
          id: todoItem.id,
          checked: todoItem.checked
        }
      })
  }

  function _onKeyUp(event: any) {
    if (event.key === 'Enter') {
      setEdit(false)
    }
  }
  
  return (
    <div>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title user-select-none">
            <div className="card-title-layout">
              {edit ? 
                <input type="text" className="form-control" ref={titleInputRef} 
                  value={props.todoList.title} onKeyUp={event => _onKeyUp(event)} 
                  onChange={event => props.postTodoList(event.target.value)} /> :
                props.todoList.title}
              <a href="#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)}>
                <i className="bi bi-pencil" />
              </a>
              <a href="#" className="card-title-layout-button" onClick={() => props.deleteTodoList()}>
                <i className="bi bi-trash3" />
              </a>
            </div>
          </h5>
          <div className="card-text user-select-none">
            {loading ? <div className="spinner-border spinner-border-sm" /> : todoItems.map(todoItem =>
              <TodoItem todoItem={todoItem} setTodoItem={_setTodoItemsCallback} key={todoItem.id} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TodoList }