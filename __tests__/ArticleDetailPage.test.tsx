import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

jest.mock('next/navigation', () => ({
  useParams: () => ({ url: 'https://test-url.com/artikel-123' }),
  useRouter: () => ({ back: jest.fn() }),
}));

beforeEach(() => {
  const localStorageMock = (function() {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value.toString(); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();
  Object.defineProperty(window, 'localStorage', { value: localStorageMock });

  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({
        article: {
          title: 'Test Judul Artikel',
          description: 'Deskripsi artikel',
          author: 'Penulis',
          publishedAt: '2024-06-01T12:00:00Z',
          urlToImage: null,
          source: { name: 'Sumber', id: null },
          url: 'https://test-url.com/artikel-123',
          content: '',
        },
      }),
    })
  ) as jest.Mock;
});

afterEach(() => {
  jest.resetAllMocks();
});

describe('ArticleDetailPage', () => {
  it('menampilkan judul artikel', async () => {
    const ArticleDetailPage = (await import('../app/article/[url]/page')).default;
    window.localStorage.setItem(
      "lastArticle",
      JSON.stringify({
        title: 'Test Judul Artikel',
        description: 'Deskripsi artikel',
        author: 'Penulis',
        publishedAt: '2024-06-01T12:00:00Z',
        urlToImage: null,
        source: { name: 'Sumber', id: null },
        url: 'https://test-url.com/artikel-123',
        content: '',
      })
    );
    render(<ArticleDetailPage />);
    await waitFor(() => {
      // @ts-expect-error: jest-dom extend expect
      expect(screen.getByText(/Test Judul Artikel/i)).toBeInTheDocument();
    });
  });
}); 