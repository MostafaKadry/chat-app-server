let users = [];

// add user 55 : 00
const addUsers = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  let existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  if (existingUser) {
    return { error: "user name already exists!!!" };
  }

  const user = { name, room, id };
  `user is added ${user.name} id: ${user.id}`;
  users.push(user);
  return { user };
};

// remove users
const removeUsers = (id) => {
  let wildeletedUsers = users.find((user) => user.id === id);
  let index = users.indexOf(wildeletedUsers);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

// get user
const getUser = (id) => users.find((user) => user.id === id);

// get users in room
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUsers,
  removeUsers,
  getUser,
  getUsersInRoom,
};
