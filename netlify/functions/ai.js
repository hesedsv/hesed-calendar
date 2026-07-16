exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const BRAND = `Hesed: marca centroamericana moda alternativa artesanal. Botas(combate,altas,mary janes,creepers,sneakers,tabys,plataformas,tacones), accesorios, camisetas. 100% vegano. Web: hesedstore.com con programa de lealtad(100pts bienvenida, puntos por referidos). Mercados: El Salvador, Costa Rica, Guatemala. Estilos: goth,punk,grunge,dark academia,anime,Tim Burton. Público: 21-35 años, aman anime,cosplay,rock,insectos,Tim Burton. Tono: Gen Z latino, casual, oscuro-poético, sin referencias satánicas. Emojis: 🖤🦋🕷️🌙✨🦇🌹🔮💀🥀⛓️. CTAs: visitar hesedstore.com, etiquetar amigos, comentar, compartir.`;

  try {
    const { action, payload } = JSON.parse(event.body);
    let prompt = "";

    if (action === "ideas") {
      prompt = `${BRAND}\n\nGenera 6 ideas variadas para Instagram de Hesed ${payload.country}. Incluye: posts a hesedstore.com, reels de proceso artesanal, carruseles de aesthetics, memes alternativos, programa de lealtad, reseñas. Solo JSON sin backticks:\n[{"title":"Título","type":"post|historia|reel|carrusel","caption":"Caption con emojis oscuros y CTA","angle":"Objetivo"}]`;
    } else if (action === "copy") {
      prompt = `${BRAND}\n\nCopy Instagram para Hesed. Tipo:${payload.type} Tema:${payload.topic} Tono:${payload.tone}. Gen Z latino, emojis oscuros 🖤🕷️🌙, sin satánico, CTA al final(hesedstore.com o etiquetar), máx 80 palabras. Solo el copy.`;
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 700,
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
