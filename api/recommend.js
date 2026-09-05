/* =========================
   TrailMind Recommendation API
========================= */

export default async function handler(
  req,
  res
) {

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
     OPTIONS
  ========================= */

  if (
    req.method === "OPTIONS"
  ) {

    return res
      .status(200)
      .end();

  }


  /* =========================
     POST ONLY
  ========================= */

  if (
    req.method !== "POST"
  ) {

    return res
      .status(405)
      .json({

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


    if (
      !trail
    ) {

      return res
        .status(400)
        .json({

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
       EXPERIENCE EXPLANATION
    ========================= */

    let experienceText =
      "";


    if (
      experience ===
      "Beginner"
    ) {

      if (
        trailDifficulty ===
        "Easy"
      ) {

        experienceText =
          "The easy difficulty is a strong match for a beginner.";

      }

      else if (
        trailDifficulty ===
        "Moderate"
      ) {

        experienceText =
          "The moderate difficulty provides some challenge for a beginner, so pacing and preparation are important.";

      }

      else {

        experienceText =
          "The hard difficulty may be demanding for a beginner and requires additional preparation.";

      }

    }


    else if (
      experience ===
      "Intermediate"
    ) {

      if (
        trailDifficulty ===
        "Moderate"
      ) {

        experienceText =
          "The moderate difficulty is a strong match for an intermediate hiker.";

      }

      else if (
        trailDifficulty ===
        "Easy"
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
      experience ===
      "Advanced"
    ) {

      if (
        trailDifficulty ===
        "Hard"
      ) {

        experienceText =
          "The hard difficulty is a strong match for an advanced hiker.";

      }

      else if (
        trailDifficulty ===
        "Moderate"
      ) {

        experienceText =
          "The moderate difficulty provides a manageable challenge for an advanced hiker.";

      }

      else {

        experienceText =
          "The easy difficulty makes this a relatively accessible outing for an advanced hiker.";

      }

    }


    else {

      experienceText =
        "The trail was selected based on your available preferences.";

    }


    /* =========================
       DISTANCE EXPLANATION
    ========================= */

    let distanceText =
      "";


    if (
      distancePreference ===
      "Short (under 5 miles)"
    ) {

      if (
        trailDistance < 5
      ) {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the distance fits your preference for a shorter outing.`;

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

      if (
        trailDistance >= 5 &&
        trailDistance <= 10
      ) {

        distanceText =
          `At ${trailDistance.toFixed(1)} miles, the distance fits your preferred medium-length outing.`;

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

      distanceText =
        `The trail distance is approximately ${trailDistance.toFixed(1)} miles.`;

    }


    /* =========================
       WEATHER EXPLANATION
    ========================= */

    let weatherText =
      "Current conditions appear reasonable for outdoor activity, but conditions can change quickly.";


    if (
      lowerWeather.includes(
        "thunderstorm"
      )
    ) {

      weatherText =
        "Thunderstorm conditions may make outdoor activity unsafe, so current conditions should be checked before starting.";

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
        "snow"
      )
    ) {

      weatherText =
        "Snow may affect trail safety and accessibility, so current conditions should be checked before starting.";

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
       SOURCE EXPLANATION
    ========================= */

    let sourceText =
      "";


    if (
      trail.isRelation
    ) {

      sourceText =
        "The route is based on an OpenStreetMap route relation and its mapped trail segments.";

    }

    else if (
      trail.source ===
      "OpenStreetMap"
    ) {

      sourceText =
        "The trail information is based on a named OpenStreetMap trail segment.";

    }

    else {

      sourceText =
        "Trail data was not available from OpenStreetMap, so a fallback result was used.";

    }


    /* =========================
       FINAL RECOMMENDATION
    ========================= */

    const recommendation =
      `${experienceText} ${distanceText} ${weatherText} ${sourceText}`;


    /* =========================
       RESPONSE
    ========================= */

    return res
      .status(200)
      .json({

        recommendation

      });

  }


  catch (
    error
  ) {

    console.error(
      "Recommendation Error:",
      error
    );


    return res
      .status(500)
      .json({

        error:
          "Recommendation failed"

      });

  }

}
