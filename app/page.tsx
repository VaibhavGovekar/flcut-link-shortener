import Image from "next/image";
// app/page.tsx
import { db } from '../db'; // Points up one level to your root folder
import { createShortLink } from './actions';

// FLCUT-AI-2627-visible

export default async function HomePage() {
  // 1. Fetch all saved links out of your Neon cloud database spreadsheet
  const savedLinks = await db.link.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h1>FLCut Link Shortener 🚀</h1>
      <p style={{ color: "#666" }}>Welcome to the Finite Loop Club recruitment build!</p>
      
      {/* Input Form Box */}
      <form action={createShortLink} style={{ display: "flex", gap: "10px", margin: "30px 0" }}>
        <input 
          type="url" 
          name="longUrl" 
          placeholder="Paste your long, ugly URL here..." 
          required 
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #444", backgroundColor: "#222", color: "#fff",fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "10px 20px", background: "#0070f3", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          Shorten!
        </button>
      </form>

     {/* Simple Dashboard List */}
      <h2>Your Short Links 📊</h2>
      {savedLinks.length === 0 ? (
        <p style={{ color: "#999" }}>No links generated yet. Be the first!</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {savedLinks.map((link) => {
            // Replace 'flcut-link-shortener' with your actual Vercel project name if it's different!
            const baseUrl = typeof window !== 'undefined' 
              ? window.location.origin 
              : process.env.NODE_ENV === 'production'
                ? 'https://flcut-link-shortener.vercel.app' // Your clean production URL
                : 'http://localhost:3000';

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