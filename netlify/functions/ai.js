exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const BRAND = `Hesed: marca de moda alternativa artesanal de Centroamérica. Productos: botas de combate, botas altas, mary janes, creepers, sneakers, tabys, plataformas, tacones, accesorios, camisetas. Todo hecho a mano, 100% vegano. Web: hesedstore.com (programa de lealtad: 100pts al registrarse, puntos por referir amigos). Países: El Salvador, Costa Rica, Guatemala. Estilos: goth, punk, grunge, anime, Tim Burton. Público: Gen Z y millennials latinos 21-35 años que aman anime, cosplay, rock, insectos, Tim Burton.`;

  const TONO = `Tono: Gen Z latino relajado y auténtico. Natural, como habla un amigo cool. Nada dramático ni rebuscado. Sin "pactos con la noche" ni poesía extrema. Emojis oscuros pero naturales: 🖤🦋🕷️🌙✨🦇🌹🔮💀🥀⛓️. Sin referencias satánicas. CTAs claros: visitar hesedstore.com, etiquetar amigos, comentar.`;

  try {
    const { action, payload } = JSON.parse(event.body);

    if (action === "ideas") {
      const prompt = `${BRAND} ${TONO}

Genera 3 ideas de contenido para Instagram de Hesed ${payload.country}. 

IMPORTANTE: Cada idea es un BRIEF creativo, no copy. Describe QUÉ hacer, no el texto del post.

JSON sin backticks:
[{"title":"Título descriptivo de la idea","type":"post|historia|reel|carrusel","caption":"Brief: qué mostrar visualmente, qué decir, cómo debe verse, qué acción buscar del usuario","angle":"Por qué funciona para Hesed"}]`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body: JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:500,messages:[{role:"user",content:prompt}]}),
      });
      const data = await response.json();
      const result = data.content?.map(b=>b.text||"").join("")||"";
      return { statusCode: 200, headers, body: JSON.stringify({ result }) };

    } else if (action === "copy") {
      const prompt = `${BRAND} ${TONO}

Copy para Instagram. Tipo: ${payload.type}. Tema: ${payload.topic}. Tono pedido: ${payload.tone}.

Escríbelo como lo haría una chica cool de 25 años que ama la moda alternativa. Casual, directo, con personalidad. Máx 80 palabras. CTA al final. Solo el copy.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {"Content-Type":"application/json","x-api-key":process.env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},
        body: JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:300,messages:[{role:"user",content:prompt}]}),
      });
      const data = await response.json();
      const result = data.content?.map(b=>b.text||"").join("")||"";
      return { statusCode: 200, headers, body: JSON.stringify({ result }) };

    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid action" }) };
    }

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
