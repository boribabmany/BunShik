const ADMIN_ID = process.env.REACT_APP_ADMIN_ID;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD;

export const login = (id, password) => {
  return (
    id === ADMIN_ID &&
    password === ADMIN_PASSWORD
  );
};