import { dataService } from './dataService';
import { authService } from './authService';

const baseUrl = process.env.REACT_APP_BACKEND_URL + `/users`;

export const userService = {
  getTest,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

function getAll() {
  return authService.get(baseUrl);
}

function getTest() {
  return authService.getCurrentUser(baseUrl);
}

function getById(id) {
  return authService.get(`${baseUrl}/${id}`);
}

function create(user) {
  delete user.confirmedPassword;
  user.state = "offline";
  
  return dataService.post(baseUrl, user);
}

function update(id, user) {
  delete user.confirmedPassword;
  return authService.patch(`${baseUrl}/${id}`, user);
}

function _delete(id) {
  return authService.delete(`${baseUrl}/${id}`);
}
