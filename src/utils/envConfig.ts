export type AppEnvConfig = Readonly<{
  supabaseUrl: string;
  supabaseAnonKey: string;
  participantApiMode: 'supabase' | 'http';
  participantApiBaseUrl?: string;
}>;

export function readEnvConfig(): AppEnvConfig {
  const env = readImportMetaEnv();
  const supabaseUrl = readRequiredEnv(env, 'VITE_SUPABASE_URL');
  const supabaseAnonKey = readRequiredEnv(env, 'VITE_SUPABASE_ANON_KEY');
  const participantApiMode = env.VITE_PARTICIPANT_API_MODE === 'http' ? 'http' : 'supabase';

  return {
    supabaseUrl,
    supabaseAnonKey,
    participantApiMode,
    participantApiBaseUrl: env.VITE_PARTICIPANT_API_BASE_URL,
  };
}

function readRequiredEnv(env: Record<string, string | undefined>, key: string): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

function readImportMetaEnv(): Record<string, string | undefined> {
  return ((import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {}) as Record<
    string,
    string | undefined
  >;
}

