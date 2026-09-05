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
      error: "Method not allowed"
    });
  }


  try {

    /* =========================
       GET REQUEST DATA
    ========================= */

    const {
      trail,
      experience,
      distancePreference,
      weather
    } = req.body;


    /* =========================
       EXPERIENCE ANALYSIS
    ========================= */

    let experienceText = "";

    if (experience === "beginner") {

      experienceText =
        "As a beginner, this trail offers a manageable option without being overly demanding.";

    } else if (experience === "intermediate") {

      experienceText =
        "For an intermediate hiker, this trail provides a good balance of challenge and accessibility.";

    } else if (experience === "advanced") {

      experienceText =
        "For an experienced hiker, this trail provides a good outdoor challenge.";

    } else {

      experienceText =
        "This trail can be a practical option based on your selected experience level.";

    }


    /* =========================
       DISTANCE ANALYSIS
    ========================= */

    let distanceText = "";

    if (distancePreference === "short") {

      if (trail.distance <= 5) {

        distanceText =
          "Its shorter distance also matches your preference for a quick outing.";

      } else {

        distanceText =
          "The trail is somewhat longer than your preferred short distance.";

      }

    } else if (distancePreference === "medium") {

      if (
        trail.distance > 5 &&
        trail.distance <= 10
      ) {

        distanceText =
          "Its distance fits well with your preference for a medium-length hike.";

      } else {

        distanceText =
          "Its distance is somewhat different from your preferred medium-length hike.";

      }

    } else if (distancePreference === "long") {

      if (trail.distance > 10) {

        distanceText =
          "Its longer distance makes it a strong match for a longer outdoor adventure.";

      } else {

        distanceText =
          "The trail is shorter than your preferred long-distance outing.";

      }

    } else {

      distanceText =
        "The trail distance provides a reasonable option for your preferences.";

    }


    /* =========================
       WEATHER ANALYSIS
    ========================= */

    let weatherText =
      "Current conditions appear reasonable for an outdoor activity.";

    const lowerWeather =
      String(weather).toLowerCase();


    if (
      lowerWeather.includes("rain") ||
      lowerWeather.includes("storm") ||
      lowerWeather.includes("snow")
    ) {

      weatherText =
        "Current weather conditions may make the trail less suitable, so check conditions carefully before heading out.";

    } else if (
      lowerWeather.includes("wind")
    ) {

      weatherText =
        "Wind conditions should be considered before starting the hike.";

    }


    /* =========================
       FINAL RECOMMENDATION
    ========================= */

    const recommendation =
      `${experienceText} ${distanceText} ${weatherText}`;


    /* =========================
       RETURN RESULT
    ========================= */

    return res.status(200).json({

      recommendation:
        recommendation

    });


  } catch (error) {

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
