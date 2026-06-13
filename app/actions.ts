// app/actions.ts
'use server';

import { db } from '../db';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

// FLCUT-AI-2627-visible
// loopTraceMarkerVisible

// 1. Define a reserved word blocklist to protect our Next.js routes
const RESERVED_WORDS = ['admin', 'api', 'dashboard', 'login', 'static', 'favicon', 'links'];

export async function createShortLink(formData: FormData) {
  const longUrl = formData.get('longUrl') as string;
  let customAlias = formData.get('customAlias') as string;

  // Clean up any accidental spaces the user might have typed
  customAlias = customAlias?.trim().toLowerCase();

  let finalCode = '';

  if (customAlias) {
    // 2. Hard Problem Check A: Is the requested alias on the blocklist?
    if (RESERVED_WORDS.includes(customAlias)) {
      throw new Error("This alias is reserved for system use. Please pick another one!");
    }

    // 3. Hard Problem Check B: Does this alias already exist in the database?
    const existingLink = await db.link.findUnique({
      where: { shortCode: customAlias },
    });

    if (existingLink) {
      throw new Error("This alias is already taken! Try adding a year or a number to it.");
    }

    finalCode = customAlias;
  } else {
    // 4. Default behavior: If no alias is given, generate a random 6-character code
    finalCode = nanoid(6);
  }

  // 5. Save securely to your cloud Neon database
  await db.link.create({
    data: {
      longUrl,
      shortCode: finalCode,
    },
  });

  // Refresh the page data instantly
  revalidatePath('/');
}