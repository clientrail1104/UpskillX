# AWS Cloud & Amazon Connect Developer Assessment — Supabase

## Included
- 29 courses
- 300 questions per course
- 150 Beginner + 150 Intermediate per course
- 8,700 total questions
- Full name is required before starting an assessment
- Email address is optional
- Each attempt: exactly 50 questions (25 Beginner + 25 Intermediate)
- 60-minute countdown timer
- Automatic submission when the timer reaches 00:00
- Passing mark: 80% (40/50 correct)
- Randomized question order
- Randomized answer order
- Server-side scoring
- Centralized response storage
- Admin-only Excel export
- GitHub Pages-ready frontend

## Setup
1. Create a Supabase project.
2. Open SQL Editor and run `supabase_schema_and_seed.sql`.
3. Create an Email/Password admin user in Supabase Auth.
4. Insert the admin user's UUID:
   `insert into public.admin_users(user_id) values ('YOUR-AUTH-USER-UUID');`
5. Edit `config.js` with the Supabase project URL and publishable/anon key.
6. Upload `index.html`, `config.js`, and `app.js` to GitHub Pages.

## Security
The browser receives questions without the correct answer. Scoring happens in the Postgres function `submit_assessment`.
Use only the publishable/anon key in `config.js`; never expose a service-role/secret key on GitHub Pages.

## Question quality
The bank is an original assessment bank derived from AWS official training/documentation topics. It is not AWS certification exam content. For formal hiring/certification use, validate each item against the exact AWS course/documentation version used by your organization.

- Premium responsive result screen with score visualization, status badge, candidate identity, score breakdown and clear passing threshold.
