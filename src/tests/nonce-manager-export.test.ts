import { describe, expect, it } from 'vitest';

describe('NonceManager public export', () => {
  it('is exported from the package entry point as the bigint-based implementation', async () => {
    const { NonceManager } = await import('../index.js');

    const manager = new NonceManager({ startNonce: 0n, maxNonce: 10n });
    const lock = await manager.acquire();

    // The bigint-based `src/nonce/NonceManager.ts` implementation hands out
    // `bigint` nonces; the number-based `src/nonce-manager.ts` duplicate
    // (which cannot represent Stellar int64 sequence numbers above 2^53)
    // does not expose `acquire()`/`release()` at all.
    expect(typeof lock.nonce).toBe('bigint');
    expect(lock.nonce).toBe(0n);

    lock.release();
    manager.destroy();
  });
});
