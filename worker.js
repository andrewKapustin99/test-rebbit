const amqp = require('amqplib');
const { User } = require("./db");

async function startWorker() {
  try {
    const connection = await amqp.connect('amqp://rabbitmq');
    const channel = await connection.createChannel();
    const queue = 'user_registration';

    await channel.assertQueue(queue, { durable: false });

    console.log("Ожидание сообщений в %s.", queue);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const { username, email, password } = JSON.parse(msg.content.toString());
        try {
          await User.create({ username, email, password });
        } catch (error) {
          console.error("Ошибка при регистрации пользователя:", error);
        }
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Ошибка подключения к RabbitMQ:", error);
  }
}

startWorker();
