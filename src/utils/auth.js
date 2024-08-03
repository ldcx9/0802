export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  
  export const getUserName = () => {
    return localStorage.getItem('userName');
  };
  
  export const setUserName = (userName) => {
    localStorage.setItem('userName', userName);
  };
  
  export const removeUserName = () => {
    localStorage.removeItem('userName');
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };