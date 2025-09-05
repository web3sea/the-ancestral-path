# AO Platform Architecture

- Web app connects to AI oracle (AO) built on knowledge base
- Knowledge base: Pinecone vector database
- LangChain + Claude LLM for prompts and memory management
- 11Labs for character voice styling and tone control
- All data stored in Supabase tables:

* Accounts (name, phone, email)
* ABJ past events, AO on-demand sessions
* Group workshop attendance, one-on-one sessions
* AO phone calls made, AO messages sent
* Medicine retreats, wisdom drips, medicine containers
* Breathwork, astrological downloads, mini challenges
* Guided meditations, resources
* User profile (AO questionnaire responses)
* Various attendance tables (retreat, ABJ, medicine container)

# Communication Infrastructure:

- Messages: SMS or WhatsApp via Twilio
- Voice calls: WhatsApp API + Vappy
- AO has single phone number with authentication

* Only accepts whitelisted numbers from accounts database
* Requires secret word or similar verification

- Onboarding handled by AO through SMS/WhatsApp

* Collects profile questions, stores in Supabase
* User selects preferred platform (WhatsApp/SMS)

# Pricing Tiers & Features:

- Tier 1 ($29/month):

* All resources access
* Daily AO messaging (once per day only)
* Personal dashboard

- Tier 2 ($39/month):

* Everything from Tier 1
* Voice calling capability
* Monthly Q&A sessions

# Email Nurturing Strategy:

- 25-30 transactional emails across user journey
- Non-converting leads: Single email to form submissions
- User sequences:

* Welcome email upon first login
* First AO experience email
* End of first week email

- Streak sequences: 3-day streak, 1-week streak
- Churn prevention: Day 5, 12, and 21 non-usage emails
- Cancellation sequence:

* Immediate “you’re all set” email
* Follow-ups at 3 days, 12 days
* Monthly re-engagement emails

- Power user upsell sequences for high-engagement users
- Monthly tier roundup email highlighting other available plans

# Administration & Lead Generation

- Administrator dashboard features:

* Aggregate analytics and CRM
* Individual account data and user profiles
* Event attendance tracking across all programs
* Visual conversion metrics and deal flow

- Lead generation campaign:

* Multi-channel: emails, SMS, community posts
* Landing page drives to AO platform experience
* HubSpot CRM tracks reply status and lead warming
* Pre-ABJ preparation sequence via AO
* Post-ABJ follow-up with light AI oracle experience
