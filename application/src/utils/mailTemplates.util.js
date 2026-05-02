export const VERIFICATION_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Verify Your Email</title>
</head>
<body style="
  background-color: #0D1117;
  color: #f2f0ed;
  font-family: 'Arial', sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">
  <div style="
    background: linear-gradient(135deg, #1E90FF, #9B59B6);
    padding: 25px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  ">
    <h1 style="margin: 0; color: #f2f0ed;">Email Verification</h1>
  </div>

  <div style="
    background-color: #161B22;
    padding: 25px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.3);
  ">
    <p style="color: #A0A0A0;">Hey there,</p>
    <p style="color: #f2f0ed;">Thanks for connecting with <strong>Bhavyaz Portfolio</strong>!  
    To verify your email address, please use the code below:</p>

    <div style="text-align: center; margin: 30px 0;">
      <span style="
        font-size: 32px;
        font-weight: bold;
        letter-spacing: 6px;
        color: #1E90FF;
      ">{verificationToken}</span>
    </div>

    <p style="color: #A0A0A0;">Enter this code to confirm your identity. The code expires in 1 hour.</p>
    <p style="color: #A0A0A0;">If this wasn’t you, please ignore this message.</p>
    <p style="color: #f2f0ed;">Warm regards,<br><strong>Bhavya Dhanwani</strong><br>Bhavyaz Portfolio</p>
  </div>

  <p style="text-align: center; color: #7A7A7A; margin-top: 20px; font-size: 0.8em;">
    This is an automated message — please don’t reply.
  </p>
</body>
</html>
`;

export const WELCOME_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Welcome to Bhavyaz Portfolio</title>
</head>
<body style="
  background-color: #0D1117;
  color: #f2f0ed;
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">
  <div style="
    background: linear-gradient(135deg, #1E90FF, #9B59B6);
    padding: 25px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  ">
    <h1 style="margin: 0; color: #f2f0ed;">Welcome Aboard 👋</h1>
  </div>

  <div style="
    background-color: #161B22;
    padding: 25px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.3);
  ">
    <p style="color: #A0A0A0;">Hi {name},</p>
    <p style="color: #f2f0ed;">Welcome to <strong>Bhavyaz Portfolio</strong> — a creative space where I share my work, projects, and passion for development.</p>
    <p style="color: #A0A0A0;">Start exploring the portfolio and get inspired by the journey!</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{dashboardURL}" style="
        background: linear-gradient(135deg, #1E90FF, #9B59B6);
        color: #f2f0ed;
        padding: 12px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        display: inline-block;
      ">Visit Portfolio</a>
    </div>

    <p style="color: #f2f0ed;">Glad to have you here,<br><strong>Bhavya Dhanwani</strong></p>
  </div>

  <p style="text-align: center; color: #7A7A7A; margin-top: 20px; font-size: 0.8em;">
    This is an automated message — please don’t reply.
  </p>
</body>
</html>
`;

export const FORGOT_PASSWORD_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reset Your Password</title>
</head>
<body style="
  background-color: #0D1117;
  color: #f2f0ed;
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">
  <div style="
    background: linear-gradient(135deg, #1E90FF, #9B59B6);
    padding: 25px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  ">
    <h1 style="margin: 0; color: #f2f0ed;">Password Reset Request</h1>
  </div>

  <div style="
    background-color: #161B22;
    padding: 25px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.3);
  ">
    <p style="color: #A0A0A0;">Hi there,</p>
    <p style="color: #f2f0ed;">A password reset was requested for your <strong>Bhavyaz Portfolio</strong> account.</p>
    <p style="color: #A0A0A0;">If this was you, click the button below to reset it:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="
        background: linear-gradient(135deg, #1E90FF, #9B59B6);
        color: #f2f0ed;
        padding: 12px 20px;
        border-radius: 5px;
        text-decoration: none;
        font-weight: bold;
        display: inline-block;
      ">Reset Password</a>
    </div>

    <p style="color: #A0A0A0;">This link will expire in 1 hour.  
    If you didn’t request this, you can safely ignore it.</p>
    <p style="color: #f2f0ed;">Thanks,<br><strong>Bhavya Dhanwani</strong></p>
  </div>

  <p style="text-align: center; color: #7A7A7A; margin-top: 20px; font-size: 0.8em;">
    This is an automated message — please don’t reply.
  </p>
</body>
</html>
`;

export const RESET_PASSWORD_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Password Reset Successful</title>
</head>
<body style="
  background-color: #0D1117;
  color: #f2f0ed;
  font-family: Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">
  <div style="
    background: linear-gradient(135deg, #1E90FF, #9B59B6);
    padding: 25px;
    text-align: center;
    border-radius: 10px 10px 0 0;
  ">
    <h1 style="margin: 0; color: #f2f0ed;">Password Reset Successful</h1>
  </div>

  <div style="
    background-color: #161B22;
    padding: 25px;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 15px rgba(155, 89, 182, 0.3);
  ">
    <p style="color: #A0A0A0;">Hello,</p>
    <p style="color: #f2f0ed;">Your password for <strong>Bhavyaz Portfolio</strong> has been successfully updated.</p>

    <div style="text-align: center; margin: 30px 0;">
      <div style="
        background: linear-gradient(135deg, #1E90FF, #9B59B6);
        color: #f2f0ed;
        width: 60px;
        height: 60px;
        line-height: 60px;
        border-radius: 50%;
        display: inline-block;
        font-size: 30px;
      ">✓</div>
    </div>

    <p style="color: #A0A0A0;">If you didn’t perform this change, please contact me immediately through the portfolio’s contact page.</p>
    <ul style="color: #A0A0A0;">
      <li>Use a strong, unique password</li>
      <li>Keep your credentials private</li>
    </ul>

    <p style="color: #f2f0ed;">Stay creative,<br><strong>Bhavya Dhanwani</strong><br>Bhavyaz Portfolio</p>
  </div>

  <p style="text-align: center; color: #7A7A7A; margin-top: 20px; font-size: 0.8em;">
    This is an automated message — please don’t reply.
  </p>
</body>
</html>
`;
