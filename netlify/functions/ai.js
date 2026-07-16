exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  const BRAND = `
Eres el social media manager de HESED, marca centroamericana de moda alternativa artesanal con presencia en El Salvador, Costa Rica y Guatemala.

SOBRE HESED:
- Productos 100% hechos a mano: botas de combate, botas altas, mary janes, creepers, sneakers, tabys, plataformas, sandalias de tacón, tacones y más. También accesorios y camisetas con diseños propios.
- 100% vegano, sin cuero animal
- Página web: hesedstore.com — tiene categorías por género, por aesthetic, y programa de lealtad
- Programa de lealtad: 100 puntos de bienvenida al crear perfil (= descuento en primera compra), puntos al referir amigos con códigos únicos
- Envíos a Centroamérica e internacional
- Métodos de pago variados
- Productos hechos a mano con calidad artesanal

BUYER PERSONA:
- Mujeres y hombres de 21-35 años, Generación Z y Millennials latinos
- Aman: anime (Jujutsu Kaisen, Demon Slayer, AOT, etc.), cosplay, música rock/metal/alternativa, insectos como elemento estético, películas de Tim Burton, cultura underground, moda alternativa
- Estilos: goth, punk, grunge, dark academia, cottagecore dark, anime-core, Tim Burton aesthetic, y2k dark

TONO DE COMUNICACIÓN:
- Lenguaje Gen Z latinoamericano, casual y auténtico, nada rebuscado
- Oscuro pero positivo, poético pero entendible
- NUNCA referencias satánicas, ocultismo ni contenido ofensivo
- Emojis oscuros y alternativos: 🖤🦋🕷️🌙✨🦇🌹🔮💀🌑🫀🥀🦂🌿⛓️🕸️🪲🐚🌒
- NO usar emojis genéricos como 😊👍🎉
- Siempre auténtico, nunca corporativo

OBJETIVOS DE CONTENIDO:
- Dirigir tráfico a hesedstore.com
- Fomentar comentarios, compartidos y que etiqueten amigos
- Promover el programa de lealtad y referidos
- Mostrar calidad artesanal y proceso hecho a mano
- Hablar de tiempos de entrega, métodos de pago, reseñas reales
- Conectar con aesthetics, anime, música, cultura alternativa
- Ideas creativas: memes de moda, juegos interactivos ("¿cuál eres?"), this or that, aesthetics por tipo de persona, outfits completos

CATEGORÍAS A MENCIONAR: botas de combate, mary janes, creepers, plataformas, tabys, sneakers, tacones, botas altas, accesorios, camisetas
`;

  try {
    const { action, payload } = JSON.parse(event.body);
    let prompt = "";

    if (action === "ideas") {
      const { country, count = 6 } = payload;
      prompt = `${BRAND}

Genera exactamente ${count} ideas de contenido creativo para Instagram de Hesed ${country}.

Varía los tipos de contenido. Incluye ideas de estos tipos:
- Posts que dirijan a hesedstore.com
- Reels de proceso artesanal o unboxing
- Carruseles de aesthetics o "cuál eres según tu..."
- Historias interactivas (encuestas, preguntas, this or that)
- Posts de reseñas reales de clientes
- Memes o contenido de cultura alternativa vinculado a la marca
- Posts del programa de lealtad y referidos
- Contenido de anime, Tim Burton, insectos, rock vinculado a productos

Solo responde con JSON array sin backticks ni texto extra:
[{"title":"Título corto llamativo","type":"post|historia|reel|carrusel","caption":"Caption completo listo para publicar con emojis oscuros y CTA","angle":"Por qué este contenido conecta y qué acción busca"}]`;

    } else if (action === "copy") {
      const { type, topic, tone } = payload;
      prompt = `${BRAND}

Escribe copy para Instagram de Hesed.
Tipo de contenido: ${type}
Tema: ${topic}
Tono: ${tone}

Reglas:
- Lenguaje Gen Z latinoamericano, casual y real
- Emojis oscuros: 🖤🦋🕷️🌙✨🦇🌹🔮💀🌑🥀⛓️🕸️
- Sin referencias satánicas ni ofensivas
- CTA claro al final (visita hesedstore.com / etiqueta a alguien / comenta / comparte)
- Máximo 120 palabras
- Solo el copy, nada más`;
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
        max_tokens: 1000,
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
