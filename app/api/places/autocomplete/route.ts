import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get("input");

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Google API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.status === "OK" && Array.isArray(data.predictions)) {
      return NextResponse.json({
        predictions: data.predictions.map((prediction: any) => ({
          place_id: prediction.place_id,
          description: prediction.description
        }))
      });
    } else if (data.status === "ZERO_RESULTS") {
      return NextResponse.json({ predictions: [] });
    } else {
      console.error("Google Places API error:", data.status, data.error_message);
      return NextResponse.json({ predictions: [] });
    }
  } catch (error) {
    console.error("Error fetching place predictions:", error);
    return NextResponse.json({ predictions: [] });
  }
}
