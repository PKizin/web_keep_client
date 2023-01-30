import { useState, useEffect, useRef, useCallback } from "react";
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import { TodoListInterface } from './TodoListInterface';
import { TodoItemInterface } from './TodoItemInterface';
import { TodoItem } from './TodoItem';
import './TodoList.scss'
import axios from 'axios';
import { Pencil, PencilFill, Trash3, PlusSquare } from 'react-bootstrap-icons';

interface Props {
  todoList: TodoListInterface,
  changeTodoList: (todoList: TodoListInterface, title: string) => void,
  postTodoList: (todoList: TodoListInterface) => void,
  deleteTodoList: (todoList: TodoListInterface) => void
}

function TodoList (props: Props): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState<boolean>(false)
  const [todoItems, setTodoItems] = useState<TodoItemInterface[]>([])
  const todoItemsRef = useRef<TodoItemInterface[]>([])
  const titleInputRef = useRef<HTMLInputElement>(null)

  const changeTodoItemCallback = useCallback((todoItem: TodoItemInterface, label: string, checked: boolean) => {
    let newTodoItems = todoItemsRef.current.slice()
    let newTodoItem = newTodoItems.find(i => i.id === todoItem.id)
    if (newTodoItem) {
      newTodoItem.label = label
      newTodoItem.checked = checked
      setTodoItems(newTodoItems)
    }
  }, [])

  const postTodoItemCallback = useCallback((todoItem: TodoItemInterface) => {
    axios
      .post('http://localhost:3001/todo_item', null, {
        params: {
          id: todoItem.id,
          label: todoItem.label,
          checked: todoItem.checked
        }
      })
  }, [])

  const deleteTodoItemCallback = useCallback((todoItem: TodoItemInterface) => {
    axios
      .delete('http://localhost:3001/todo_item', {
        params: {
          id: todoItem.id
        }
      })
      .then(() => {
        setTodoItems(todoItemsRef.current.filter(i => i.id !== todoItem.id))
      })
  }, [])

  useEffect(() => {
    if (!props.todoList.isNew) {
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
  }, [props.todoList.id, props.todoList.isNew])

  useEffect(() => {
    if (edit && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [edit])

  useEffect(() => {
    todoItemsRef.current = todoItems
  }, [todoItems])

  useKeyupEffect(titleInputRef, ['Enter', 'Escape'], () => {
    if (edit) {
      setEdit(false)
    }
  }, [edit])

  useUpdatePropEffect(() => {
    props.postTodoList(props.todoList)
  }, [props.todoList.title])

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
  
  return (
    <div>
      <div className="card todo-card themed">
        <div className="card-body">
          <h5 className="card-title user-select-none">
            <div className="card-title-layout">
              {edit ? 
                <input type="text" className="form-control font-control-sm" ref={titleInputRef} 
                  value={props.todoList.title} size={props.todoList.title.length}
                  onChange={event => props.changeTodoList(props.todoList, event.target.value)} /> :
                props.todoList.title}
              <div className="flex-grow-1"></div>
              <a href="/#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)}>
                {edit ? 
                  <PencilFill /> :
                  <Pencil />}
              </a>
              <a href="/#" className="card-title-layout-button additional-margin" onClick={() => props.deleteTodoList(props.todoList)}>
                <Trash3 />
              </a>
            </div>
          </h5>
          <div className="card-text user-select-none">
            {loading ? 
              <div className="spinner-border spinner-border-sm" /> : 
              <>
                {todoItems.filter(todoItem => !todoItem.checked).map(todoItem =>
                  <TodoItem todoItem={todoItem} key={todoItem.id}
                    changeTodoItem={changeTodoItemCallback}
                    postTodoItem={postTodoItemCallback}
                    deleteTodoItem={deleteTodoItemCallback} />)}
                <a href="/#" onClick={() => _putTodoItem()}>
                  <PlusSquare />
                </a>
                {todoItems.some(i => i.checked) ? 
                  <>
                    <hr />
                    {todoItems.filter(todoItem => todoItem.checked).map(todoItem => 
                      <TodoItem todoItem={todoItem} key={todoItem.id}
                      changeTodoItem={changeTodoItemCallback}
                      postTodoItem={postTodoItemCallback}
                      deleteTodoItem={deleteTodoItemCallback} />)}
                  </> : ''}
              </>}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TodoList }