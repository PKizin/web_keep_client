import { useState, useEffect, useRef, useCallback } from 'react';
import { useAppSelector } from '../custom_hook/useAppSelector';
import { TodoList } from './TodoList';
import { TodoListInterface } from './TodoListInterface';
import axios from 'axios';
import { FilePlus } from 'react-bootstrap-icons';
import './TodoListContainer.scss';
import { selectUser } from '../redux/userSlice';

function TodoListContainer (): JSX.Element {
  const [todoLists, setTodoLists] = useState<TodoListInterface[]>([])
  const [loading, setLoading] = useState(false)
  const todoListsRef = useRef<TodoListInterface[]>([])
  const user = useAppSelector(selectUser).user

  const changeTodoListCallback = useCallback((todoList: TodoListInterface, title: string) => {
    let newTodoLists = todoListsRef.current.slice()
    let newTodoList = newTodoLists.find(l => l.id === todoList.id)
    if (newTodoList) {
      newTodoList.title = title
      setTodoLists(newTodoLists)
    }
  }, [])

  const patchTodoListCallback = useCallback((todoList: TodoListInterface) => {
    axios
      .patch('http://localhost:3001/todo_list', null, {
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
    if (user === null) {
      setTodoLists([])
    }
    else {
      setLoading(true)
      setTimeout(() => axios
        .get('http://localhost:3001/todo_list', {
          params: {
            user_id: user!.id
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
  }, [user])

  useEffect(() => {
    todoListsRef.current = todoLists
  }, [todoLists])

  function _postTodoList () {
    setLoading(true)
    setTimeout(() => user !== null && axios
      .post('http://localhost:3001/todo_list', null, {
        params: {
          user_id: user.id,
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
      {todoLists.map(todoList => 
        <TodoList todoList={todoList} key={todoList.id} 
        changeTodoList={changeTodoListCallback}
        patchTodoList={patchTodoListCallback}
        deleteTodoList={deleteTodoListCallback} />)}
      {loading ? 
        <div className="spinner-border" /> :
        <a href="/#" className="todo-list-container-button" onClick={() => _postTodoList()} data-testid="putTodoListButton">
          <FilePlus size={32} />
        </a>}
    </>
  )
}

export { TodoListContainer }
