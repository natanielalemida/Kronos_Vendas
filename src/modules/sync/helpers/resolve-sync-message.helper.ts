import {SyncMessageCollection, SyncMessageEntry} from '../types/sync.types';

function getMessageFromEntry(entry: SyncMessageEntry): string | undefined {
  if (typeof entry === 'string') {
    const normalizedEntry = entry.trim();

    return normalizedEntry.length > 0 ? normalizedEntry : undefined;
  }

  if (!entry || typeof entry !== 'object') {
    return undefined;
  }

  const content =
    typeof entry.Conteudo === 'string'
      ? entry.Conteudo
      : typeof entry.conteudo === 'string'
        ? entry.conteudo
        : undefined;

  const normalizedContent = content?.trim();

  return normalizedContent && normalizedContent.length > 0
    ? normalizedContent
    : undefined;
}

export function resolveSyncMessage(
  messages: SyncMessageCollection,
  fallback: string,
): string {
  if (!Array.isArray(messages)) {
    return fallback;
  }

  for (const entry of messages) {
    const message = getMessageFromEntry(entry);

    if (message) {
      return message;
    }
  }

  return fallback;
}
