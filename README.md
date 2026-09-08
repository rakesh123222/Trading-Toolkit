# Gain Yourself — Trading Beginner Toolkit v2

Production-oriented static landing page + Razorpay + secure digital delivery.

## What is included
- Responsive website matching the supplied visual style.
- Razorpay Standard Checkout.
- Server-side order creation.
- Server-side Razorpay signature verification.
- Razorpay webhook endpoint for payment events.
- Secure, expiring download link for the premium ebook.
- Automatic email delivery through Resend.
- Instagram + WhatsApp buttons.
- Vercel configuration.
- Your 112-page ebook is stored outside `public/` so it is not directly public.

## Deploy to Vercel
1. Upload/import this folder into Vercel.
2. Add the environment variables from `.env.example` in Project → Settings → Environment Variables.
3. Deploy.
4. In Razorpay Dashboard, create a webhook pointing to `https://YOUR-DOMAIN.com/api/webhook`.
5. Subscribe to `order.paid` and/or `payment.captured` and use the same `RAZORPAY_WEBHOOK_SECRET`.
6. Replace the placeholder Instagram username and WhatsApp number in `public/index.html`.
7. Replace the checkout brand details if desired.

## Resend email
Create a Resend API key and verify a sending domain. Put the resulting API key in `RESEND_API_KEY` and use a sender address from your verified domain in `FROM_EMAIL`.

If `RESEND_API_KEY` is blank, the payment can still verify, but no automatic email is sent; this is not suitable for production sales.

## Razorpay
Use Test Mode first. For production, switch to live API keys and complete Razorpay's account/KYC requirements. Never put `RAZORPAY_KEY_SECRET`, webhook secret, or download secret in browser JavaScript.

## Custom domain
Vercel: Project → Settings → Domains → Add your domain. Follow the DNS records Vercel shows for your project, then wait for verification and SSL provisioning.

## Important
- Product price is fixed server-side at INR 399 (39900 paise).
- The site is educational only and does not promise trading profits.
- Review applicable Indian tax, consumer, privacy, email and financial-content requirements before launch.
