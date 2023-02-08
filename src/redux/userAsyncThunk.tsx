import axios from 'axios';

function postUser(username: string, password: string) {
  return new Promise<any>(resolve => {
    setTimeout(() => resolve(axios
      .post('http://localhost:3001/user', null, {
        params: {
          'username': username,
          'password': password
        }
      })), 1000)
  })
}

function getUser(username: string, password: string) {
  return new Promise<any>((resolve) => {
    setTimeout(() => resolve(axios
      .get('http://localhost:3001/user', {
        params: {
          'username': username,
          'password': password
        }
      })), 1000)
  })
}

export { postUser, getUser }
