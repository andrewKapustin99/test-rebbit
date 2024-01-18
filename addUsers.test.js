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

//   it('should add specified number of users concurrently', async () => {
//     const numberOfUsers = 10000; 
//     const userPromises = [];

//     for (let i = 0; i < numberOfUsers; i++) {
//       userPromises.push(addUser(`user${i}`, `user${i}@example.com`, 'password'));
//     }

//     const responses = await Promise.all(userPromises);
//     responses.forEach(status => {
//       expect(status).toBe(202);
//     });
//   }, 3000000); 
// });

// const axios = require('axios');
// const pLimit = require('p-limit');







// const axios = require('axios');
// const PromisePool = require('es6-promise-pool');

// describe('User registration', () => {
//   const addUser = async (username, email, password) => {
//     const response = await axios.post('http://localhost:3000/auth', {
//       username,
//       email,
//       password
//     });
//     return response.status;
//   };

//   it('should add specified number of users concurrently', async () => {
//     const numberOfUsers = 10000;
//     let i = 0;

//     const promiseProducer = () => {
//       if (i < numberOfUsers) {
//         i++;
//         return addUser(`user${i}`, `user${i}@example.com`, 'password');
//       }
//       return null;
//     };

//     const pool = new PromisePool(promiseProducer, 50); // Ограничение на 50 одновременных запросов
//     const responses = await pool.start();
//     responses.forEach(status => {
//       expect(status).toBe(202);
//     });
//   }, 3000000);
// });



const axios = require('axios');
const PromisePool = require('es6-promise-pool');

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
    let i = 0;

    const results = []; // Массив для сохранения результатов
    const promiseProducer = () => {
      if (i < numberOfUsers) {
        const promise = addUser(`user${i}`, `user${i}@example.com`, 'password');
        results.push(promise); // Сохранение промиса в массиве
        i++;
        return promise;
      }
      return null;
    };

    const pool = new PromisePool(promiseProducer, 40); // Ограничение на 50 одновременных запросов
    await pool.start(); // Запуск пула промисов
    await Promise.all(results); // Ожидание завершения всех промисов

    // Проверка статусов
    results.forEach(async (promise) => {
      const status = await promise;
      expect(status).toBe(202);
    });
  }, 3000000);
});
