export const generateEmailHtml = (content: string, title: string = "Notification") => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Heems</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background-color: #111827; padding: 32px 24px; text-align: center; }
        .logo { max-height: 48px; }
        .content { padding: 40px 32px; }
        .footer { background-color: #f9fafb; padding: 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; background-color: #1a9e8c; color: #ffffff !important; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px; }
        .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
        h1 { color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 16px; margin-top: 0; }
        p { margin-bottom: 16px; color: #4b5563; }
        a { color: #1a9e8c; text-decoration: none; }
    </style>
</head>
<body>
    <div style="padding: 40px 0;">
        <div class="container">
            <div class="header">
                <img src="https://heems.com/logo-white.png" alt="Heems" class="logo" style="max-height: 40px;"> 
                <!-- Note: Ensure this image URL is accessible or base64 encoded if needed, but external URL is best for email clients -->
            </div>
            
            <div class="content">
                ${content}
            </div>

            <div class="footer">
                <p style="margin: 0 0 8px;">&copy; ${new Date().getFullYear()} Heems Care Ltd. All rights reserved.</p>
                <p style="margin: 0;">
                    <a href="https://heems.com/privacy">Privacy Policy</a> &bull; 
                    <a href="https://heems.com/terms">Terms of Service</a> &bull; 
                    <a href="https://heems.com/contact">Contact Support</a>
                </p>
                <p style="margin-top: 16px;">
                    Unit 12, Care Innovation Hub, London, UK
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};
