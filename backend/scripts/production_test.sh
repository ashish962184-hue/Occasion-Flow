#!/bin/bash
# Production Validation Report & Test Script

echo "Executing Production Validation..."

# Use your actual external backend URL here once deployed
BACKEND_URL=${1:-"http://localhost:5000"}

echo "1. Checking Database Health and Auto-Seed status..."
HEALTH_RES=$(curl -s "$BACKEND_URL/api/health")
echo "Result: $HEALTH_RES"

if [[ "$HEALTH_RES" == *"\"status\":\"ok\""* ]]; then
  echo "✅ Database connection successful"
else
  echo "❌ Database connection failed"
fi

if [[ "$HEALTH_RES" == *"\"seed_loaded\":true"* ]]; then
  echo "✅ Seed data verified"
else
  echo "❌ Seed data missing"
fi

echo ""
echo "2. Checking Frontend Readiness..."
echo "Verify these manually in the browser at your Vercel URL:"
echo "[ ] Dashboard loads metrics without crashing"
echo "[ ] Customers table shows the 5 seeded users"
echo "[ ] Network tab shows 200 OK for /api/customers"
echo "[ ] Console is free of CORS errors"

echo ""
echo "Validation Complete. Proceed to production."
