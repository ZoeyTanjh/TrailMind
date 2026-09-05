export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "https://zoeytanjh.github.io");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { trail, experience, distancePreference, weather } = req.body;

    const prompt = `
You are an outdoor trip planning assistant.

Recommend the following trail based on the user's preferences and current conditions.

User experience: ${experience}
Preferred distance: ${distancePreference}

Trail:
Name: ${trail.name}
Distance: ${trail.distance} miles
Difficulty: ${trail.difficulty}

Current weather:
${weather}

Give a concise recommendation in 2-3 sentences.
Mention why the trail matches the user and whether the current weather is suitable.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-5.6-luna",
        input: prompt,
        max_output_tokens: 150,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(error);
      return res.status(500).json({
        error: "OpenAI API request failed",
      });
    }

    const data = await response.json();

    return res.status(200).json({
      recommendation: data.output_text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error",
    });
  }
}
