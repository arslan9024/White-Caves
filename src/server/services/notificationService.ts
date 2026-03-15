// Email configuration interface
interface EmailConfig {
  host: string;
  port: number;
  user: string | undefined;
  pass: string | undefined;
}

// Notification response interface
interface NotificationResponse {
  success: boolean;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

// Viewing data interface
interface ViewingData {
  clientEmail?: string;
  clientPhone?: string;
  agentEmail?: string;
  propertyTitle: string;
  viewingDate: string;
  viewingTime: string;
}

// Lead data interface
interface LeadData {
  ownerEmail: string;
  leadName: string;
  leadPhone: string;
  propertyTitle: string;
  source: string;
}

// Contract data interface
interface ContractData {
  lessorEmail: string;
  tenantEmail: string;
  contractNumber: string;
  propertyAddress: string;
}

// Payment data interface
interface PaymentData {
  clientEmail: string;
  amount: number;
  currency: string;
  description: string;
}

// Notification history interface
interface NotificationHistory {
  userId: string;
  notifications: unknown[];
  total: number;
}

// Batch notification result interface
interface BatchNotificationResult {
  success: boolean;
  notificationsSent: number;
  results: NotificationResponse[];
}

class NotificationService {
  private emailConfig: EmailConfig;

  constructor() {
    this.emailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    };
  }

  async sendEmail(
    to: string,
    subject: string,
    body: string,
    options: Record<string, unknown> = {}
  ): Promise<NotificationResponse> {
    console.log(`[Email] Would send to: ${to}, Subject: ${subject}`);

    return {
      success: true,
      message: 'Email queued for sending',
      to,
      subject,
      timestamp: new Date().toISOString(),
      ...options
    };
  }

  async sendSMS(phoneNumber: string, message: string): Promise<NotificationResponse> {
    console.log(`[SMS] Would send to: ${phoneNumber}, Message: ${message.substring(0, 50)}...`);

    return {
      success: true,
      message: 'SMS queued for sending',
      phoneNumber,
      timestamp: new Date().toISOString()
    };
  }

  async sendWhatsApp(
    phoneNumber: string,
    message: string,
    templateName: string | null = null
  ): Promise<NotificationResponse> {
    console.log(`[WhatsApp] Would send to: ${phoneNumber}, Message: ${message.substring(0, 50)}...`);

    return {
      success: true,
      message: 'WhatsApp message queued',
      phoneNumber,
      template: templateName,
      timestamp: new Date().toISOString()
    };
  }

  async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data: Record<string, unknown> = {}
  ): Promise<NotificationResponse> {
    console.log(`[Push] Would send to user: ${userId}, Title: ${title}`);

    return {
      success: true,
      message: 'Push notification queued',
      userId,
      title,
      timestamp: new Date().toISOString(),
      ...data
    };
  }

  async notifyPropertyViewing(viewingData: ViewingData): Promise<BatchNotificationResult> {
    const { clientEmail, clientPhone, agentEmail, propertyTitle, viewingDate, viewingTime } =
      viewingData;

    const notifications: Promise<NotificationResponse>[] = [];

    if (clientEmail) {
      notifications.push(
        this.sendEmail(
          clientEmail,
          `Viewing Confirmed: ${propertyTitle}`,
          `Your property viewing has been scheduled for ${viewingDate} at ${viewingTime}.`
        )
      );
    }

    if (clientPhone) {
      notifications.push(
        this.sendWhatsApp(
          clientPhone,
          `Hi! Your viewing for ${propertyTitle} is confirmed for ${viewingDate} at ${viewingTime}. See you there!`
        )
      );
    }

    if (agentEmail) {
      notifications.push(
        this.sendEmail(
          agentEmail,
          `New Viewing Scheduled: ${propertyTitle}`,
          `A viewing has been scheduled for ${viewingDate} at ${viewingTime}.`
        )
      );
    }

    const results = await Promise.all(notifications);
    return { success: true, notificationsSent: results.length, results };
  }

  async notifyNewLead(leadData: LeadData): Promise<BatchNotificationResult> {
    const { ownerEmail, leadName, leadPhone, propertyTitle, source } = leadData;

    const notifications: Promise<NotificationResponse>[] = [];

    if (ownerEmail) {
      notifications.push(
        this.sendEmail(
          ownerEmail,
          `New Lead: ${leadName}`,
          `A new lead has been captured from ${source} for ${propertyTitle}.\nContact: ${leadPhone}`
        )
      );
    }

    const results = await Promise.all(notifications);
    return { success: true, notificationsSent: results.length, results };
  }

  async notifyContractSigned(contractData: ContractData): Promise<BatchNotificationResult> {
    const { lessorEmail, tenantEmail, contractNumber, propertyAddress } = contractData;

    const notifications: Promise<NotificationResponse>[] = [];

    if (lessorEmail) {
      notifications.push(
        this.sendEmail(
          lessorEmail,
          `Contract Signed: ${contractNumber}`,
          `The tenancy contract for ${propertyAddress} has been fully signed.`
        )
      );
    }

    if (tenantEmail) {
      notifications.push(
        this.sendEmail(
          tenantEmail,
          `Contract Signed: ${contractNumber}`,
          `Your tenancy contract for ${propertyAddress} has been fully signed. Welcome to your new home!`
        )
      );
    }

    const results = await Promise.all(notifications);
    return { success: true, notificationsSent: results.length, results };
  }

  async notifyPaymentReceived(paymentData: PaymentData): Promise<NotificationResponse> {
    const { clientEmail, amount, currency, description } = paymentData;

    if (clientEmail) {
      return this.sendEmail(
        clientEmail,
        `Payment Received: ${currency} ${amount.toLocaleString()}`,
        `We have received your payment of ${currency} ${amount.toLocaleString()} for ${description}. Thank you!`
      );
    }

    return { success: false, message: 'No email provided', timestamp: new Date().toISOString() };
  }

  getNotificationHistory(userId: string, limit: number = 50): NotificationHistory {
    return {
      userId,
      notifications: [],
      total: 0
    };
  }
}

export default NotificationService;
