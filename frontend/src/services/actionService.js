import { dataService } from './dataService';
import { authService } from './authService';

const baseUrl = process.env.REACT_APP_BACKEND_URL + `/action`;

export const actionService = {
  create,
  getActionByDateAndId
};

function create(action) { 
  return dataService.post(baseUrl, action);
}

function getActionByDateAndId(date) { 
  return dataService.post(`${baseUrl}/action`, date);
}