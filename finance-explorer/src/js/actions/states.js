import { TASK_LOAD, TASK_UNLOAD } from '../actions';
import {
  watchTask, unwatchTask
} from '../api/tasks';

export function loadState(id) {
  return dispatch => (
    watchTask(id)
      .on('success',
        payload => dispatch({ type: TASK_LOAD, payload })
      )
      .on('error',
        payload => dispatch({ type: TASK_LOAD, error: true, payload })
      )
      .start()
  );
}

export function unloadState(id) {
  unwatchTask(id);
  return { type: TASK_UNLOAD };
}
