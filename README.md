# AWS Connect Developer Assessment

Two assessment tracks:

- Amazon Connect Fundamentals — 300-question bank
- Amazon Connect AI Fundamentals — 300-question bank

Each attempt:
- asks for the learner's full name before starting
- randomly selects 50 questions from the 300-question bank
- randomizes answer order
- has a 60-minute timer
- uses an 80% benchmark
- automatically submits at time-out
- avoids explicit PASS/FAIL wording on the result screen
- stores the attempt in Supabase when configured
- provides an administrator page at `?admin=1` for Excel export

## Assessment links after GitHub Pages deployment

If this repository is named `aws-connect-assessment`:

- Fundamentals: `https://YOUR_GITHUB_USERNAME.github.io/aws-connect-assessment/?course=fundamentals`
- AI Fundamentals: `https://YOUR_GITHUB_USERNAME.github.io/aws-connect-assessment/?course=ai`
- Admin export: `https://YOUR_GITHUB_USERNAME.github.io/aws-connect-assessment/?admin=1`

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor**.
3. Paste all of `supabase_schema.sql` into a new query and run it.
4. Create the manager/admin user in **Authentication → Users**.
5. Copy that user's UUID and add it to `staff_roles` using the SQL shown at the bottom of the schema.
6. In `index.html`, replace:
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`
7. Commit and push to GitHub.
8. Enable GitHub Pages for the repository.

The ANON key is intended for browser use with RLS enabled. Never place the Supabase service-role key in the website.

## AWS source basis

Questions are independently authored from AWS documentation and training material. Primary references include:

- What is Amazon Connect / Connect Customer: https://docs.aws.amazon.com/connect/latest/adminguide/what-is-amazon-connect.html
- Flow block definitions: https://docs.aws.amazon.com/connect/latest/adminguide/contact-block-definitions.html
- Contact flows: https://docs.aws.amazon.com/connect/latest/adminguide/contact-flows.html
- Routing profiles: https://docs.aws.amazon.com/connect/latest/adminguide/routing-profiles.html
- Security profiles: https://docs.aws.amazon.com/connect/latest/adminguide/security-profile.html
- AI in Connect: https://docs.aws.amazon.com/connect/latest/adminguide/ai-in-connect.html
- Connect AI agents: https://docs.aws.amazon.com/connect/latest/adminguide/connect-ai-agent.html
- AI agent setup: https://docs.aws.amazon.com/connect/latest/adminguide/ai-agent-initial-setup.html
- AI agent self-service: https://docs.aws.amazon.com/connect/latest/adminguide/ai-agent-self-service.html
- Create AI agents: https://docs.aws.amazon.com/connect/latest/adminguide/create-ai-agents.html
- Default AI prompts/agents: https://docs.aws.amazon.com/connect/latest/adminguide/default-ai-system.html
- Agentic assistance: https://docs.aws.amazon.com/connect/latest/adminguide/agentic-assistance.html
- Search for content: https://docs.aws.amazon.com/connect/latest/adminguide/search-for-answers.html
- Step-by-step guides: https://docs.aws.amazon.com/connect/latest/adminguide/integrate-guides-with-ai-agents.html

The assessment is not an AWS certification exam and is not endorsed by AWS.
