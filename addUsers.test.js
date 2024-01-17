// const { sequelize, User } = require('./db');

// describe('Добавление пользователей в базу данных', () => {
//   beforeAll(async () => {
//     await sequelize.sync();
//   });

//   afterAll(async () => {
//     await sequelize.close();
//   });

//   it('должен добавить заданное количество пользователей в базу данных', async () => {
//     const numberOfUsersToAdd = 10000; // Указываем количество пользователей для добавления

//     const addedUsers = [];

//     for (let i = 1; i <= numberOfUsersToAdd; i++) {
//       const user = {
//         username: `user${i}`,
//         email: `user${i}@example.com`,
//         password: `password${i}`,
//       };

//       const newUser = await User.create(user);
//       addedUsers.push(newUser);
//     }

//     expect(addedUsers.length).toBe(numberOfUsersToAdd);

//     // Проверьте, что каждый добавленный пользователь имеет ожидаемые свойства
//     for (let i = 0; i < numberOfUsersToAdd; i++) {
//       expect(addedUsers[i].username).toBe(`user${i + 1}`);
//       expect(addedUsers[i].email).toBe(`user${i + 1}@example.com`);
//       expect(addedUsers[i].password).toBe(`password${i + 1}`);
//     }
//   }, 30000000);
// });







// const axios = require('axios');

// describe('User registration', () => {
//   const addUser = async (username, email, password) => {
//     const response = await axios.post('http://localhost:3000/auth', {
//       username,
//       email,
//       password
//     });
//     return response.status;
//   };

//   it('should add specified number of users', async () => {
//     const numberOfUsers = 10000; // Задайте здесь необходимое количество пользователей
//     for (let i = 0; i < numberOfUsers; i++) {
//       const status = await addUser(`user${i}`, `user${i}@example.com`, 'password');
//       expect(status).toBe(202); // Предполагается, что сервер возвращает статус 202 при успешной регистрации
//     }
//   }, 3000000);
// });



const axios = require('axios');

describe('User registration', () => {
  const addUser = async (username, email, password) => {
    const response = await axios.post('http://localhost:3000/auth', {
      username,
      email,
      password
    });
    return response.status;
  };

  it('should add specified number of users concurrently', async () => {
    const numberOfUsers = 10000; 
    const userPromises = [];

    for (let i = 0; i < numberOfUsers; i++) {
      userPromises.push(addUser(`user${i}`, `user${i}@example.com`, 'password'));
    }

    const responses = await Promise.all(userPromises);
    responses.forEach(status => {
      expect(status).toBe(202);
    });
  }, 3000000); 
});
