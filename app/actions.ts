// app/actions.ts
'use server';

import { db } from '../db'; // Notice the '../db' instead of '@/db'
import { revalidatePath } from 'next/cache';

// FLCUT-AI-2627-visible
export async function createShortLink(formData: FormData) {
  const longUrl = formData.get('longUrl') as string;
  
  if (!longUrl) {
    throw new Error('URL is required!');
  }

  // 1. Generate a random 6-character short code (e.g., "a8f3g2")
  const shortCode = Math.random().toString(36).substring(2, 8);

  // 2. Save the pair inside your cloud database table
  await db.link.create({
    data: {
      longUrl: longUrl,
      shortCode: shortCode,
      loopTraceMarkerVisible: "active" // Keeps our compliance marker safe!
    }
  });

  // 3. Tell Next.js to refresh the UI page to show the new link
  revalidatePath('/');
}