import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TodoListContainer } from './TodoListContainer'

test('TodoListContainer: CRUD TodoList', async () => {
  render(<TodoListContainer user={{ id: 51, login: 'test', password: 'test' }} />)
  
  const title: HTMLDivElement = await screen.findByText('Test list')
  expect(title).toBeInTheDocument()
  const button: HTMLButtonElement = screen.getByTestId('putTodoListButton')
  expect(button).toBeInTheDocument()
  fireEvent.click(button)

  const newTitle: HTMLDivElement = await screen.findByText('New list')
  expect(newTitle).toBeInTheDocument()
  const [, editButton]: HTMLLinkElement[] = screen.getAllByTestId('setEditTodoListButton')
  expect(editButton).toBeInTheDocument()
  fireEvent.click(editButton)
  
  const titleInput: HTMLInputElement = screen.getByTestId('todoListTitleInput')
  expect(titleInput).toBeInTheDocument()
  expect(titleInput).toHaveFocus()
  fireEvent.change(titleInput, { target: { value: '123' }})
  fireEvent.keyUp(titleInput, { key: 'Enter' })

  expect(titleInput).not.toBeInTheDocument()
  expect(newTitle).toHaveTextContent('123')
  const [, deleteButton]: HTMLLinkElement[] = screen.getAllByTestId('deleteTodoListButton')
  expect(deleteButton).toBeInTheDocument()
  fireEvent.click(deleteButton)

  await waitFor(() => expect(newTitle).not.toBeInTheDocument())
})

test('TodoListContainer: CRUD TodoItem', async () => {
  render(<TodoListContainer user={{ id: 51, login: 'test', password: 'test' }} />)

  const label: HTMLLabelElement = await screen.findByText('Test item')
  expect(label).toBeInTheDocument()
  const button: HTMLLinkElement = screen.getByTestId('putTodoItemButton')
  expect(button).toBeInTheDocument()
  fireEvent.click(button)

  const newLabel: HTMLLabelElement = await screen.findByText('New item')
  expect(newLabel).toBeInTheDocument()
  const [, editButton]: HTMLLinkElement[] = screen.getAllByTestId('setEditTodoItemButton')
  expect(editButton).toBeInTheDocument()
  fireEvent.click(editButton)

  const labelInput: HTMLInputElement = screen.getByTestId('todoItemLabelInput')
  expect(labelInput).toBeInTheDocument()
  expect(labelInput).toHaveFocus()
  fireEvent.change(labelInput, { target: { value: '123' }})
  fireEvent.keyUp(labelInput, { key: 'Enter' })
  
  expect(labelInput).not.toBeInTheDocument()
  const [, newLabel1]: HTMLLabelElement[] = screen.getAllByTestId('todoItemLabel')
  expect(newLabel1).toBeInTheDocument()
  expect(newLabel1).toHaveTextContent('123')
  const [, deleteButton]: HTMLLinkElement[] = screen.getAllByTestId('deleteTodoItemButton')
  expect(deleteButton).toBeInTheDocument()
  fireEvent.click(deleteButton)

  await waitFor(() => expect(newLabel).not.toBeInTheDocument())
})
