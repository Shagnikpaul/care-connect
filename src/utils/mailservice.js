const BREVO_API_KEY = import.meta.env.VITE_MAIL_API_KEY




import { ApiClient, TransactionalEmailsApi, SendSmtpEmail } from 'sib-api-v3-sdk';




export const sendVolunteerTaskCompletedMail = (requestTitle, volunteerEmail) => {
  const defaultClient = ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = BREVO_API_KEY; // Your Brevo API key from the .env file

  // Create the email sender and recipient data
  const apiInstance = new TransactionalEmailsApi();

  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = 'Thank You for your contribution!';
  sendSmtpEmail.htmlContent = `
  <html>
    <body>
      <h1>Dear Volunteer,</h1>
      <p>Good job on completing the request you had taken up titled "<strong>${requestTitle}</strong>!"</p>
      <p>We truly appreciate your efforts and hope for more contributions from you to help the society!</p>
      
      <p>Thank you for being an amazing volunteer!</p>
      <p>Best regards,<br>Unity Help</p>
    </body>
  </html>
`
  sendSmtpEmail.sender = { email: 'shagnikpaul772@gmail.com' }; // Your email address
  sendSmtpEmail.to = [{ email: volunteerEmail }]; // Recipient's email address

  // Send the email
  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then((data) => {
      console.log('Email sent successfully:', data);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
}






export const sendUserRequestAcceptedByVolunteerMail = (requestTitle, volunteerName, volunteerEmail, userMail) => {
  const defaultClient = ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = BREVO_API_KEY; // Your Brevo API key from the .env file

  // Create the email sender and recipient data
  const apiInstance = new TransactionalEmailsApi();

  const sendSmtpEmail = new SendSmtpEmail();

  sendSmtpEmail.subject = 'Your posted request was accepted by a volunteer !';
  sendSmtpEmail.htmlContent = `
  <html>
    <body>
      <h1>Your volunteer request was accepted!</h1>
      <p>You had posted a volunteer request titled "<strong>${requestTitle}</strong>", and it was accepted by a volunteer!</p>
      <p>Please check the website (for more details) or see below for contact details:</p>
      
      <h3>Volunteer Details:</h3>
      <ul>
        <li><strong>Name:</strong> ${volunteerName}</li>
        <li><strong>Email:</strong> <a href="mailto:${volunteerEmail}">${volunteerEmail}</a></li>
        
      </ul>
      <br>
      <p>Please contact the volunteer and discuss about the details of the task so that they can start working on it as soon as possible.</p>
      <p>Best regards,<br>Unity Help</p>
    </body>
  </html>
`
  sendSmtpEmail.sender = { email: 'shagnikpaul772@gmail.com' }; // Your email address
  sendSmtpEmail.to = [{ email: userMail }]; // Recipient's email address

  // Send the email
  apiInstance.sendTransacEmail(sendSmtpEmail)
    .then((data) => {
      console.log('Email sent successfully:', data);
    })
    .catch((error) => {
      console.error('Error sending email:', error);
    });
}


