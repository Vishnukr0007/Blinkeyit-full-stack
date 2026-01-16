const verifyEmailTemplate = ({ name, Url }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Arial', sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #f7ca00; padding: 30px; text-align: center; } /* Blinkit Yellow/Brand Color */
    .header h1 { margin: 0; color: #000000; font-size: 28px; font-weight: 800; letter-spacing: -1px; }
    .content { padding: 40px 30px; text-align: center; color: #333333; }
    .welcome-text { font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #000000; }
    .sub-text { font-size: 15px; color: #666666; line-height: 1.6; margin-bottom: 30px; }
    .btn-container { margin: 30px 0; }
    .btn { background-color: #0c831f; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 16px; display: inline-block; transition: background-color 0.3s; } /* Blinkit Green */
    .btn:hover { background-color: #096818; }
    .footer { background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #eeeeee; }
    .link-fallback { margin-top: 20px; font-size: 12px; color: #888888; word-break: break-all; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Blinkeyit</h1>
    </div>
    <div class="content">
      <p class="welcome-text">Welcome to Blinkeyit, ${name}!</p>
      <p class="sub-text">
        We're excited to have you on board. To get started and access all our features, please verify your email address.
      </p>
      
      <div class="btn-container">
        <a href="${Url}" class="btn">Verify Email</a>
      </div>

      <div class="link-fallback">
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <a href="${Url}" style="color: #0c831f;">${Url}</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Blinkeyit. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export default verifyEmailTemplate;