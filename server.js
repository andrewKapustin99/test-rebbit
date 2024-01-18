const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, User } = require("./db");

const amqp = require("amqplib");

const app = express();
const port = 3000;

app.use(bodyParser.json());

async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect("amqp://rabbitmq"); // Адрес сервера RabbitMQ
    const channel = await connection.createChannel();
    const queue = "user_registration"; // Название очереди

    await channel.assertQueue(queue, { durable: true });

    async function sendToQueue(message) {
      await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }

    return sendToQueue;
  } catch (error) {
    console.error("Ошибка подключения к RabbitMQ:", error);
    throw error;
  }
}

(async () => {
 try {
  const sendToQueue = await connectRabbitMQ();

  app.post("/auth", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      await sendToQueue({ username, email, password });
      res.status(202).send("Запрос на регистрацию отправлен");
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      res.status(500).send("Ошибка при отправке запроса");
    }
  });

  app.get("/auth", (req, res) => {
    const message = "Запрос на авторизацию (auth)";
    res.send(`Отправлен запрос: ${message}`);
  });

  await sequelize.sync();
  await User.destroy({ where: {}, truncate: true });

  app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
  });
 } catch (error) {
  console.error("Ошибка при запуске сервера:", error);

 }
})();