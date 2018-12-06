import { SESSION_LOAD, SESSION_LOGIN, SESSION_LOGOUT } from '../actions';
import { deleteSession, postSession } from '../api/session';
import { updateHeaders } from '../api/utils';

const localStorage = window.localStorage;

export function initialize() {
  return (dispatch) => {
    const { email, name, token } = localStorage;
    if (true) {
      dispatch({
        type: SESSION_LOAD, payload: { email, name, token }
      });
    } else {
      window.location = '/login';
    }
  };
}

export function login(email, password, done) {
  return dispatch => (
      done()
  );
}

export function logout(session) {
  return (dispatch) => {
    dispatch({ type: SESSION_LOGOUT });
    deleteSession(session);
    updateHeaders({ Auth: undefined });
    try {
      localStorage.removeItem('email');
      localStorage.removeItem('name');
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    window.location.href = '/login'; // reload fully
  };
}
