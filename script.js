// Define os elementos usados
const elem = {
  key: document.getElementById('apiKey'),
  input: document.getElementById('pergunta'),
  output: document.getElementById('respostaTexto'),
  btn: document.getElementById('btnPergunta'),
}

const btn = document.getElementById('btnPergunta');

// Função para lidar com a pergunta e resposta da IA
async function AIAssist(apiKey, question) {
  // Fetch para a API
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: document.getElementById('modelo').value,
      messages: [{ role: 'user', content: question }],
      temperature: 0.7
    })
  });

  const model = document.getElementById('modelo').value;

  if (!res.ok) throw new Error(`${res.status} - ${await res.text()}`);
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '(sem conteúdo)';
}

// Adiciona o evento de clique ao botão
elem.btn.addEventListener('click', async () => {
  const apiKey = elem.key?.value?.trim() || '';
  const question = elem.input?.value?.trim() || '';

  // Mostra alerta se os campos não estiverem preenchidos
  if (!apiKey || !question) {
    alert('⚠️ Preencha todos os campos.');
    return;
  }

  // Responde ao usuário
  try {
    const answer = await AIAssist(apiKey, question);
    elem.output.textContent = answer;
    document.getElementById('respostaContainer')?.classList.remove('oculto');
  } catch (error) {
    elem.output.textContent = `Erro: ${error.message}`;
  }
});