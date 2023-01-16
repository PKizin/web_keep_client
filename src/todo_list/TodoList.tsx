import { useState, useEffect, useRef } from "react";
import { useUpdateEffect } from '../custom_hook/useUpdateEffect';
import { TodoListInterface } from './TodoListInterface';
import { TodoItemInterface } from './TodoItemInterface';
import { TodoItem } from './TodoItem';
import './TodoList.scss'
import axios from 'axios';
import { Pencil, Trash3, PlusSquare } from 'react-bootstrap-icons';

interface Props {
  todoList: TodoListInterface,
  changeTodoList: (title: string) => void,
  postTodoList: () => void,
  deleteTodoList: () => void
}

function TodoList (props: Props) {
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState<boolean>(false)
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

  useUpdateEffect(() => {
    props.postTodoList()
  }, [props.todoList.title])

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

  function _changeTodoItem (todoItem: TodoItemInterface, label: string, checked: boolean) {
    let newTodoItems = todoItems.slice()
    let newTodoItem = newTodoItems.find(i => i.id === todoItem.id)
    if (newTodoItem) {
      newTodoItem.label = label
      newTodoItem.checked = checked
      setTodoItems(newTodoItems)
    }
  }

  function _postTodoItem (todoItem: TodoItemInterface) {
    axios
      .post('http://localhost:3001/todo_item', null, {
        params: {
          id: todoItem.id,
          label: todoItem.label,
          checked: todoItem.checked
        }
      })
  }

  function _deleteTodoItem (todoItem: TodoItemInterface) {
    axios
      .delete('http://localhost:3001/todo_item', {
        params: {
          id: todoItem.id
        }
      })
      .then(() => {
        setTodoItems(todoItems.filter(i => i.id !== todoItem.id))
      })
  }

  function _putTodoItem () {
    axios
      .put('http://localhost:3001/todo_item', null, {
        params: {
          list_id: props.todoList.id,
          label: 'New item'
        }
      })
      .then(response => {
        if (response && response.data) {
          setTodoItems([...todoItems, { id: response.data, label: 'New item', checked: false }])
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
                  onChange={event => props.changeTodoList(event.target.value)} /> :
                props.todoList.title}
              <div className="flex-grow-1" />
              <a href="#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)}>
                <Pencil />
              </a>
              <a href="#" className="card-title-layout-button additional-margin" onClick={() => props.deleteTodoList()}>
                <Trash3 />
              </a>
            </div>
          </h5>
          <div className="card-text user-select-none">
            {loading ? 
              <div className="spinner-border spinner-border-sm" /> : 
              <>
                {todoItems.map(todoItem =>
                  <TodoItem todoItem={todoItem} key={todoItem.id}
                    changeTodoItem={(label, checked) => _changeTodoItem(todoItem, label, checked)}
                    postTodoItem={() => _postTodoItem(todoItem)}
                    deleteTodoItem={() => _deleteTodoItem(todoItem)} />)}
                <a href="#" onClick={() => _putTodoItem()}>
                  <PlusSquare />
                </a>
              </>}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TodoList }