import nodemailer, { createTransport, Transporter } from "nodemailer";

const smtpHost = process.env.SMTP_HOST || "smtp.zoho.in";
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
const smtpUser = process.env.SMTP_USER || "support@ioak.org";
const smtpDefaultSenderEmail =
  process.env.SMTP_DEFAULT_SENDER_EMAIL || "support@ioak.org";
const smtpDefaultSenderName =
  process.env.SMTP_DEFAULT_SENDER_NAME || "Ioak Support";
const smtpPassword = process.env.SMTP_PASSWORD || "qNWHvTRpJFWs";

const transporterConfig = {
  host: smtpHost,
  port: smtpPort,
  secure: true, // true for 465, false for other ports
  auth: {
    user: smtpUser,
    pass: smtpPassword,
  },
};

const defaultTransporter = nodemailer.createTransport(transporterConfig);

interface EmailMessageType {
  from?: string | { name: string; address: string };
  to: string[] | string;
  cc?: string[] | string;
  bcc?: string[] | string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: any[];
}

export const sendMail = (
  message: EmailMessageType,
  smtpConfig?: {
    host?: string;
    port?: number;
    secure?: boolean; // true for 465, false for other ports
    auth?: {
      user: string;
      pass: string;
    };
  }
) => {
  let transporter = defaultTransporter;

  if (smtpConfig) {
    transporter = createTransport({ ...transporterConfig, ...smtpConfig });
  }

  _sendMail(transporter, message);
};

const _sendMail = (
  transporter: Transporter,
  message: {
    from?: string | { name: string; address: string };
    to: string[] | string;
    cc?: string[] | string;
    bcc?: string[] | string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: any[];
  }
) => {
  const from = message.from || {
    name: smtpDefaultSenderName,
    address: smtpDefaultSenderEmail,
  };
  transporter.sendMail({ ...message, from }, (err, info) => {
    console.log(err);
  });
};

export const convertMessage = (
  messageTemplate: string,
  variables: { name: string; value: string }[]
) => {
  let message = messageTemplate;
  variables.forEach((item) => {
    message = message.replace(new RegExp(item.name, "g"), item.value);
  });
  return message;
};
