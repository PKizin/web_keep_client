import { useState, useEffect, useRef } from 'react';
import { TodoListInterface } from './TodoListInterface';
import { Pencil, PencilFill, Trash3 } from 'react-bootstrap-icons';
import { useKeyupEffect } from '../custom_hook/useKeyupEffect';
import { useUpdatePropEffect } from '../custom_hook/useUpdatePropEffect';

interface Props {
  todoList: TodoListInterface,
  changeTodoList: (todoList: TodoListInterface, title: string) => void,
  postTodoList: (todoList: TodoListInterface) => void,
  deleteTodoList: (todoList: TodoListInterface) => void
}

function TodoTitle (props: Props) {
  const [edit, setEdit] = useState<boolean>(false)
  const titleInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (edit && titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }, [edit])

  useKeyupEffect(titleInputRef.current!, ['Enter', 'Escape'], () => {
    if (edit) {
      setEdit(false)
    }
  }, [edit])

  useUpdatePropEffect(() => {
    props.postTodoList(props.todoList)
  }, [props.todoList.title])

  return (
    <div className="card-title-layout">
      {edit ? 
        <input type="text" className="form-control font-control-sm" ref={titleInputRef} 
          value={props.todoList.title} size={props.todoList.title.length}
          onChange={event => props.changeTodoList(props.todoList, event.target.value)} data-testid="todoListTitleInput" /> :
        props.todoList.title}
      <div className="flex-grow-1"></div>
      <a href="/#" className="card-title-layout-button ms-3" onClick={() => setEdit(!edit)} data-testid="setEditTodoListButton">
        {edit ? 
          <PencilFill /> :
          <Pencil />}
      </a>
      <a href="/#" className="card-title-layout-button additional-margin" onClick={() => props.deleteTodoList(props.todoList)} data-testid="deleteTodoListButton">
        <Trash3 />
      </a>
    </div>
  )
}

export { TodoTitle }
