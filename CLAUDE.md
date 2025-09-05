# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the ABJ Oracle (AO) platform - a Next.js application that provides AI-powered spiritual guidance through both web interface and voice/SMS communication. The platform serves both public users seeking spiritual guidance and administrators managing content.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Build the application with Turbopack
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint
```

## Architecture Overview

### Application Structure
The application follows Next.js 15 App Router conventions with a dual-interface architecture:

**Route Groups:**
- `(user)/` - Public-facing spiritual guidance platform
- `(admin)/` - Administrative content management system  
- `(auth)/` - Authentication routes (placeholder)

**API Architecture:**
- `/api/gcs/` - Google Cloud Storage operations (upload, resumable uploads)
- `/api/transcode/` - Video processing via Google Cloud Video Transcoder
- `/api/analysis/` - Speech-to-text processing via Google Cloud Speech API

### External Service Integration

**Google Cloud Platform Services:**
- **Cloud Storage**: Video/audio file storage with resumable uploads
- **Video Transcoder**: Converts uploaded videos to audio for speech analysis
- **Speech-to-Text**: Generates transcripts from audio content
- All GCP services use centralized authentication via `src/lib/gcp/`

**Planned Integrations (not yet implemented):**
- **Supabase**: User data, session records, content metadata
- **Pinecone**: Vector database for AI knowledge base
- **LangChain + Claude**: AI conversation management
- **11Labs**: Voice synthesis for character styling
- **Twilio**: SMS/WhatsApp communication
- **Vappy**: WhatsApp voice calls

### Data Flow Architecture

**Video Upload Pipeline:**
1. Admin uploads video via resumable chunked upload to GCS
2. Video Transcoder extracts audio from uploaded video
3. Speech-to-Text API processes audio to generate transcript
4. Metadata and transcript intended for Supabase storage (not yet implemented)

**Component Architecture:**
- `src/component/business/` - Domain-specific components (user vs admin)
- `src/component/common/` - Reusable UI components
- `src/component/layout/` - Layout components (header, footer)

### Shared Utilities Structure

**Centralized Libraries (`src/lib/`):**
- `gcp/` - Google Cloud Platform clients and authentication
- `config/` - Environment variable management with validation
- `utils/` - General utilities (errors, validation, async helpers)
- `supabase/` - Database types and client setup (placeholder)
- `auth/` - Authentication utilities (placeholder)

## Key Technical Patterns

**Error Handling:**
- Centralized API error handling via `handleApiError()` utility
- Custom error classes with proper HTTP status codes
- Async utilities with retry logic and timeouts

**File Upload:**
- Chunked resumable uploads for large video files (8MB chunks)
- Progress tracking and error recovery
- Integration with GCP transcoding pipeline

**Type Safety:**
- Comprehensive TypeScript types for all data structures
- Database schema types defined in `src/lib/supabase/types.ts`
- Environment variable validation with typed configuration

## Environment Configuration

Required environment variables for Google Cloud Platform:
- `GCP_PROJECT_ID` - Google Cloud project identifier
- `GCP_CLIENT_EMAIL` - Service account email
- `GCP_PRIVATE_KEY` - Service account private key (supports base64 encoding)
- `GCS_BUCKET_NAME` - Cloud Storage bucket for file uploads

Planned environment variables for future integrations:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` - Database connection
- `PINECONE_API_KEY` - Vector database
- `OPENAI_API_KEY` - Claude LLM integration
- `ELEVENLABS_API_KEY` - Voice synthesis
- `TWILIO_*` - SMS/WhatsApp credentials

## Content Management

**ABJ Recordings System:**
- Admin interface for uploading Full Moon/New Moon session videos
- Automated transcription pipeline
- Recording metadata: title, date, type, status, summary
- Video files stored in GCS, metadata intended for Supabase

**User Content Types:**
- Oracle AI chat interface
- Meditation guides
- Breathwork sessions  
- Astrological content
- Wisdom drops and mini-challenges
- Retreat and workshop information

## Current Implementation Status

**Implemented:**
- Next.js application structure with Turbopack
- Google Cloud Platform integration (Storage, Transcoder, Speech)
- Admin video upload with transcription pipeline
- Component architecture and shared utilities
- TypeScript type system

**Placeholder/Future Implementation:**
- Supabase database integration
- AI Oracle conversation system
- Authentication and user management  
- SMS/WhatsApp communication
- Voice calling capabilities
- Email nurturing sequences (25-30 transactional emails planned)

## Important Notes

- Database operations currently use mock data - Supabase integration is architecturally planned but not implemented
- GCP credentials use a normalized private key function that handles both raw and base64-encoded formats
- The application serves both B2C (spiritual guidance) and B2B (admin content management) use cases within a single codebase
- All external API calls include proper error handling and retry logic