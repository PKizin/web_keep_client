import { Observable, from, map, filter, mergeMap, takeUntil, delay } from 'rxjs'
import { getUser, getUserPending, getUserFulfilled, getUserCancelled } from './userSlice'
import { pushMessage } from './messageSlice'
import axios from 'axios'

export const getUserEpic = (action$: Observable<any>): Observable<any> => action$.pipe(
  filter(getUser.match),
  map((action) => ({ ...action, type: getUserPending.type }))
)

export const getUserPendingEpic = (action$: Observable<any>): Observable<any> => action$.pipe(
  filter(getUserPending.match),
  mergeMap((action: any) => from(axios
    .get('http://localhost:3001/user', {
      params: {
        'username': action.payload.username,
        'password': action.payload.password
      }
    })).pipe(
      delay(2000),
      map((response) => ({ type: getUserFulfilled.type, payload: response })),
      takeUntil(action$.pipe(
        filter(getUserCancelled.match)
      ))
    )
  )
)

export const getUserFulfilledEpic = (action$: Observable<any>): Observable<any> => action$.pipe(
  filter(getUserFulfilled.match),
  map((action) => ({
      type: pushMessage.type, 
      payload: { 
        type: 'success', 
        text: action.payload.data.length > 0 ?
          `User "${action.payload.data[0].login}" logged in` :
          `User "${action.payload.config.params.username}" not found` 
      }
  }))
)
