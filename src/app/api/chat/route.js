// src/app/api/chat/route.js (or route.ts if using TypeScript)

export async function POST(req) {
    try {
      const body = await req.json();
      const userMessage = body.message;
  
      if (!userMessage) {
        return new Response(
          JSON.stringify({ error: "No message provided." }),
          { status: 400 }
        );
      }
  
      // Send to your Flask backend
      const flaskRes = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!flaskRes.ok) {
        const text = await flaskRes.text();
        console.error("Flask returned non-JSON:", text);
        return new Response(JSON.stringify({ error: "Flask error", details: text }), {
          status: flaskRes.status,
        });
      }
      
      const flaskData = await flaskRes.json();
      
  
      return new Response(JSON.stringify(flaskData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("API Route Error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        { status: 500 }
      );
    }
  }
  