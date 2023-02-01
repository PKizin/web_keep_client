import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Guest user body', () => {
  render(<App />)
  const h5: HTMLHeadingElement = screen.getByText('Hello, guest! Please sign up!')
  expect(h5).toBeInTheDocument()
});

test('Login', async () => {
  render(<App />)
  const link: HTMLLinkElement = screen.getByText('guest')
  expect(link).toBeInTheDocument()
  fireEvent.click(link)

  const usernameInput: HTMLInputElement = screen.getByLabelText('Username')
  expect(usernameInput).toBeInTheDocument()
  fireEvent.focus(usernameInput)
  fireEvent.change(usernameInput, { target: { value: 'admin' }})
  const passwordInput: HTMLInputElement = screen.getByLabelText('Password')
  expect(passwordInput).toBeInTheDocument()
  fireEvent.focus(passwordInput)
  fireEvent.change(passwordInput, { target: { value: 'admin' }})
  
  const button: HTMLButtonElement = screen.getByText('OK')
  expect(button).toBeInTheDocument()
  fireEvent.click(button)

  const newLink: HTMLLinkElement = await screen.findByText('admin', {}, { timeout: 5000 })
  expect(newLink).toBeInTheDocument()
})
