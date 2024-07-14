import kafka, { Consumer, Kafka, Producer } from "kafkajs";

export class KafkaService {
  private clientId: string;
  private brokers: string[];
  private kafka: Kafka;
  private kafkaProducer: Producer;
  private kafkaConsumer: Consumer;

  protected constructor(groupId: string = "kafka-service") {
    this.clientId = "kafka-service";
    this.brokers = ["localhost:9092"];
    this.kafka = new kafka.Kafka({
      clientId: this.clientId,
      brokers: this.brokers,
    });

    this.kafkaProducer = this.kafka.producer();
    this.kafkaConsumer = this.kafka.consumer({ groupId: groupId });
  }

  protected getKafka(): Kafka {
    return this.kafka;
  }

  protected produceMessage(topic: string, message: string | Buffer) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.kafkaProducer.connect();
        await this.kafkaProducer.send({
          topic: topic,
          messages: [{ value: message }],
        });
        await this.kafkaProducer.disconnect();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  protected consumeMessage(
    topic: string,
    eachMessageHandler: kafka.EachMessageHandler,
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.kafkaConsumer.connect();
        await this.kafkaConsumer.subscribe({
          topic: topic,
          fromBeginning: true,
        });
        await this.kafkaConsumer.run({
          eachMessage: eachMessageHandler,
        });
        await this.kafkaConsumer.disconnect();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }
}
