// Importa o cliente da biblioteca do Google Generative AI
// import { GoogleGenerativeAI } from "@google/generative-ai";

// Define os elementos da interface do usuário
const elem = {
  key: document.getElementById('apiKey'),
  input: document.getElementById('pergunta'),
  output: document.getElementById('respostaTexto'),
  // CORREÇÃO AQUI: O ID do botão no HTML é 'btnPesquisar', não 'btnPergunta'
  btnPesquisar: document.getElementById('btnPesquisar'), 
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
  try {
    const model = elem.modelo.value;
    const url = model + apiKey;
    const body = { contents: [{ parts: [{ text: question }] }] };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      }
      else if (data.error) {
        throw new Error(data.error.message);
      } else {
        throw new Error("Resposta inesperada da API.");
      }
    }
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

// CORREÇÃO AQUI: Adiciona o evento de clique ao botão correto
elem.btnPesquisar.addEventListener('click', async () => {
  const apiKey = elem.key?.value?.trim() || '';
  const question = elem.input?.value?.trim() || '';

  elem.respostaContainer.classList.remove('fade-out');
  elem.respostaContainer.classList.remove('fade-in'); 
  void elem.respostaContainer.offsetWidth; 
  elem.respostaContainer.classList.add('fade-in');

  localStorage.setItem('apiKey', apiKey);

  if (!apiKey || !question) {
    alert('⚠️ Por favor, preencha sua API Key e a pergunta.');
    return;
  }

  elem.perguntaFeita.textContent = `Você perguntou: ${question}`;

  // CORREÇÃO AQUI: Desabilita o botão correto
  elem.btnPesquisar.disabled = true;
  elem.output.textContent = "⏳ Pensando...";
  elem.respostaContainer?.classList.remove('oculto');

  try {
    const answer = await AIAssist(apiKey, question);
    elem.output.textContent = answer;
  } catch (error) {
    elem.output.textContent = `Erro: ${error.message}`;
  } finally {
    // CORREÇÃO AQUI: Reabilita o botão correto
    elem.btnPesquisar.disabled = false;
  }
});

// Adiciona o evento de clique ao botão de limpar
elem.btnLimpar.addEventListener('click', () => {
  if (confirm("Você tem certeza que deseja limpar?")) {
    elem.respostaContainer.classList.remove('fade-in');
    elem.respostaContainer.classList.add('fade-out');
    setTimeout(() => {
      elem.input.value = '';
      elem.perguntaFeita.textContent = '';
      elem.output.textContent = '';
      elem.respostaContainer?.classList.add('oculto');
      elem.respostaContainer.classList.remove('fade-out');
      elem.contador.textContent = '0 caracteres'; // Adicionado para resetar o contador
    }, 600)
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

// Carrega a API Key salva ao carregar a página
window.addEventListener('load', () => {
    const savedApiKey = localStorage.getItem('apiKey');
    if (savedApiKey) {
        elem.key.value = savedApiKey;
    }
});