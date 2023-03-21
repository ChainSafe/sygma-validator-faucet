export function ensureEnv(envName: string, fallback: string): string {
  return (import.meta.env[`REACT_APP_${envName}`] as string) ?? fallback;
}
