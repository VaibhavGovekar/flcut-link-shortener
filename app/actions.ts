'use server';

import { db } from '../db';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';

const RESERVED_WORDS = ['admin', 'api', 'dashboard', 'login', 'static', 'favicon', 'links'];

export async function createShortLink(formData: FormData) {
  const longUrl = formData.get('longUrl') as string;
  let customAlias = formData.get('customAlias') as string;

  customAlias = customAlias?.trim().toLowerCase();

  let finalCode = '';

  if (customAlias) {
    if (RESERVED_WORDS.includes(customAlias)) {
      throw new Error("This alias is reserved for system use. Please pick another one!");
    }

    const existingLink = await db.link.findUnique({
      where: { shortCode: customAlias },
    });

    if (existingLink) {
      throw new Error("This alias is already taken! Try adding a year or a number to it.");
    }

    finalCode = customAlias;
  } else {
    finalCode = nanoid(6);
  }

  await db.link.create({
    data: {
      longUrl,
      shortCode: finalCode,
    },
  });

  revalidatePath('/');
}