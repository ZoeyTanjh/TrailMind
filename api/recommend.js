/* =========================
   CORS
========================= */

export default async function handler(req, res) {

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
       EXPERIENCE
    ========================= */

    let experienceText = "";


    if (
      experience === "Beginner"
    ) {

      if (
        trailDifficulty === "Easy"
      ) {

        experienceText =
          "The easy difficulty is a good fit for a beginner.";

      }

      else if (
        trailDifficulty === "Moderate"
      ) {

        experienceText =
          "The moderate difficulty offers some challenge for a beginner, so pacing and preparation are important.";

      }

      else {

        experienceText =
          "The trail may be demanding for a beginner and should be approached with extra preparation.";

      }

    }


    else if (
      experience === "Intermediate"
    ) {

      if (
        trailDifficulty === "Moderate"
      ) {

        experienceText =
          "The moderate difficulty is a strong match for an intermediate hiker.";

      }

      else if (
        trailDifficulty === "Easy"
      ) {

        experienceText =
          "The easy difficulty makes this a relatively accessible option for an intermediate hiker.";

      }

      else {

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

        experienceText =
          "The hard difficulty provides a strong challenge for an advanced hiker.";

      }

      else {

        experienceText =
          "The trail is relatively accessible for an advanced hiker and may be suitable for a lighter outing.";

      }

    }


    else {

      experienceText =
        "The trail was selected based on your available preferences.";

    }


    /* =========================
       DISTANCE
    ========================= */

    let distanceText = "";


    if (
      distancePreference ===
      "Short (under 5 miles)"
    ) {

      if (
        trailDistance < 5
      ) {

        distanceText =
          `At ${trailDistance} miles, the distance matches your preference for a shorter outing.`;

      }

      else {

        distanceText =
          `At ${trailDistance} miles, the trail is longer than your preferred short outing.`;

      }

    }


    else if (
      distancePreference ===
      "Medium (5-10 miles)"
    ) {

      if (
        trailDistance >= 5 &&
        trailDistance <= 10
      ) {

        distanceText =
          `At ${trailDistance} miles, the distance fits your preferred medium-length hike.`;

      }

      else {

        distanceText =
          `At ${trailDistance} miles, the trail is outside your preferred 5-10 mile range.`;

      }

    }


    else if (
      distancePreference ===
      "Long (10+ miles)"
    ) {

      if (
        trailDistance > 10
      ) {

        distanceText =
          `At ${trailDistance} miles, the trail fits your preference for a longer adventure.`;

      }

      else {

        distanceText =
          `At ${trailDistance} miles, the trail is shorter than your preferred long-distance outing.`;

      }

    }


    else {

      distanceText =
        `The trail distance is approximately ${trailDistance} miles.`;

    }


    /* =========================
       WEATHER
    ========================= */

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

      weatherText =
        "Thunderstorm or storm conditions may make the trail unsuitable, so current conditions should be checked before starting.";

    }


    else if (
      lowerWeather.includes(
        "snow"
      )
    ) {

      weatherText =
        "Snow conditions may affect trail safety and accessibility, so conditions should be checked before starting.";

    }


    else if (
      lowerWeather.includes(
        "rain"
      )
    ) {

      weatherText =
        "Rain may make the trail wet or slippery, so current trail conditions should be considered.";

    }


    else if (
      lowerWeather.includes(
        "wind"
      )
    ) {

      weatherText =
        "Wind conditions should be considered, especially on exposed sections of the trail.";

    }


    /* =========================
       SOURCE
    ========================= */

    let sourceText = "";


    if (
      trail.source ===
      "OpenStreetMap"
    ) {

      sourceText =
        "The trail information is based on real OpenStreetMap data.";

    }


    /* =========================
       FINAL RECOMMENDATION
    ========================= */

    const recommendation =
      `${experienceText} ${distanceText} ${weatherText} ${sourceText}`;


    /* =========================
       RETURN
    ========================= */

    return res.status(200).json({

      recommendation:
        recommendation

    });

  }


  catch (error) {

    /* =========================
       ERROR HANDLING
    ========================= */

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
