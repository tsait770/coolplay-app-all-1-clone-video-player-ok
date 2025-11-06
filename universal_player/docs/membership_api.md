# Membership Plans & Backend Quota API

## Plans
- Trial: 2000 one-time credits on first login
- Daily Free: 30/day reset 00:00 (user timezone or specified)
- Monthly Basic: 1500/month + 40/day login bonus
- Premium: Unlimited

## Credit Unit
- Define "charge events": voice command, video parse, playback start, etc.
- Each event decrements credit with idempotent token to avoid double charge

## API
- GET /v1/credits/me -> { plan, remainingDaily, remainingMonthly, resetsAt }
- POST /v1/credits/charge { eventType, amount, idempotencyKey } -> { ok, remaining }
- POST /v1/credits/grant { userId, amount, reason }
- GET /v1/credits/history?cursor= -> list of transactions

## Reset Logic
- Daily window: per-user timezone or fixed UTC; store nextResetAt UTC
- Monthly window: store periodStart/periodEnd and counters

## Security
- Server-side enforce; client cannot override counts
- Sign responses; log to audit trail

## Frontend
- Display remaining credits; block when exhausted
- Provide clear error messages and upsell hooks