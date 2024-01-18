// const amqp = require('amqplib');
// const { User } = require("./db");

// async function startWorker() {
//   try {
//     const connection = await amqp.connect('amqp://rabbitmq');
//     const channel = await connection.createChannel();
//     const queue = 'user_registration';

//     await channel.assertQueue(queue, { durable: true });

//     console.log("Ожидание сообщений в %s.", queue);

//     channel.consume(queue, async (msg) => {
//       if (msg !== null) {
//         const { username, email, password } = JSON.parse(msg.content.toString());
//         try {
//           await User.create({ username, email, password });
//         } catch (error) {
//           console.error("Ошибка при регистрации пользователя:", error);
//         }
//         channel.ack(msg);
//       }
//     });
//   } catch (error) {
//     console.error("Ошибка подключения к RabbitMQ:", error);
//   }
// }

// startWorker();


const amqp = require('amqplib');
const { User } = require("./db");

async function startWorker() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'user_registration';

    await channel.assertQueue(queue, { durable: false });

    channel.prefetch(10);

    console.log("Ожидание сообщений в %s.", queue);

    let batch = []; // Пакет для сбора сообщений
    const batchSize = 100; // Размер пакета
    const batchInterval = 5000; // Интервал времени для обработки пакета (в миллисекундах)

    // Функция для обработки пакета
    const processBatch = async () => {
      if (batch.length > 0) {
        try {
          await User.bulkCreate(batch);
          batch = []; // Очистка пакета после обработки
        } catch (error) {
          console.error("Ошибка при регистрации пользователей:", error);
        }
      }
    };

    // Регулярная обработка пакета
    setInterval(processBatch, batchInterval);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const user = JSON.parse(msg.content.toString());
        batch.push(user);
        if (batch.length >= batchSize) {
          processBatch(); // Обработка пакета при достижении размера
        }
        channel.ack(msg);
      }
    }, { noAck: false });
  } catch (error) {
    console.error("Ошибка подключения к RabbitMQ:", error);
  }
}

startWorker();
