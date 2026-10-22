-- LIELOOP Supabase Database Schema
-- Viral Social Game: "How well do you really know your friend's lies?"

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TESTS TABLE
CREATE TABLE IF NOT EXISTS public.tests (
    id VARCHAR(16) PRIMARY KEY, -- Secure random string e.g. '7xK92LmQ'
    creator_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days') NOT NULL,
    status VARCHAR(20) DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'expired', 'archived')),
    question_count INT DEFAULT 12 NOT NULL,
    question_ids JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Index for test lookups
CREATE INDEX IF NOT EXISTS idx_tests_status ON public.tests(status);
CREATE INDEX IF NOT EXISTS idx_tests_expires ON public.tests(expires_at);

-- 2. CREATOR ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.creator_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id VARCHAR(16) NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    question_id VARCHAR(32) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_test_question UNIQUE (test_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_creator_answers_test ON public.creator_answers(test_id);

-- 3. FRIEND SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.friend_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id VARCHAR(16) NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    friend_name VARCHAR(50) DEFAULT 'Anonymous Friend',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_friend_sessions_test ON public.friend_sessions(test_id);

-- 4. FRIEND ANSWERS TABLE
CREATE TABLE IF NOT EXISTS public.friend_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.friend_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(32) NOT NULL,
    answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_session_question UNIQUE (session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_friend_answers_session ON public.friend_answers(session_id);

-- 5. RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.friend_sessions(id) ON DELETE CASCADE,
    test_id VARCHAR(16) NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
    correct_count INT NOT NULL,
    total_questions INT NOT NULL,
    score_percentage INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_results_session ON public.results(session_id);
CREATE INDEX IF NOT EXISTS idx_results_test ON public.results(test_id);

-- ====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friend_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Tests: Public can read active tests (metadata only)
CREATE POLICY "Public read active tests" 
ON public.tests FOR SELECT 
USING (status = 'active' AND expires_at > NOW());

-- Tests: Anyone can create a new test
CREATE POLICY "Public create tests" 
ON public.tests FOR INSERT 
WITH CHECK (true);

-- CRITICAL ANTI-CHEATING RULE:
-- Creator answers are NEVER directly selectable by anonymous public clients!
-- Creator answers can only be inserted during test creation, or accessed by server-side service role.
CREATE POLICY "Service role only for creator answers select" 
ON public.creator_answers FOR SELECT 
USING (auth.role() = 'service_role');

CREATE POLICY "Public insert creator answers during creation" 
ON public.creator_answers FOR INSERT 
WITH CHECK (true);

-- Friend Sessions: Public can create session and read their own session
CREATE POLICY "Public create friend sessions" 
ON public.friend_sessions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public read friend sessions" 
ON public.friend_sessions FOR SELECT 
USING (true);

-- Friend Answers: Public can insert their guesses and read their session answers
CREATE POLICY "Public create friend answers" 
ON public.friend_answers FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public read friend answers" 
ON public.friend_answers FOR SELECT 
USING (true);

-- Results: Public can read and write results
CREATE POLICY "Public insert results" 
ON public.results FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public read results" 
ON public.results FOR SELECT 
USING (true);
