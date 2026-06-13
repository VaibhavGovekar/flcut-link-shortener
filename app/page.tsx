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
          {savedLinks.map((link) => (
            <li key={link.id} style={{ padding: "12px", border: "1px solid #eee", borderRadius: "6px", marginBottom: "10px", background: "#fafafa", color: "black" }}>
              <div><strong>Short Code:</strong> {link.shortCode}</div>
              <div style={{ fontSize: "12px", color: "#666", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                <strong>Original Link:</strong> {link.longUrl}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}