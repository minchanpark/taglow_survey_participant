import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { ParticipantApiError, toParticipantApiError } from './apiErrors';
import type {
  ParticipantApiGateway,
  RawAnswer,
  RawAssetRow,
  RawCreateAnswerPayload,
  RawCreateResponsePayload,
  RawDuplicateSubmissionResult,
  RawPublicSurveyBundle,
  RawQuestionRow,
  RawResponse,
  RawSectionRow,
  RawSession,
  RawSubmitSurveyPayload,
  RawSubmitSurveyResult,
  RawSurveyRow,
} from './participantApiGateway';

export class SupabaseParticipantApiGateway implements ParticipantApiGateway {
  constructor(private readonly supabase: SupabaseClient) {}

  async getSession(): Promise<RawSession | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      throw toParticipantApiError(error, 'UNAUTHENTICATED');
    }

    const session = data.session;
    if (!session) {
      return null;
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
      },
      access_token: session.access_token,
    };
  }

  async signInWithGoogle(redirectTo: string): Promise<void> {
    const { error } = await this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });

    if (error) {
      throw toParticipantApiError(error, 'UNAUTHENTICATED');
    }
  }

  async signOut(): Promise<void> {
    const { error } = await this.supabase.auth.signOut();
    if (error) {
      throw toParticipantApiError(error, 'UNAUTHENTICATED');
    }
  }

  async fetchPublicSurveyBySlug(publicSlug: string): Promise<RawPublicSurveyBundle> {
    const { data: survey, error: surveyError } = await this.supabase
      .from('surveys')
      .select('id,title,title_ko,title_en,description,description_ko,description_en,status,public_slug,settings,published_at,closed_at')
      .eq('public_slug', publicSlug)
      .maybeSingle();

    if (surveyError) {
      throw toParticipantApiError(surveyError, 'SURVEY_NOT_FOUND');
    }

    if (!survey) {
      throw new ParticipantApiError('SURVEY_NOT_FOUND', 'Survey was not found.');
    }

    const [sectionsResult, questionsResult, assetsResult] = await Promise.all([
      this.supabase
        .from('survey_sections')
        .select('id,survey_id,section_key,title_ko,title_en,description_ko,description_en,order_index,section_type,settings')
        .eq('survey_id', survey.id)
        .order('order_index', { ascending: true })
        .returns<RawSectionRow[]>(),
      this.supabase
        .from('questions')
        .select('id,survey_id,section_id,question_key,question_type,title_ko,title_en,description_ko,description_en,order_index,is_required,metric_type,topic_key,space_key,config,validation')
        .eq('survey_id', survey.id)
        .order('order_index', { ascending: true })
        .returns<RawQuestionRow[]>(),
      this.supabase
        .from('survey_assets')
        .select('id,survey_id,section_id,question_id,asset_type,storage_bucket,storage_path,metadata')
        .eq('survey_id', survey.id)
        .returns<RawAssetRow[]>(),
    ]);

    if (sectionsResult.error) {
      throw toParticipantApiError(sectionsResult.error, 'SURVEY_NOT_FOUND');
    }

    if (questionsResult.error) {
      throw toParticipantApiError(questionsResult.error, 'SURVEY_NOT_FOUND');
    }

    if (assetsResult.error) {
      throw toParticipantApiError(assetsResult.error, 'ASSET_LOAD_FAILED');
    }

    return {
      survey: survey as RawSurveyRow,
      sections: sectionsResult.data ?? [],
      questions: questionsResult.data ?? [],
      assets: assetsResult.data ?? [],
    };
  }

  async checkDuplicateSubmission(args: {
    surveyId: string;
    participantUserId: string;
  }): Promise<RawDuplicateSubmissionResult> {
    const { data, error } = await this.supabase
      .from('responses')
      .select('id,submitted_at')
      .eq('survey_id', args.surveyId)
      .eq('participant_user_id', args.participantUserId)
      .eq('status', 'submitted')
      .maybeSingle();

    if (error) {
      throw toParticipantApiError(error, 'UNKNOWN');
    }

    return {
      alreadySubmitted: Boolean(data),
      responseId: (data as { id?: string } | null)?.id,
      submittedAt: (data as { submitted_at?: string | null } | null)?.submitted_at ?? undefined,
    };
  }

  async createResponse(payload: RawCreateResponsePayload): Promise<RawResponse> {
    const { data, error } = await this.supabase
      .from('responses')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw toParticipantApiError(error, 'SUBMISSION_FAILED');
    }

    return data as RawResponse;
  }

  async createAnswers(payloads: RawCreateAnswerPayload[]): Promise<RawAnswer[]> {
    if (payloads.length === 0) {
      return [];
    }

    const { data, error } = await this.supabase.from('answers').insert(payloads).select('*').returns<RawAnswer[]>();

    if (error) {
      throw toParticipantApiError(error, 'SUBMISSION_FAILED');
    }

    return data ?? [];
  }

  async submitSurveyResponse(payload: RawSubmitSurveyPayload): Promise<RawSubmitSurveyResult> {
    const { data, error } = await this.supabase.rpc('submit_survey_response', {
      payload,
    });

    if (error) {
      throw toParticipantApiError(error, 'SUBMISSION_FAILED');
    }

    const result = data as { response_id?: string; responseId?: string; submitted_at?: string; submittedAt?: string };
    const responseId = result.responseId ?? result.response_id;

    if (!responseId) {
      throw new ParticipantApiError('SUBMISSION_FAILED', 'Submission RPC did not return a response id.');
    }

    return {
      responseId,
      submittedAt: result.submittedAt ?? result.submitted_at,
    };
  }

  async createSignedAssetUrl(args: { bucket: string; path: string }): Promise<string> {
    const { data, error } = await this.supabase.storage.from(args.bucket).createSignedUrl(args.path, 60 * 60);

    if (error || !data?.signedUrl) {
      throw toParticipantApiError(error, 'ASSET_LOAD_FAILED');
    }

    return data.signedUrl;
  }
}

export function createSupabaseParticipantApiGateway(args: {
  supabaseUrl: string;
  supabaseAnonKey: string;
}): SupabaseParticipantApiGateway {
  return new SupabaseParticipantApiGateway(
    createClient(args.supabaseUrl, args.supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }),
  );
}
