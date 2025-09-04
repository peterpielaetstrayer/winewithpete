-- Update sample events with future dates
-- Run this in your Supabase SQL editor

UPDATE events 
SET event_date = '2024-02-15 10:00:00+00'
WHERE title = 'Open Fire Sunday - Beach Gathering';

UPDATE events 
SET event_date = '2024-02-20 18:00:00+00'
WHERE title = 'Salon Dinner - Philosophy & Wine';

-- Verify the events are updated
SELECT id, title, event_date, is_public, is_active 
FROM events 
ORDER BY event_date;
