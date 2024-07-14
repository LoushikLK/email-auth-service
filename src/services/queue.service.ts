import { QueueEnum } from "../types/queue";
import { EmailService } from "./email.service";
import { KafkaService } from "./kafka.service";

export class QueueService extends KafkaService {
  constructor(groupId: string = "queue-service") {
    super(groupId);
  }

  public async sendEmailToQueue({
    topic = QueueEnum.SEND_EMAIL,
    message,
    subject,
    to,
  }: {
    topic?: QueueEnum;
    message: string;
    subject: string;
    to: string | string[];
  }) {
    return await this.produceMessage(
      topic,
      Buffer.from(JSON.stringify({ message, subject, to })),
    );
  }
}

export class QueueConsumerService extends KafkaService {
  constructor(groupId: string = "queue-service") {
    super(groupId);
    this.registerConsumers();
  }
  public async registerConsumers() {
    this.processEmail();
  }

  public async processEmail() {
    await this.consumeMessage(QueueEnum.SEND_EMAIL, async ({ message }) => {
      if (!message.value) return;
      const parseData = JSON.parse(message?.value?.toString());
      const { message: msg, subject, to } = parseData;
      await new EmailService().sendEmail({ message: msg, subject, to });
    });
  }
}
