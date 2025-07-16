import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import HomePage from '../app/page';

function mockFetch(response: any, ok = true) {
  (global.fetch as jest.Mock) = jest.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
    })
  );
}

describe('HomePage', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('menampilkan judul utama', async () => {
    mockFetch({ status: 'ok', articles: [] });
    render(<HomePage />);
    await waitFor(() => {
      // @ts-expect-error: jest-dom extend expect
      expect(screen.getByText(/News Hub/i)).toBeInTheDocument();
    });
  });

  it('menampilkan loading spinner', async () => {
    mockFetch(new Promise(() => {}));
    render(<HomePage />);
    // @ts-expect-error: jest-dom extend expect
    expect(screen.getByText(/Loading latest news/i)).toBeInTheDocument();
  });

  it('menampilkan error jika fetch gagal', async () => {
    mockFetch({ status: 'error', message: 'Gagal fetch' }, false);
    render(<HomePage />);
    await waitFor(() => {
      // @ts-expect-error: jest-dom extend expect
      expect(screen.getByText(/Gagal fetch/i)).toBeInTheDocument();
    });
  });

  it('menampilkan artikel jika fetch sukses', async () => {
    mockFetch({ status: 'ok', articles: [
      {
        title: 'Judul Artikel Test',
        description: 'Deskripsi',
        author: 'Penulis',
        publishedAt: '2024-06-01T12:00:00Z',
        urlToImage: null,
        source: { name: 'Sumber', id: null },
        url: '',
        content: '',
      },
    ] });
    render(<HomePage />);
    await waitFor(() => {
      // @ts-expect-error: jest-dom extend expect
      expect(screen.getByText(/Judul Artikel Test/i)).toBeInTheDocument();
    });
  });
});