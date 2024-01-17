const amqp = require('amqplib');

class RabbitMQ {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://rabbitmq'); // Укажите адрес RabbitMQ сервера
      this.channel = await this.connection.createChannel();
      console.log('Подключение к RabbitMQ установлено.');
    } catch (error) {
      console.error('Ошибка подключения к RabbitMQ:', error);
    }
  }

  async sendMessage(queueName, message) {
    if (!this.channel) {
      console.error('RabbitMQ не подключен. Сообщение не отправлено.');
      return;
    }

    this.channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Сообщение отправлено в очередь ${queueName}: ${message}`);
  }
}

module.exports = new RabbitMQ();
