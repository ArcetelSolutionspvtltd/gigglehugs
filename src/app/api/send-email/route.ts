import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  const apiKey = process.env.SENDGRID_API_KEY;

  if (!apiKey || apiKey === 'your_sendgrid_api_key') {
    return NextResponse.json({ message: 'Server configuration error: SendGrid API Key is not set.' }, { status: 500 });
  }

  sgMail.setApiKey(apiKey);

  try {
    const { user_name, user_email, subject, message } = await request.json();

    if (!user_name || !user_email || !subject || !message) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // This is the email address the form will send messages to.
    const recipientEmail = 'shaynesebmuzah@gmail.com';
    
    // NOTE: This "from" email address must be a "Verified Sender" in your SendGrid account.
    const verifiedSender = 'gigglehugs@gigglehugs.org';

    const msg = {
      to: recipientEmail,
      from: verifiedSender,
      subject: `New Message from GiggleHugs Contact Form: ${subject}`,
      replyTo: user_email,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>
          <p>You have received a new message from your website's contact form.</p>
          <hr>
          <p><strong>Name:</strong> ${user_name}</p>
          <p><strong>Email:</strong> <a href="mailto:${user_email}">${user_email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p style="padding: 10px; border-left: 3px solid #eee;">${message}</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ message: 'Email sent successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('SendGrid Error:', error.response?.body || error.message);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}
