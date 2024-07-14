export class EmailService {
  async sendEmail({
    subject = "",
    message = "",
    to = "",
  }: {
    subject?: string;
    message?: string;
    to?: string;
  }) {
    return "Email sent successfully";
  }
}
