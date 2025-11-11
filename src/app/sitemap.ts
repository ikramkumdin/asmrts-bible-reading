import { MetadataRoute } from 'next'
// Dynamically import to avoid loading large file during build
let getAllBooks: () => any[];

try {
  const bibleData = require('@/lib/bibleData');
  getAllBooks = bibleData.getAllBooks;
} catch (error) {
  console.error('Error loading bibleData:', error);
  getAllBooks = () => [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.asmrbible.app'
  const books = getAllBooks()
  
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/bible`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voices`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/account`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  const bookPages = books.map((book) => ({
    url: `${baseUrl}/bible/${book.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...bookPages]
}

