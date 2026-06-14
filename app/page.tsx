// app/page.tsx
import { Metadata } from 'next';
import { db } from '../db'; 
import { createShortLink } from './actions';

// 1. Next.js reads this perfectly on the server
export const metadata: Metadata = {
  title: "FLCut | FLC Link Shortener 🚀",
  description: "Custom, trackable short links for Finite Loop Club events.",
};

export default async function HomePage() {
  // 2. Fetch links out of your Neon cloud database
  const savedLinks = await db.link.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // 3. Clean environment-based URL calculation (No 'window' object used!)
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://flcut-link-shortener.vercel.app' 
    : 'http://localhost:3000';

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>FLCut Link Shortener 🚀</h1>
      <p style={{ color: "#666" }}>Welcome to the Finite Loop Club recruitment build!</p>
      
      {/* Input Form Box */}
      <form action={createShortLink} style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "30px 0" }}>
        <input 
          type="url" 
          name="longUrl" 
          placeholder="Paste your long, ugly URL here... (e.g., https://forms.gle/...)" 
          required 
          style={{ padding: "12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#222", color: "#fff", fontSize: "16px" }}
        />
        
        <div style={{ display: "flex", gap: "10px" }}>
          <input 
            type="text" 
            name="customAlias" 
            placeholder="Custom alias (optional, e.g., hackfest26)" 
            style={{ flex: 1, padding: "12px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#222", color: "#fff", fontSize: "16px" }}
          />
          <button type="submit" style={{ padding: "12px 24px", background: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}>
            Shorten!
          </button>
        </div>
      </form>

      {/* Simple Dashboard List */}
      <h2>Your Short Links 📊</h2>
      {savedLinks.length === 0 ? (
        <p style={{ color: "#999" }}>No links generated yet. Be the first!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedLinks.map((link) => {
            const fullShortLink = `${baseUrl}/${link.shortCode}`;

            return (
              <li key={link.id} style={{ padding: "16px", border: "1px solid #333", borderRadius: "8px", marginBottom: "12px", background: "#111", color: "white" }}>
                <div style={{ marginBottom: "8px" }}>
                  <strong style={{ color: "#0070f3" }}>Shortened Link:</strong>{' '}
                  <a 
                    href={`/${link.shortCode}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: "#0070f3", textDecoration: "underline", wordBreak: "break-all" }}
                  >
                    {fullShortLink}
                  </a>
                </div>
                <div style={{ fontSize: "13px", color: "#888", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  <strong>Original Destination:</strong> {link.longUrl}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}