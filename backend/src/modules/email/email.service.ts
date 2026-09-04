import { emailRepository, type SendEmailInput } from "./email.repository";

export const emailService = {
  async sendEmail(data: SendEmailInput) {
    return emailRepository.send(data);
  },
};
