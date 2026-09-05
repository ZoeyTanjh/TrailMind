/* =========================
   TrailMind Recommendation API
========================= */

export default async function handler(req, res) {

  /* =========================
     CORS
  ========================= */

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

  res.setHeader(
    "Access-Control-Max-Age",
    "86400"
  );


  /* =========================
     CORS PREFLIGHT
  ========================= */

  if (req.method === "OPTIONS") {

    return res.status(200).end();

  }


  /* =========================
     ONLY ALLOW POST
  ========================= */

  if (req.method !== "POST") {

    return res.status(405).json({

      error:
        "Method not allowed"

    });

  }


  try {

    /* =========================
       REQUEST DATA
    ========================= */

    const {
      trail,
      experience,
      distancePreference,
      weather
    } = req.body;


    if (!trail) {

      return res.status(400).json({

        error:
          "Trail data is required"

      });

    }


    /* =========================
       USE EXACT FRONTEND DATA
    ========================= */

    const trailDistance =
      Number(
        trail.distance || 0
      );


    const trailDifficulty =
      trail.difficulty ||
      "Unknown";


    const currentWeather =
      String(
        weather || ""
      );


    const lowerWeather =
      currentWeather.toLowerCase();


    /* =========================
       EXPERIENCE SCORE
    ========================= */

    let experienceScore = 0;

    let experienceText = "";


    if (
      experience === "Beginner"
    ) {

      if (
        trailDifficulty === "Easy"
      ) {

        experienceScore = 45;

        experienceText =
          "The easy difficulty is a strong match for a beginner.";

      }

      else if (
        trailDifficulty === "Moderate"
      ) {

        experienceScore = 30;

        experienceText =
          "The moderate difficulty offers some challenge for a beginner, so pacing and preparation are important.";

      }

      else {

        experienceScore = 15;

        experienceText =
          "The trail may be demanding for a beginner and requires extra preparation.";

      }

    }


    else if (
      experience === "Intermediate"
    ) {

      if (
        trailDifficulty === "Moderate"
      ) {

        experienceScore = 45;

        experienceText =
          "The moderate difficulty is a strong match for an intermediate hiker.";

      }

      else if (
        trailDifficulty === "Easy"
      ) {

        experienceScore = 35;

        experienceText =
          "The easy difficulty makes this a relatively accessible option for an intermediate hiker.";

      }

      else {

        experienceScore = 40;

        experienceText =
          "The hard difficulty provides a more demanding option for an intermediate hiker.";

      }

    }


    else if (
      experience === "Advanced"
    ) {

      if (
        trailDifficulty === "Hard"
      ) {

        experienceScore = 45;

        experienceText =
          "The hard difficulty is a strong match for an advanced hiker.";

      }

      else if (
        trailDifficulty === "Moderate"
      ) {

        experienceScore = 35;

        experienceText =
          "The moderate difficulty provides a manageable option for an advanced hiker.";

      }

      else {

        experienceScore = 25;

        experienceText =
          "The easy difficulty makes this a relatively accessible outing for an advanced hiker.";

      }

    }


    else {

      experienceScore = 30;

      experienceText =
        "The trail was selected based on your available preferences.";

    }


    /* =========================
       DISTANCE SCORE
    ========================= */

    let distanceScore = 0;

    let distanceText = "";


    if (
      distancePreference ===
      "Short (under 5 miles)"
    ) {

      const targetDistance = 3;

      const difference =
        Math.abs(
          targetDistance -
          trailDistance
        );


      distanceScore =
        Math.max(
          5,
          40 -
          difference * 8
        );


      if (
        trailDistance < 5
      ) {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the distance matches your preference for a shorter outing.`;

      }

      else {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the trail is longer than your preferred short outing.`;

      }

    }


    else if (
      distancePreference ===
      "Medium (5-10 miles)"
    ) {

      const targetDistance = 7.5;

      const difference =
        Math.abs(
          targetDistance -
          trailDistance
        );


      distanceScore =
        Math.max(
          5,
          40 -
          difference * 6
        );


      if (
        trailDistance >= 5 &&
        trailDistance <= 10
      ) {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the distance fits your preferred medium-length hike.`;

      }

      else {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the trail is outside your preferred 5-10 mile range.`;

      }

    }


    else if (
      distancePreference ===
      "Long (10+ miles)"
    ) {

      const targetDistance = 12;

      const difference =
        Math.abs(
          targetDistance -
          trailDistance
        );


      distanceScore =
        Math.max(
          5,
          40 -
          difference * 4
        );


      if (
        trailDistance >= 10
      ) {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the trail fits your preference for a longer adventure.`;

      }

      else {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the trail is shorter than your preferred long-distance outing.`;

      }

    }


    else {

      distanceScore = 25;

      distanceText =
        `The trail distance is approximately ${trailDistance.toFixed(1)} miles.`;

    }


    /* =========================
       WEATHER SCORE
    ========================= */

    let weatherScore = 10;

    let weatherText =
      "Current weather conditions appear reasonable for outdoor activity.";


    if (
      lowerWeather.includes(
        "thunderstorm"
      ) ||
      lowerWeather.includes(
        "storm"
      )
    ) {

      weatherScore = 0;

      weatherText =
        "Thunderstorm or storm conditions may make the trail unsuitable, so current conditions should be checked before starting.";

    }


    else if (
      lowerWeather.includes(
        "snow"
      )
    ) {

      weatherScore = 3;

      weatherText =
        "Snow conditions may affect trail safety and accessibility, so conditions should be checked before starting.";

    }


    else if (
      lowerWeather.includes(
        "rain"
      )
    ) {

      weatherScore = 5;

      weatherText =
        "Rain may make the trail wet or slippery, so current trail conditions should be considered.";

    }


    else if (
      lowerWeather.includes(
        "wind"
      )
    ) {

      weatherScore = 7;

      weatherText =
        "Wind conditions should be considered, especially on exposed sections of the trail.";

    }


    /* =========================
       DATA SOURCE
    ========================= */

    let sourceScore = 5;

    let sourceText = "";


    if (
      trail.source ===
      "OpenStreetMap"
    ) {

      sourceText =
        "The trail information is based on real OpenStreetMap data.";

    }


    /* =========================
       FINAL SCORE
    ========================= */

    let matchScore =
      experienceScore +
      distanceScore +
      weatherScore +
      sourceScore;


    matchScore =
      Math.round(
        matchScore
      );


    matchScore =
      Math.min(
        98,
        Math.max(
          55,
          matchScore
        )
      );


    /* =========================
       FINAL RECOMMENDATION
    ========================= */

    const recommendation =
      `${experienceText} ${distanceText} ${weatherText} ${sourceText}`;


    /* =========================
       RESPONSE
    ========================= */

    return res.status(200).json({

      recommendation,

      matchScore

    });

  }


  catch (error) {

    console.error(
      "Recommendation Error:",
      error
    );


    return res.status(500).json({

      error:
        "Recommendation failed"

    });

  }

}
