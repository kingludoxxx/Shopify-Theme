document.addEventListener("DOMContentLoaded", function () {

    const allowedPaths = ["/pages/list-v1", "/products/pdp-v1"];
        if (!allowedPaths.includes(window.location.pathname)) {
        return;
        }

  // If user already has a saved preference, DO NOTHING
  if (localStorage.getItem("preferred_lang")) {
    return;
  }

  // If Shopify already set a non-English language, also DO NOTHING
  const currentLang = document.documentElement.lang || "en";
  if (currentLang !== "en") {
    localStorage.setItem("preferred_lang", currentLang);
    return;
  }

  // Detect country by IP
  fetch("https://ipapi.co/json/")
    .then(res => res.json())
    .then(data => {
      const country = data.country_code; // e.g. IT, FR, DE, US

      const langMap = {
        "IT": "it",
        "FR": "fr",
        "DE": "de",
        "ES": "es",
        "PT": "pt",
        "NL": "nl"
      };

      const detectedLang = langMap[country] || "en";

      // Only switch if different from current
      if (detectedLang !== currentLang) {
        document.cookie = `localization=${detectedLang}; path=/`;
        localStorage.setItem("preferred_lang", detectedLang);

        // Reload SAME URL (no extension)
        window.location.reload();
      }
    })
    .catch(err => console.log("IP detection failed:", err));
});
