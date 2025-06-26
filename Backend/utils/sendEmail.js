import nodemailer from 'nodemailer';

/**
 * Sends an email using nodemailer.
 * @param {object} options - The email options.
 * @param {string} options.to - Recipient's email address.
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.message - The body of the email.
 * @param {string} options.isHtml - .
 */
const sendEmail = async (options) => {
  // 1. Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // Use `true` for port 465, `false` for port 587
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Your E-Commerce Store <no-reply@ecommerce.com>',
    to: options.to,
    subject: options.subject,
    html: options.isHtml ? options.message : undefined, // Send HTML if specified
    text: !options.isHtml ? options.message : undefined, // Fallback to plain text if not HTML
  };

  // 3. Actually send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error("Error sending email:" + error.message);
  }
};

export default sendEmail;
