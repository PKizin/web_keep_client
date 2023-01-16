import { useState, useEffect } from 'react';
import { TodoList } from './TodoList';
import { UserInterface } from '../modal/UserInterface';
import { TodoListInterface } from './TodoListInterface';
import axios from 'axios';

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

  function _postTodoList (todoList: TodoListInterface, title: string) {
    axios
      .post('http://localhost:3001/todo_list', null, {
        params: {
          id: todoList.id,
          title: title
        }
      })
      .then(() => {
        let newTodoLists = todoLists.slice()
        let newTodoList = newTodoLists.find(l => l.id === todoList.id)
        if (newTodoList) {
          newTodoList.title = title
          setTodoLists(newTodoLists)
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
            postTodoList={title => _postTodoList(todoList, title)} />)}
          {loading ? 
            <div className="spinner-border" /> :
            <a href="#" onClick={() => _putTodoList()}>
              <i className="bi bi-file-plus" />
            </a>}
        </>}
    </>
  )
}

export { TodoListContainer }
