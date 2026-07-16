import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  baseURL: "https://api.featherless.ai/v1",
  apiKey: process.env.FEATHERLESS_API_KEY,
});

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files from the "public" directory
app.use(express.static('public'));

/**
 * API Routes
 */

// 1. GET all pitches (ordered by newest first)
app.get('/api/pitches', async (req, res) => {
  try {
    const pitches = await prisma.pitch.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(pitches);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    res.status(500).json({ error: "Failed to fetch pitches" });
  }
});

// 2. POST a new problem statement to generate a pitch (AI Mock)
app.post('/api/pitches', async (req, res) => {
  try {
    const { problemStatement, pageCount = 5 } = req.body;
    if (!problemStatement) {
      return res.status(400).json({ error: "Problem statement is required" });
    }
    
    // Ensure pageCount is within bounds (1-10)
    const numPages = Math.max(1, Math.min(10, parseInt(pageCount)));

    // --- REAL AI INTEGRATION ---
    const response = await openai.chat.completions.create({
      model: "Qwen/Qwen2.5-7B-Instruct", // Using an ungated model instead of Llama 3
      messages: [
        { 
          role: "system", 
          content: `You are an expert pitch deck generator. The user will provide a problem statement. 
You must generate a presentation with exactly ${numPages} pages.
Output ONLY a valid JSON object with the following structure, no markdown formatting like \`\`\`json:
{
  "projectName": "A Catchy Startup Name",
  "pages": [
    { "title": "Page 1 Title", "content": "Engaging content for page 1..." },
    { "title": "Page 2 Title", "content": "Engaging content for page 2..." }
  ]
}` 
        },
        { role: "user", content: problemStatement }
      ]
    });

    let aiResult;
    try {
      // Remove any potential markdown wrapping that models sometimes add
      let cleanContent = response.choices[0].message.content.trim();
      if (cleanContent.startsWith('```json')) cleanContent = cleanContent.slice(7);
      if (cleanContent.endsWith('```')) cleanContent = cleanContent.slice(0, -3);
      
      aiResult = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse JSON from AI:", response.choices[0].message.content);
      return res.status(500).json({ error: "AI returned malformed data. Try again." });
    }

    const projectName = aiResult.projectName || "Untitled Project";
    const pitchContent = JSON.stringify(aiResult.pages); // Store the array of pages as a string
    // ---------------------------

    const newPitch = await prisma.pitch.create({
      data: {
        problemStatement,
        projectName,
        pitchContent,
      }
    });
    
    res.status(201).json(newPitch);
  } catch (error) {
    console.error("Error creating pitch:", error);
    res.status(500).json({ error: "Failed to generate pitch" });
  }
});

// 3. POST to upvote a specific pitch
app.post('/api/pitches/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPitch = await prisma.pitch.update({
      where: { id: parseInt(id) },
      data: { upvotes: { increment: 1 } }
    });
    res.json(updatedPitch);
  } catch (error) {
    console.error("Error upvoting pitch:", error);
    res.status(500).json({ error: "Failed to upvote pitch" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Hackathon API Server running on http://localhost:${PORT}`);
});
