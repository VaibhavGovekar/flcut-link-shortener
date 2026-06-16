import { db } from '../../db';
import { redirect } from 'next/navigation';


interface RedirectPageProps {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: RedirectPageProps) {
  const { code } = await params;

  const linkData = await db.link.findUnique({
    where: { shortCode: code },
  });

  if (linkData) {
    redirect(linkData.longUrl);
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>Link Not Found 😢</h1>
      <p>The short code <strong>"{code}"</strong> does not exist or has expired.</p>
      <a href="/" style={{ color: "#0070f3", textDecoration: "underline" }}>Go back home</a>
    </div>
  );
}