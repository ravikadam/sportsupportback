const httpStatus = require('http-status');
const { pick } = require('lodash');
const AppError = require('../utils/AppError');
const { User, Contact, RoleAccess } = require('../models');
const { getQueryOptions } = require('../utils/service.util');

const checkDuplicateEmail = async (email, excludeUserId) => {
  const user = await User.findOne({ email, _id: { $ne: excludeUserId } });
  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
};

const createUser = async userBody => {
  await checkDuplicateEmail(userBody.email);
  const cont = await Contact.create(userBody);
  const ubody = userBody;
  ubody.contact = cont._id;
  const user = await User.create(ubody);
  return user;
};

const getUsers = async query => {
  const filter = pick(query, ['firstname', 'role']);
  const options = getQueryOptions(query);
  const users = await User.find(filter, null, options)
    .populate('contact')
    .populate('role');
  return users;
};

const getRoleAccessForUser = async userrole => {
  const filter = pick({ roleid: { $in: userrole._id } });
  const roleaccess = await RoleAccess.find(filter, null, null)
    .populate('menu')
    .populate('roleid');
  return roleaccess;
};

const getUserById = async userId => {
  const user = await User.findById(userId)
    .populate('contact')
    .populate('role');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  } else {
    const userrole = await getRoleAccessForUser(user.role);
    return userrole;
  }
};

const getUserByEmail = async email => {
  const user = await User.findOne({ email })
    .populate('contact')
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'No user found with this email');
  }
  return user;
};

const updateUser = async (userId, updateBody) => {
  const user = await User.findById(userId)
    .populate('contact')
    .populate('role');

  const cont = await Contact.findById(user.contact._id);

  updateBody.email = user.email;
  const fstr = updateBody.firstName;
  const lstr = updateBody.lastName;
  const nstr = { fstr } + { lstr };
  updateBody.name = nstr;

  cont.firstname = updateBody.firstname;
  cont.lastname = updateBody.lastname;

  Object.assign(cont, updateBody);
  Object.assign(user, updateBody);

  await user.save();
  await cont.save();
  return user;
};

const deleteUser = async userId => {
  const user = await getUserById(userId);
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  getRoleAccessForUser,
  updateUser,
  deleteUser,
};
