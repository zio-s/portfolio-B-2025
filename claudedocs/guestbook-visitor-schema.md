# Guestbook Visitor Counting - Database Schema

## Required Supabase Table

### Table: `guestbook_visitors`

This table tracks daily visitor counts for the guestbook page.

#### Schema Definition

```sql
CREATE TABLE guestbook_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_date DATE NOT NULL UNIQUE,
  visitor_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster date queries
CREATE INDEX idx_guestbook_visitors_date ON guestbook_visitors(visit_date);
```

#### Column Descriptions

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Unique identifier for each record |
| `visit_date` | DATE | NOT NULL, UNIQUE | The date for visitor tracking (YYYY-MM-DD) |
| `visitor_count` | INTEGER | NOT NULL, DEFAULT 1 | Number of visitors for that day |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Record update timestamp |

#### Row-Level Security (RLS)

Enable RLS and create policies for proper access control:

```sql
-- Enable RLS
ALTER TABLE guestbook_visitors ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access (for displaying count)
CREATE POLICY "Allow public read access"
ON guestbook_visitors
FOR SELECT
TO public
USING (true);

-- Policy: Allow public insert/update (for incrementing count)
CREATE POLICY "Allow public insert/update"
ON guestbook_visitors
FOR ALL
TO public
USING (true)
WITH CHECK (true);
```

#### Usage in Application

**API Endpoints:**
- `getTodayVisitorCount` - Queries visitor count for today
- `incrementVisitorCount` - Creates or increments today's visitor count

**Implementation Details:**
1. On page load, check `localStorage` for cached visitor count (`guestbook_visitor_cache`)
2. If cache exists and date matches today:
   - Display cached count immediately (NO API CALL)
   - Check if first visit today (`guestbook_last_visit`)
   - If first visit: increment counter and update cache
3. If cache doesn't exist or date is different:
   - Fetch count from API (`getTodayVisitorCount`)
   - Store result in localStorage cache
   - Increment if first visit today
4. Database operation (only when incrementing):
   - Check if record exists for today (based on `visit_date`)
   - If exists: increment `visitor_count` by 1
   - If not exists: create new record with `visitor_count = 1`

**API Call Optimization:**
- **localStorage Keys:**
  - `guestbook_last_visit`: Last visit date (YYYY-MM-DD)
  - `guestbook_visitor_cache`: Cached count with date `{date, count}`
- **Caching Strategy:**
  - Same-day page refreshes use cached count (NO API CALL ✅)
  - Only fetches from API on first visit of the day
  - RTK Query cache: 1 hour (`keepUnusedDataFor: 3600`)
- **Result**: Dramatically reduced API calls (~99% reduction for repeat visitors)

**Automatic Behavior:**
- One count per user per day (browser-based)
- Counter resets daily (new date = new record)
- Historical data preserved for analytics
- Refreshing page does not create duplicate counts

#### Migration Steps

1. **Create table in Supabase Dashboard:**
   - Navigate to SQL Editor
   - Run the CREATE TABLE statement above
   - Create the index for performance

2. **Enable RLS and add policies:**
   - Run the RLS enable statement
   - Add the public access policies

3. **Verify table structure:**
   - Check Tables view in Supabase Dashboard
   - Confirm RLS is enabled
   - Test policies with a test insert

4. **Test in application:**
   - Visit guestbook page
   - Verify counter increments
   - Check database to confirm record creation

#### Sample Data

After a few days of operation, your table might look like:

| id | visit_date | visitor_count | created_at | updated_at |
|----|------------|---------------|------------|------------|
| abc-123... | 2025-11-09 | 142 | 2025-11-09 09:00:00 | 2025-11-09 23:59:45 |
| def-456... | 2025-11-10 | 87 | 2025-11-10 00:01:23 | 2025-11-10 18:30:12 |
| ghi-789... | 2025-11-11 | 203 | 2025-11-11 00:00:05 | 2025-11-11 22:15:33 |

#### Notes

- **Visitor Tracking Logic**: One count per browser per day using localStorage
- **Uniqueness Level**: Browser-based (same user on different browsers = multiple counts)
- **Privacy**: No personal data stored, only aggregated daily counts
- **Timezone**: Uses UTC by default (consider localizing if needed)
- **Data Cleanup**: localStorage automatically cleared when user clears browser data
- **Cross-Device**: Same user on different devices counts separately (expected behavior)
