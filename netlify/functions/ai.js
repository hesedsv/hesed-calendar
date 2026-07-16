exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const BRAND = `Hesed es una marca centroamericana de moda alternativa artesanal.
- Productos hechos a mano: botas, accesorios, camisetas con diseños propios
- Estilos: goth, punk, grunge, dark academia, anime-inspired, Tim Burton aesthetic
- 100% vegano (sin cuero animal)
- Página web con programa de lealtad
- Presencia en El Salvador, Costa Rica y Guatemala
- Buyer persona: mujeres y hombres 21-35 años que aman anime, cosplay, música rock/alternativa, insectos, películas de Tim Burton, cultura underground
- Tono: auténtico, oscuro-poético, juvenil, irreverente`;

  try {
    const { action, payload } = JSON.parse(event.body);
    let prompt = "";

    if (action === "ideas") {
      const { country, count = 6 } = payload;
      prompt = `${BRAND}\n\nGenera exactamente ${count} ideas de contenido para Instagram de Hesed ${country}. Inspírate en Tim Burton, anime popular, insectos como elemento estético, rock/metal, cosplay, veganismo en moda, proceso artesanal de botas.\n\nSolo JSON array sin backticks ni texto extra:\n[{"title":"Título corto","type":"post|historia|reel|carrusel","caption":"Caption completo con emojis","angle":"Por qué conecta con la audiencia"}]`;
    } else if (action === "copy") {
      const { type, topic, tone } = payload;
      prompt = `${BRAND}\n\nEscribe copy para Instagram de Hesed.\nTipo: ${type}\nTema: ${topic}\nTono: ${tone}\n\nCon emojis, CTA al final, máx 150 palabras. Solo el copy, sin explicaciones ni títulos.`;
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid action" }) };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const result = data.content?.map(b => b.text || "").join("") || "";
    return { statusCode: 200, headers, body: JSON.stringify({ result }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
