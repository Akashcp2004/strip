[Frontend: User clicks Pay]
        ↓
[Backend: POST /create-checkout-session]
        ↓
[Stripe Checkout Page]
        ↓
[User enters card details & submits]
        ↓
[Stripe processes payment]
        ↓
[User redirected to /success or /cancel]
        ↓
[Stripe sends Webhook POST to /api/webhook/stripe]
        ↓
[Backend verifies webhook signature]
        ↓
[MongoDB updates payment status (success/failed/canceled)]
        ↓
[Frontend can fetch payment status if needed]


+------------------------+
| Frontend: Click Pay    |
+------------------------+
            |
            v
+------------------------+
| Backend: Create Session|
+------------------------+
            |
            v
+------------------------+
| Stripe Checkout Page   |
+------------------------+
            |
            v
+------------------------+
| User enters payment    |
+------------------------+
            |
            v
+------------------------+
| Stripe Processes       |
| Payment                |
+------------------------+
            |
            v
+------------------------+
| Redirect: /success or  |
| /cancel                |
+------------------------+
            |
            v
+------------------------+
| Webhook: POST /api/    |
| webhook/stripe         |
+------------------------+
            |
            v
+------------------------+
| Backend verifies &     |
| updates DB             |
+------------------------+
            |
            v
+------------------------+
| Frontend can fetch     |
| payment status         |
+------------------------+
