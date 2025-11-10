#!/bin/bash

# ============================================
# Supabase Database Setup Script
# Phase 8-2: Automated Database Setup
# ============================================

set -e  # Exit on error

echo "🚀 Supabase Database Setup Starting..."
echo ""

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
  echo "❌ Error: SUPABASE_ACCESS_TOKEN not found in environment"
  echo ""
  echo "📝 Please set your Supabase Access Token:"
  echo "   1. Go to: https://supabase.com/dashboard/account/tokens"
  echo "   2. Generate new token"
  echo "   3. Add to .env.local:"
  echo "      SUPABASE_ACCESS_TOKEN=sbp_xxxxxxxxxxxxx"
  echo ""
  exit 1
fi

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
fi

PROJECT_ID="smgwzotugeqzahcxicsa"
SCHEMA_FILE="supabase/schema.sql"
SEED_FILE="supabase/seed.sql"

echo "📊 Project ID: $PROJECT_ID"
echo "📁 Schema file: $SCHEMA_FILE"
echo "🌱 Seed file: $SEED_FILE"
echo ""

# Step 1: Run schema.sql
echo "1️⃣  Creating database schema..."
npx supabase db push --db-url "postgresql://postgres.${PROJECT_ID}:${SUPABASE_DB_PASSWORD}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres" --file "$SCHEMA_FILE" || {
  echo "⚠️  Warning: Schema push failed. Trying alternative method..."

  # Alternative: Use psql if available
  if command -v psql &> /dev/null; then
    echo "Using psql to execute schema..."
    PGPASSWORD="${SUPABASE_DB_PASSWORD}" psql -h "aws-0-ap-northeast-1.pooler.supabase.com" -U "postgres.${PROJECT_ID}" -d postgres -p 5432 -f "$SCHEMA_FILE"
  else
    echo "❌ Please install psql or run schema.sql manually in Supabase SQL Editor"
    exit 1
  fi
}

echo "✅ Schema created successfully!"
echo ""

# Step 2: Run seed.sql
echo "2️⃣  Inserting seed data..."
npx supabase db push --db-url "postgresql://postgres.${PROJECT_ID}:${SUPABASE_DB_PASSWORD}@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres" --file "$SEED_FILE" || {
  echo "⚠️  Warning: Seed push failed. Trying alternative method..."

  if command -v psql &> /dev/null; then
    echo "Using psql to execute seed..."
    PGPASSWORD="${SUPABASE_DB_PASSWORD}" psql -h "aws-0-ap-northeast-1.pooler.supabase.com" -U "postgres.${PROJECT_ID}" -d postgres -p 5432 -f "$SEED_FILE"
  else
    echo "❌ Please install psql or run seed.sql manually in Supabase SQL Editor"
    exit 1
  fi
}

echo "✅ Seed data inserted successfully!"
echo ""

# Step 3: Generate TypeScript types
echo "3️⃣  Generating TypeScript types..."
yarn db:types

echo "✅ TypeScript types generated!"
echo ""

echo "🎉 Database setup complete!"
echo ""
echo "📊 Next steps:"
echo "   1. Verify data: https://supabase.com/dashboard/project/${PROJECT_ID}/editor"
echo "   2. Test connection: http://localhost:5174/admin/supabase-test"
echo ""
