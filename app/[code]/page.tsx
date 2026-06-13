// app/[code]/page.tsx
import { db } from '../../db';
import { redirect } from 'next/navigation';

// FLCUT-AI-2627-visible

interface RedirectPageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  // 1. Grab the dynamic short code out of the URL bar
  const { code } = await params;

  // 2. Look up this short code in your Neon cloud database
  const linkData = await db.link.findUnique({
    where: { shortCode: code },
  });

  // 3. If the link exists, instantly redirect the user to the long URL!
  if (linkData) {
    redirect(linkData.longUrl);
  }

  // 4. If the code doesn't exist in our records, show a clean error message
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Link Not Found 😢</h1>
      <p>The short code <strong>"{code}"</strong> does not exist or has expired.</p>
      <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>Go back home</a>
    </div>
  );
}