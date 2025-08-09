// Importa o cliente da biblioteca do Google Generative AI
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define os elementos da interface do usuário
const elem = {
  key: document.getElementById('apiKey'),
  input: document.getElementById('pergunta'),
  output: document.getElementById('respostaTexto'),
  btn: document.getElementById('btnPergunta'),
  modelo: document.getElementById('modelo'),
  respostaContainer: document.getElementById('respostaContainer'),
};

/**
 * Função para lidar com a pergunta e obter a resposta da IA do Gemini.
 * @param {string} apiKey - A chave de API do usuário.
 * @param {string} question - A pergunta a ser enviada ao modelo.
 * @returns {Promise<string>} A resposta do modelo.
 */
async function AIAssist(apiKey, question) {
  // Inicializa o cliente do Google Generative AI com a chave de API fornecida
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Seleciona o modelo de IA com base na escolha do usuário
    const model = genAI.getGenerativeModel({ model: elem.modelo.value });

    // Envia a pergunta (prompt) para o modelo
    const result = await model.generateContent(question);
    const response = await result.response;
    
    // Retorna o texto da resposta
    return response.text();
  } catch (error) {
    // Trata erros comuns, como chave de API inválida
    if (error.message?.includes('API key not valid')) {
      throw new Error("❌ Chave de API inválida ou incorreta. Verifique se você a copiou corretamente.");
    }
    // Lança outros erros
    throw error;
  }
}

// Adiciona o evento de clique ao botão de pergunta
elem.btn.addEventListener('click', async () => {
  const apiKey = elem.key?.value?.trim() || '';
  const question = elem.input?.value?.trim() || '';

  if (!apiKey || !question) {
    alert('⚠️ Por favor, preencha sua API Key e a pergunta.');
    return;
  }

  // Desabilita o botão e mostra um feedback visual de carregamento
  elem.btn.disabled = true;
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
    elem.btn.disabled = false;
  }

/* ===== helpers ===== */
function showError(msg) {
  const el = document.getElementById('form-error');
  el.textContent = msg;
  el.style.display = 'block';
}

function clearError() {
  const el = document.getElementById('form-error');
  el.textContent = '';
  el.style.display = 'none';
}

/* ===== função que realiza a requisição ===== */
async function fetchAnswer(apiKey, question) {
  const res = await fetch('/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey, question })
  });
  if (!res.ok) throw new Error(`Servidor retornou ${res.status}`);
  const data = await res.json();
  return data.answer;
  */
}
/* ===== handler do formulário ===== */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ask-form');
  const askBtn = document.getElementById('ask-btn');
  const responseArea = document.getElementById('response-area');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiKey = document.getElementById('apiKey').value.trim();
    const question = document.getElementById('question').value.trim();

    // validação básica
    if (!apiKey) {
      showError('A API Key é obrigatória. Cole sua chave do Gemini.');
      document.getElementById('apiKey').focus();
      return;
    }
    if (!question) {
      showError('Digite uma pergunta antes de enviar.');
      document.getElementById('question').focus();
      return;
    }

    clearError();

    // desabilita botão e altera texto enquanto carrega
    askBtn.disabled = true;
    const originalText = askBtn.textContent;
    askBtn.textContent = 'Enviando...';

    // esconde resposta anterior
    responseArea.hidden = true;
    responseArea.textContent = '';

    try {
      const answer = await fetchAnswer(apiKey, question);

      // exibe resposta (formatação simples)
      responseArea.innerHTML = `
        <h3>Sua pergunta</h3>
        <p class="user-question">${escapeHtml(question)}</p>
        <h3>Resposta da IA</h3>
        <p class="ai-answer">${escapeHtml(answer)}</p>
      `;
      responseArea.hidden = false;
      // rolar automaticamente até a resposta
      responseArea.scrollIntoView({ behavior: 'smooth' });

    } catch (err) {
      console.error(err);
      showError('Erro ao obter resposta: ' + err.message);
    } finally {
      askBtn.disabled = false;
      askBtn.textContent = originalText;
    }
  });

  // util: permitir Ctrl+Enter para enviar (opcional)
  const questionEl = document.getElementById('question');
  questionEl.addEventListener('keydown', (ev) => {
    if ((ev.ctrlKey || ev.metaKey) && ev.key === 'Enter') {
      form.requestSubmit();
    }
  });
});

/* função para escapar HTML (segurança) */
function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

});