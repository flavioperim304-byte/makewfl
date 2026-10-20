exports.handler = async (event, context) => {
  // Apenas aceita requisições POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/fhwrijdv05hqfrjuv0muthxig4r8nq8d';

  try {
    const payload = JSON.parse(event.body);

    // Envia o JSON estruturado do Netlify para o Make
    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await makeResponse.text();

    if (!makeResponse.ok) {
      return {
        statusCode: makeResponse.status,
        body: JSON.stringify({ error: `Erro no Make: ${responseText}` })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Enviado com sucesso!', details: responseText })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao comunicar com o Make: ' + error.message })
    };
  }
};