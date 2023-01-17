import { useState, useEffect } from 'react';
import { TodoList } from './TodoList';
import { UserInterface } from '../modal/UserInterface';
import { TodoListInterface } from './TodoListInterface';
import axios from 'axios';
import { FilePlus } from 'react-bootstrap-icons';
import './TodoListContainer.scss';

interface Props {
  user: UserInterface | null
}

function TodoListContainer (props: Props) {
  const [todoLists, setTodoLists] = useState<TodoListInterface[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.user !== null) {
      _getTodoLists()
    } 
    else if (todoLists.length > 0) {
      setTodoLists([])
    }
  }, [props.user])

  function _getTodoLists () {
    setLoading(true)
    setTimeout(() => props.user !== null && axios
      .get('http://localhost:3001/todo_list', {
        params: {
          user_id: props.user.id
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

  function _deleteTodoList (todoList: TodoListInterface) {
    axios
      .delete('http://localhost:3001/todo_list', {
        params: {
          id: todoList.id
        }
      })
      .then(() => {
        setTodoLists(todoLists.filter(l => l.id !== todoList.id))
      })
  }

  function _changeTodoList (todoList: TodoListInterface, title: string) {
    let newTodoLists = todoLists.slice()
    let newTodoList = newTodoLists.find(l => l.id === todoList.id)
    if (newTodoList) {
      newTodoList.title = title
      setTodoLists(newTodoLists)
    }
  }

  function _postTodoList (todoList: TodoListInterface) {
    axios
      .post('http://localhost:3001/todo_list', null, {
        params: {
          id: todoList.id,
          title: todoList.title
        }
      })
  }

  return (
    <>
      {props.user === null ?
        <h5>Hello, guest! Please sign up!</h5> :
        <>
          {todoLists.map(todoList => 
            <TodoList todoList={todoList} key={todoList.id} 
            deleteTodoList={() => _deleteTodoList(todoList)}
            changeTodoList={title => _changeTodoList(todoList, title)}
            postTodoList={() => _postTodoList(todoList)} />)}
          {loading ? 
            <div className="spinner-border" /> :
            <a href="#" className="todo-list-container-button" onClick={() => _putTodoList()}>
              <FilePlus size={32} />
            </a>}
        </>}
    </>
  )
}

export { TodoListContainer }
