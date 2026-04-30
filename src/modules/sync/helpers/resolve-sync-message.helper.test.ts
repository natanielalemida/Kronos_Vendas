import {describe, expect, it} from '@jest/globals';

import {resolveSyncMessage} from './resolve-sync-message.helper';

describe('resolveSyncMessage', () => {
  it('returns the first non-empty string message', () => {
    expect(resolveSyncMessage(['Erro x'], 'fallback')).toBe('Erro x');
  });

  it('returns the first non-empty Conteudo message', () => {
    expect(
      resolveSyncMessage([{Conteudo: 'Erro x'}], 'fallback'),
    ).toBe('Erro x');
  });

  it('returns the first non-empty conteudo message', () => {
    expect(
      resolveSyncMessage([{conteudo: 'Erro x'}], 'fallback'),
    ).toBe('Erro x');
  });

  it('skips empty entries until a valid message is found', () => {
    expect(
      resolveSyncMessage(
        ['   ', {Conteudo: '   '}, null, {conteudo: 'Erro x'}],
        'fallback',
      ),
    ).toBe('Erro x');
  });

  it('returns the fallback for undefined, null, empty arrays, and malformed entries', () => {
    expect(resolveSyncMessage(undefined, 'fallback')).toBe('fallback');
    expect(resolveSyncMessage(null, 'fallback')).toBe('fallback');
    expect(resolveSyncMessage([], 'fallback')).toBe('fallback');
    expect(
      resolveSyncMessage([123 as never, {} as never, {Conteudo: null}], 'fallback'),
    ).toBe('fallback');
  });
});
