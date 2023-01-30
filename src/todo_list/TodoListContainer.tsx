import { useState, useEffect, useRef, useCallback } from 'react';
import { TodoList } from './TodoList';
import { UserInterface } from '../modal/UserInterface';
import { TodoListInterface } from './TodoListInterface';
import axios from 'axios';
import { FilePlus } from 'react-bootstrap-icons';
import './TodoListContainer.scss';

interface Props {
  user: UserInterface | null
}

function TodoListContainer (props: Props): JSX.Element {
  const [todoLists, setTodoLists] = useState<TodoListInterface[]>([])
  const [loading, setLoading] = useState(false)
  const todoListsRef = useRef<TodoListInterface[]>([])

  const changeTodoListCallback = useCallback((todoList: TodoListInterface, title: string) => {
    let newTodoLists = todoListsRef.current.slice()
    let newTodoList = newTodoLists.find(l => l.id === todoList.id)
    if (newTodoList) {
      newTodoList.title = title
      setTodoLists(newTodoLists)
    }
  }, [])

  const postTodoListCallback = useCallback((todoList: TodoListInterface) => {
    axios
      .post('http://localhost:3001/todo_list', null, {
        params: {
          id: todoList.id,
          title: todoList.title
        }
      })
  }, [])

  const deleteTodoListCallback = useCallback((todoList: TodoListInterface) => {
    axios
      .delete('http://localhost:3001/todo_list', {
        params: {
          id: todoList.id
        }
      })
      .then(() => {
        setTodoLists(todoListsRef.current.filter(l => l.id !== todoList.id))
      })
  }, [])

  useEffect(() => {
    if (props.user === null) {
      setTodoLists([])
    }
    else {
      setLoading(true)
      setTimeout(() => axios
        .get('http://localhost:3001/todo_list', {
          params: {
            user_id: props.user!.id
          }
        })
        .then(response => {
          if (response && response.data) {
            setTodoLists(response.data)
          }
        })
        .finally(() => {
          setLoading(false)
        }), 100)
    } 
  }, [props.user])

  useEffect(() => {
    todoListsRef.current = todoLists
  }, [todoLists])

  function _putTodoList () {
    setLoading(true)
    setTimeout(() => props.user !== null && axios
      .put('http://localhost:3001/todo_list', null, {
        params: {
          user_id: props.user.id,
          title: 'New list'
        }
      })
      .then(response => {
        if (response && response.data) {
          setTodoLists([...todoLists, { id: response.data, title: 'New list', isNew: true }])
        }
      })
      .finally(() => {
        setLoading(false)
      }), 100)
  }

  return (
    <>
      {props.user === null ?
        <h5>Hello, guest! Please sign up!</h5> :
        <>
          {todoLists.map(todoList => 
            <TodoList todoList={todoList} key={todoList.id} 
            changeTodoList={changeTodoListCallback}
            postTodoList={postTodoListCallback}
            deleteTodoList={deleteTodoListCallback} />)}
          {loading ? 
            <div className="spinner-border" /> :
            <a href="/#" className="todo-list-container-button" onClick={() => _putTodoList()}>
              <FilePlus size={32} />
            </a>}
        </>}
    </>
  )
}

export { TodoListContainer }
