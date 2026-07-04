import { describe, expect, it } from 'vitest';
import { faviconUrl, hostnameOf } from './bookmarks';

describe('hostnameOf', () => {
  it('strips the protocol and www prefix', () => {
    expect(hostnameOf('https://www.example.com/path')).toBe('example.com');
  });

  it('returns the raw input if it is not a valid URL', () => {
    expect(hostnameOf('not a url')).toBe('not a url');
  });
});

describe('faviconUrl', () => {
  it('builds a favicon service URL from the hostname', () => {
    expect(faviconUrl('https://example.com')).toContain('domain=example.com');
  });

  it('returns null for an invalid URL', () => {
    expect(faviconUrl('not a url')).toBeNull();
  });
});
