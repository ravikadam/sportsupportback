const roles = ['user', 'admin'];

const roleRights = new Map();
roleRights.set(roles[0], [
  'getUsers',
  'getUser',
  'manageUsers',
 
]);
roleRights.set(roles[1], ['getUsers', 'manageUsers']);

module.exports = {
  roles,
  roleRights,
};
