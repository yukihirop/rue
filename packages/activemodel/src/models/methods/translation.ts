export function humanPropertyName(key: string, translate: (propKey: string) => string): string {
  return translate(key);
}
