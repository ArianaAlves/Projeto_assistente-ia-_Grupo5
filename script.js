document.getElementById('btnPerguntar').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKey').value.trim();
  const pergunta = document.getElementById('pergunta').value.trim();
  const respostaTexto = document.getElementById('respostaTexto');
  const respostaContainer = document.getElementById('respostaContainer');

  if (!apiKey || !pergunta) {
    alert('⚠️ Preencha todos os campos.');
    return;
  }

  respostaTexto.textContent = "⌛ Processando...";
  respostaContainer.classList.remove("oculto");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: pergunta }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const resposta = data.choices[0]?.message?.content || "❌ Sem resposta da IA.";
    respostaTexto.textContent = resposta;
  } catch (erro) {
    respostaTexto.textContent = `Erro: ${erro.message}`;
  }
});
