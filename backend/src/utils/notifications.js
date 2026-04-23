import nodemailer from 'nodemailer';
import twilio from 'twilio';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email Error:', error);
        return { success: false, error };
    }
};

export const sendSMS = async (phone, message) => {
    try {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        return { success: true };
    } catch (error) {
        console.error('SMS Error:', error);
        return { success: false, error };
    }
};

// Email Templates
export const appointmentConfirmationEmail = (patientName, doctorName, appointmentDate, appointmentTime) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Appointment Confirmation</h2>
      <p>Dear ${patientName},</p>
      <p>Your appointment has been confirmed with <strong>${doctorName}</strong></p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>Please arrive 10 minutes early. If you need to reschedule, contact us at least 24 hours before.</p>
      <p>Thank you for choosing our hospital.</p>
    </div>
  `;
};

export const appointmentReminderEmail = (patientName, appointmentDate, appointmentTime) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Appointment Reminder</h2>
      <p>Dear ${patientName},</p>
      <p>This is a reminder about your upcoming appointment:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
      <p>Please arrive on time. If you cannot make it, please cancel at least 24 hours before.</p>
    </div>
  `;
};

export const paymentReceiptEmail = (patientName, amount, transactionId, appointmentDetails) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Payment Receipt</h2>
      <p>Dear ${patientName},</p>
      <p>Thank you for your payment. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Appointment Details:</strong> ${appointmentDetails}</p>
      </div>
      <p>Keep this receipt for your records.</p>
    </div>
  `;
};
