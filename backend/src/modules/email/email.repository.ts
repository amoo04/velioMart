export type SendEmailInput = {
  to: string;
  subject: string;
  body: string;
};

export const emailRepository = {
  async send(data: SendEmailInput) {
    console.log(`[EMAIL] To: ${data.to}, Subject: ${data.subject}, Body: ${data.body}`);
    return { success: true, message: "Email logged (not sent yet)" };
  },
};
