// Importa o cliente da biblioteca do Google Generative AI
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Define os elementos da interface do usuário
const elem = {
  key: document.getElementById('apiKey'),
  input: document.getElementById('pergunta'),
  output: document.getElementById('respostaTexto'),
  btnQ: document.getElementById('btnPergunta'),
  btnLimpar: document.getElementById('btnLimpar'),
  btnCopiar: document.getElementById('btnCopiar'),
  perguntaFeita: document.getElementById('perguntaFeita'),
  modelo: document.getElementById('modelo'),
  respostaContainer: document.getElementById('respostaContainer'),
  contador: document.getElementById('contador')
};

// Adiciona um evento de input para atualizar o contador de caracteres
elem.input.addEventListener('input', () => {
  elem.contador.textContent = `${elem.input.value.length} caracteres`;
});

/**
 * Função para lidar com a pergunta e obter a resposta da IA do Gemini.
 * @param {string} apiKey - A chave de API do usuário.
 * @param {string} question - A pergunta a ser enviada ao modelo.
 * @returns {Promise<string>} A resposta do modelo.
 */
async function AIAssist(apiKey, question) {
  // Inicializa o cliente do Google Generative AI com a chave de API fornecida
  // const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Seleciona o modelo de IA com base na escolha do usuário
    const model = elem.modelo.value;

    // Seleciona o modelo de IA Gemini Pro Vision
    const url = model + apiKey;
    // Variável do prompt
    const body = { contents: [{ parts: [{ text: question }] }] };

    // Envia a pergunta (prompt) para o modelo
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      // Retorna o texto da resposta
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      // Se a resposta não contiver o texto esperado, lança um erro
      else if (data.error) {
        throw new Error(data.error.message);
      } else {
        throw new Error("Resposta inesperada da API.");
      }
    }
    // Trata erros comuns, como chave de API inválida
    catch (error) {
      if (error.message?.includes('API key not valid')) {
      throw new Error("❌ Chave de API inválida ou incorreta. Verifique se você a copiou corretamente.");
    }
      throw error;
    }
  } 
  catch (error) {
    throw error;
  }
}

// Adiciona o evento de clique ao botão de pergunta
elem.btnQ.addEventListener('click', async () => {
  const apiKey = elem.key?.value?.trim() || '';
  const question = elem.input?.value?.trim() || '';

  // Salva a API Key no localStorage
  localStorage.setItem('apiKey', apiKey);

  // Verifica se a API Key e a pergunta foram preenchidas
  if (!apiKey || !question) {
    alert('⚠️ Por favor, preencha sua API Key e a pergunta.');
    return;
  }

 // Exibe a pergunta do usuário na tela
  elem.perguntaFeita.textContent = `Você perguntou: ${question}`;


  // Desabilita o botão e mostra um feedback visual de carregamento
  elem.btnQ.disabled = true;
  elem.output.textContent = "⏳ Pensando...";
  elem.respostaContainer?.classList.remove('oculto');

  try {
    // Chama a função para obter a resposta da IA
    const answer = await AIAssist(apiKey, question);
    elem.output.textContent = answer;
  } catch (error) {
    // Exibe a mensagem de erro na tela
    elem.output.textContent = `Erro: ${error.message}`;
  } finally {
    // Reabilita o botão após a conclusão
    elem.btnQ.disabled = false;
  }
});

// Adiciona o evento de clique ao botão de limpar
elem.btnLimpar.addEventListener('click', () => {
  // Confirmar ação antes de limpar 
  if (confirm("Você tem certeza que deseja limpar?")) {
    elem.input.value = '';
    elem.perguntaFeita.textContent = '';
    elem.output.textContent = '';
    elem.respostaContainer?.classList.add('oculto');
  }
});

  // Adiciona o evento de clique ao botão de copiar
elem.btnCopiar.addEventListener('click', () => {
  const textToCopy = elem.output.textContent;
  navigator.clipboard.writeText(textToCopy).then(() => {
    alert('✅ Resposta copiada para a área de transferência!');
  }).catch(err => {
    console.error('Erro ao copiar o texto: ', err);
    alert('❌ Ocorreu um erro ao tentar copiar a resposta.');
  });
});