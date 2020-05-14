import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_mail_server = "smtp.yandex.com"
port = 465
sender_email = "no-reply@dev.ioak.org"
password = "PDXC9MLzgfrVnk6"

def send_mail(to, subject, body):
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = sender_email
    message["To"] = to
    message.attach(MIMEText(body, "html"))
    # Create a secure SSL context
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL(smtp_mail_server, port, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, to, message.as_string())
