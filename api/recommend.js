export default async function handler(req, res) {

  /* =========================
               CORS
   =========================*/

  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://zoeytanjh.github.io"
  );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type"
  );


  /* =========================
     HANDLE CORS PREFLIGHT
   =========================*/

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }


  /* =========================
       ONLY ALLOW POST
   =========================*/

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }


  try {

    /* =========================
     GET REQUEST DATA
     =========================*/

    const {
      trail,
      experience,
      distancePreference,
      weather
    } = req.body;


    /* =========================
     BUILD AI PROMPT
     =========================*/

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

Mention:
1. Why the trail matches the user's experience level.
2. Whether the distance matches their preference.
3. Whether the current weather is suitable.

Be natural and helpful.
`;


    /* =========================
         CALL OPENAI API
    =========================*/

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
            `Bearer ${process.env.OPENAI_API_KEY}`
        },

        body: JSON.stringify({

          model: "gpt-5.6-luna",

          input: prompt,

          max_output_tokens: 150

        })
      }
    );


    /* =========================
         HANDLE OPENAI ERROR
     =========================*/

    if (!response.ok) {

      const error =
        await response.text();

      console.error(
        "OpenAI API Error:",
        error
      );


      return res.status(500).json({

        error:
          "OpenAI API request failed"

      });

    }


    /* =========================
        GET OPENAI RESPONSE
       =========================*/

    const data =
      await response.json();


    /*=========================
       RETURN AI RECOMMENDATION
       =========================*/

    return res.status(200).json({

      recommendation:
        data.output_text

    });


  } catch (error) {

    console.error(
      "Server Error:",
      error
    );


    return res.status(500).json({

      error:
        "Server error"

    });

  }

}
