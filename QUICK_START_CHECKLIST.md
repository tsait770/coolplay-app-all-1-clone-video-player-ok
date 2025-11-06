# 🚀 Quick Start Checklist

Follow these steps to complete your Supabase and Stripe integration.

## ✅ Step 1: Supabase Database Setup (5 minutes)

1. Go to your Supabase project: https://supabase.com/dashboard/project/tdamcrigenexyhbsopay
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire contents of `database-schema.sql`
5. Click "Run" to execute the SQL
6. Verify tables are created:
   - Go to "Table Editor"
   - You should see: `profiles`, `folders`, `bookmarks`

**✅ Done when:** You can see all three tables in the Table Editor

---

## ✅ Step 2: Stripe Products Setup (10 minutes)

### Create Products in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/products
2. Click "Add product" and create these 4 products:

#### Product 1: Premium Monthly
- Name: `Premium Monthly`
- Description: `Premium membership with unlimited bookmarks and advanced features`
- Pricing: `$9.99 USD` / `Recurring` / `Monthly`
- Click "Save product"
- **Copy the Price ID** (starts with `price_`)

#### Product 2: Premium Yearly
- Name: `Premium Yearly`
- Description: `Premium membership - Save 17% with annual billing`
- Pricing: `$99.99 USD` / `Recurring` / `Yearly`
- Click "Save product"
- **Copy the Price ID**

#### Product 3: Pro Monthly
- Name: `Pro Monthly`
- Description: `Pro membership with AI features and team collaboration`
- Pricing: `$19.99 USD` / `Recurring` / `Monthly`
- Click "Save product"
- **Copy the Price ID**

#### Product 4: Pro Yearly
- Name: `Pro Yearly`
- Description: `Pro membership - Save 17% with annual billing`
- Pricing: `$199.99 USD` / `Recurring` / `Yearly`
- Click "Save product"
- **Copy the Price ID**

### Update .env File

3. Open your `.env` file
4. Replace the placeholder Price IDs with your actual Price IDs:

```env
EXPO_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
EXPO_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
EXPO_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
EXPO_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx
```

**✅ Done when:** All 4 Price IDs are updated in `.env`

---

## ✅ Step 3: Stripe Webhook Setup (5 minutes)

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Enter endpoint URL: `https://your-domain.com/api/trpc/stripe.webhook`
   - For local testing, use ngrok or similar tunneling service
4. Click "Select events"
5. Select these events:
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Click "Add endpoint"
7. Click on the webhook you just created
8. Click "Reveal" next to "Signing secret"
9. Copy the webhook secret (starts with `whsec_`)
10. Add to `.env`:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**✅ Done when:** Webhook is created and secret is in `.env`

---

## ✅ Step 4: Test Authentication (3 minutes)

1. Start your app:
   ```bash
   npm start
   ```

2. Open the app in your browser or mobile device

3. Navigate to the sign-up page

4. Create a test account:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`

5. Verify in Supabase:
   - Go to "Authentication" → "Users"
   - You should see your test user
   - Go to "Table Editor" → "profiles"
   - You should see a profile for your test user

**✅ Done when:** User appears in both auth.users and profiles table

---

## ✅ Step 5: Test Subscription (5 minutes)

1. Sign in with your test account

2. Navigate to `/subscription` in the app

3. Select a plan (e.g., Premium Monthly)

4. Click "Subscribe"

5. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

6. Complete the checkout

7. Verify in Supabase:
   - Go to "Table Editor" → "profiles"
   - Find your user
   - Check that `membership_tier` is updated to `premium`
   - Check that `membership_expires_at` has a future date

8. Verify in Stripe:
   - Go to "Customers" in Stripe Dashboard
   - You should see your test customer
   - Click on the customer
   - You should see an active subscription

**✅ Done when:** Membership is updated in Supabase and subscription appears in Stripe

---

## ✅ Step 6: Test Webhook (Optional - 5 minutes)

### Using Stripe CLI

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/trpc/stripe.webhook
   ```

4. In another terminal, trigger a test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

5. Check your app logs to see the webhook being processed

**✅ Done when:** Webhook events are received and processed

---

## 🎉 Integration Complete!

Your app now has:
- ✅ User authentication with Supabase
- ✅ User profiles and data storage
- ✅ Subscription payments with Stripe
- ✅ Webhook handling for subscription updates
- ✅ Membership tier management

## 🧪 Test Checklist

Before going to production, test these scenarios:

- [ ] User can sign up
- [ ] User can sign in
- [ ] User can sign out
- [ ] User can view subscription plans
- [ ] User can subscribe to a plan
- [ ] Membership tier is updated after subscription
- [ ] User can view current subscription
- [ ] User can cancel subscription
- [ ] Membership tier is downgraded after cancellation
- [ ] Bookmarks are saved to Supabase
- [ ] Folders are created and managed
- [ ] Data is synced across devices

## 📚 Next Steps

1. **Customize the UI** - Update colors, fonts, and layouts to match your brand
2. **Add more features** - Implement bookmark import, export, sharing, etc.
3. **Set up analytics** - Track user behavior and subscription metrics
4. **Deploy to production** - Switch to live Stripe keys and deploy your app
5. **Marketing** - Create landing page, app store listings, etc.

## 🆘 Need Help?

- Check `SUPABASE_STRIPE_SETUP.md` for detailed documentation
- Check `整合完成說明.md` for Chinese documentation
- Review Supabase logs for database errors
- Review Stripe Dashboard logs for payment errors
- Check browser console for client-side errors

## 🔒 Security Reminders

- [ ] Never commit `.env` to version control
- [ ] Use environment variables for all secrets
- [ ] Enable email confirmation in Supabase for production
- [ ] Switch to live Stripe keys for production
- [ ] Set up proper error tracking (Sentry, etc.)
- [ ] Review and test all RLS policies
- [ ] Set up backup strategy for Supabase

---

**Congratulations! Your integration is complete! 🎊**
