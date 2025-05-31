async function geocodeOrigins() {
  const response = await fetch("records.json");
  const records = await response.json();

  const uniqueOrigins = [...new Set(records.map(r => r.artist_origin || "Unknown"))];

  const originToCoords = {};

  for (const origin of uniqueOrigins) {
    if (origin === "Unknown") continue;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(origin)}&format=json&limit=1`;
    console.log("Fetching:", origin);

    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'vinyl-dashboard' } });
      const data = await res.json();

      if (data.length > 0) {
        originToCoords[origin] = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon)
        };
      } else {
        console.warn("No result for", origin);
      }

      // Throttle to avoid blocking
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error("Error fetching", origin, err);
    }
  }

  // Add lat/lon to matching records
  const updatedRecords = records.map(r => {
    const coords = originToCoords[r.artist_origin];
    return coords ? { ...r, ...coords } : r;
  });

  console.log("✅ DONE. Copy this:", JSON.stringify(updatedRecords, null, 2));
}
geocodeOrigins();
