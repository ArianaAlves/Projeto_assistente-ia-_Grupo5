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
});