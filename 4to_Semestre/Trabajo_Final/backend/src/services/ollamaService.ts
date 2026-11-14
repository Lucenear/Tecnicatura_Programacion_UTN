export interface DiagnosticoIAResultado {
  diagnostico: string;
  consejo_seguridad: string | null;
  es_urgente: boolean;
  modelo: string;
}

export async function generarDiagnosticoIA(consulta: string): Promise<DiagnosticoIAResultado | null> {
  const habilitado = process.env.OLLAMA_ENABLED === 'true';
  if (!habilitado) {
    return null;
  }

  const url = process.env.OLLAMA_URL || 'http://172.17.0.1:11434';
  const modelo = process.env.OLLAMA_MODEL || 'llama3.2:3b';

  const timeoutMs = parseInt(process.env.OLLAMA_TIMEOUT_MS || '60000', 10);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const inicio = Date.now();

  try {
    console.log(`[Ollama] Consultando modelo ${modelo} para: "${consulta}" (timeout: ${timeoutMs}ms)...`);
    const prompt = `Sos el asistente inteligente de FixYa (plataforma para resolver consultas prácticas de oficios, hogar, tecnología y educación en Argentina). El usuario consulta: "${consulta}".

Generá una respuesta instructiva, completa y directamente aplicable.
Reglas obligatorias:
- El campo "diagnostico" DEBE contener una lista con pasos numerados (1., 2., 3., etc.) separados por saltos de línea.
- Explicá el método o procedimiento real paso a paso con claridad (entre 60 y 110 palabras en total).
- El campo "consejo_seguridad" solo lleva texto si hay peligro físico (electricidad, gas, herramientas cortantes). Si es una consulta educativa o sin riesgo, debe ser null.

Respondé ÚNICAMENTE este formato JSON:
{
  "diagnostico": "1. Primer paso explicativo.\\n2. Segundo paso explicativo.\\n3. Tercer paso explicativo.",
  "consejo_seguridad": "Advertencia si aplica o null",
  "es_urgente": false
}`;

    const res = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: modelo,
        prompt,
        format: 'json',
        stream: false,
        keep_alive: '30m',
        options: {
          temperature: 0.1,
          num_predict: 320
        }
      }),
      signal: controller.signal
    });

    if (!res.ok) {
      console.error(`[Ollama] Error en respuesta HTTP: ${res.status} ${res.statusText}`);
      return null;
    }

    const data: any = await res.json();
    if (!data || !data.response) {
      console.error(`[Ollama] Respuesta vacía de Ollama`);
      return null;
    }

    console.log(`[Ollama] Texto generado:\n${data.response}`);

    let parsed: any;
    try {
      parsed = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
    } catch (parseErr) {
      console.error(`[Ollama] Error al parsear JSON devuelto:`, parseErr);
      return null;
    }

    if (!parsed || !parsed.diagnostico) {
      console.error(`[Ollama] Respuesta no contiene diagnóstico válido:`, data.response);
      return null;
    }

    console.log(`[Ollama] Diagnóstico generado exitosamente en ${Date.now() - inicio}ms`);
    return {
      diagnostico: String(parsed.diagnostico).trim(),
      consejo_seguridad: parsed.consejo_seguridad ? String(parsed.consejo_seguridad).trim() : null,
      es_urgente: Boolean(parsed.es_urgente),
      modelo
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      console.error(`[Ollama] Timeout alcanzado tras ${timeoutMs}ms al generar diagnóstico.`);
    } else {
      console.error(`[Ollama] Excepción en servicio:`, err);
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
