import {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  BASE_URL,
} from "@/utils/constants";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code) {
    return Response.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return Response.json(
      { error: "Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET" },
      { status: 500 }
    );
  }

  try {
    // 1️⃣ On échange le code contre un token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/callback`, // doit matcher exactement celui donné à Google
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const error = await tokenRes.json();
      console.error("Failed to fetch token:", error);
      return Response.json(
        { error: "Failed to fetch token", details: error },
        { status: 500 }
      );
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return Response.json(
        { error: "No access token received" },
        { status: 500 }
      );
    }

    // 2️⃣ Avec le token, on va chercher les infos du user
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userRes.ok) {
      const error = await userRes.json();
      console.error("Failed to fetch user info:", error);
      return Response.json(
        { error: "Failed to fetch user info", details: error },
        { status: 500 }
      );
    }

    const userInfo = await userRes.json();

    console.log("✅ Google user info:", userInfo);

    // Tu peux soit les log, soit les renvoyer direct :
    return Response.json({
      success: true,
      user: userInfo,
      state, // Si jamais tu veux garder ton state pour matcher le flux
    });
  } catch (err) {
    console.error("Unexpected error in callback:", err);
    return Response.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
