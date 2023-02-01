import { useState, useEffect, useRef, useCallback } from "react";
import { TodoListInterface } from './TodoListInterface';
import { TodoItemInterface } from './TodoItemInterface';
import { TodoItem } from './TodoItem';
import './TodoList.scss'
import axios from 'axios';
import { PlusSquare } from 'react-bootstrap-icons';
import { TodoTitle } from "./TodoTitle";

interface Props {
  todoList: TodoListInterface,
  changeTodoList: (todoList: TodoListInterface, title: string) => void,
  postTodoList: (todoList: TodoListInterface) => void,
  deleteTodoList: (todoList: TodoListInterface) => void
}

function TodoList (props: Props): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [todoItems, setTodoItems] = useState<TodoItemInterface[]>([])
  const todoItemsRef = useRef<TodoItemInterface[]>([])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    todoItemsRef.current = todoItems
  }, [todoItems])

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
            <TodoTitle {...props} />
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
                <a href="/#" onClick={() => _putTodoItem()} data-testid="putTodoItemButton">
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