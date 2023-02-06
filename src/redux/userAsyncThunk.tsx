import axios from 'axios';

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

export { getUser }
