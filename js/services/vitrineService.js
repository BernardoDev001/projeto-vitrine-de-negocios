const STORAGE_KEY = 'garopaba_vitrine_servicos';
// Dados modelo semente para enriquecer a experiência inicial
export const DADOS_INICIAIS = [
    {
        id: '1',
        nome: 'Maré Alta Artesanatos & Cerâmicas',
        categoria: 'Artesanato',
        bairro: 'Centro Histórico',
        precoBase: 35.00,
        telefone: '48991234567',
        descricao: 'Peças artesanais e utilitárias modeladas à mão com argila local e conchas de Garopaba.'
    },
    {
        id: '2',
        nome: 'Garopaba Web & Design Studio',
        categoria: 'Tecnologia',
        bairro: 'Ferrugem',
        precoBase: 150.00,
        telefone: '48998765432',
        descricao: 'Criação de websites profissionais responsivos, cardápios digitais e suporte para comércio local.'
    },
    {
        id: '3',
        nome: 'Pescado Fresco do Zequinha',
        categoria: 'Alimentação',
        bairro: 'Canto das Canoas',
        precoBase: 42.00,
        telefone: '48984561234',
        descricao: 'Peixes frescos e frutos do mar da pesca artesanal diária entregues com higiene e pontualidade.'
    }
];
// Função dedicada para carregar os dados modelo no LocalStorage
export function carregarDadosIniciais() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DADOS_INICIAIS));
    return DADOS_INICIAIS;
}
// READ: Recupera os serviços ou carrega os dados modelo se vazio
export function obterServicos() {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (!dados) {
        return carregarDadosIniciais();
    }
    try {
        return JSON.parse(dados);
    } catch (e) {
        console.error('Erro ao processar dados da vitrine:', e);
        return [];
    }
}
export function salvarServico(novo) {
    const servicos = obterServicos();
    const completo = {
        id: Date.now().toString(),
        dataCadastro: new Date().toISOString(),
        ...novo
    };
    servicos.unshift(completo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
    return completo;
}
export function atualizarServico(id, dados) {
    const servicos = obterServicos();
    const idx = servicos.findIndex(s => s.id === id);
    if (idx !== -1) {
        servicos[idx] = {
            ...servicos[idx], ...dados,
            dataEdicao: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
        return servicos[idx];
    }
    return null;
}
export function removerServico(id) {
    const servicos = obterServicos().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(servicos));
    return servicos;
}
import { formatarMoeda, formatarTelefone, escapeHtml }
    from '../utils/formatters.js';
// Mapeamento de cores para categorias (incluir no roteiro)
const CORES_CATEGORIA = {
    'Alimentação': 'success',
    'Tecnologia': 'info',
    'Artesanato': 'warning',
    'Serviços Gerais': 'primary',
    'Turismo': 'secondary'
};
// Função para criar o HTML de um card de serviço
export function criarCardHtml(s) {
    const corBadge = CORES_CATEGORIA[s.categoria] || 'primary';
    const telNumeros = (s.telefone || '').replace(/\D/g, '');
    return `<div class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100 shadow-sm border-0 vitrine-card rounded-4 overflow-hidden">
        <div class="card-body p-4 d-flex flex-column">
        <div class="d-flex justify-content-between align-items-center mb-2">
        <span class="badge bg-${corBadge} px-3 py-2 rounded-pill font-outfit">
        <i class="bi bi-tag-fill me-1"></i>${escapeHtml(s.categoria)}
        </span>
        <span class="fw-bold text-success font-outfit fs-5">
        ${formatarMoeda(s.precoBase)}
        </span>
        </div>
        <h5 class="card-title fw-bold text-dark mt-2 mb-1">${escapeHtml(s.nome)}</h5>
        <h6 class="text-muted small mb-3">
        <i class="bi bi-geo-alt-fill text-danger me-1"></i>${escapeHtml(s.bairro)}
        </h6>
        <p class="card-text text-secondary small flex-grow-1" style="line-height: 1.5;">
        ${escapeHtml(s.descricao)}
        </p>
        <hr class="my-3 text-muted opacity-25">'<div class="d-flex justify-content-between align-items-center mt-auto">
        <a href="https://wa.me/55${telNumeros}" target="_blank"
        class="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold">
        <i class="bi bi-whatsapp me-1"></i>${formatarTelefone(s.telefone)}
        </a>
        <div class="d-flex gap-1">
        <button class="btn btn-sm btn-outline-primary btn-editar rounded-pill px-2"
        data-id="${s.id}" title="Editar serviço">
        <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger btn-excluir rounded-pill px-2"
        data-id="${s.id}" title="Remover da vitrine">
        <i class="bi bi-trash"></i>
        </button>
        </div>
        </div>
        </div>
        </div>
        </div>`;
        } export function renderizarCards(servicos, containerElement) {
            if (!servicos || servicos.length === 0) {
                containerElement.innerHTML = `
        <div class="col-12 text-center py-5">
        <div class="p-4 rounded-4 bg-light border">
        <i class="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
        <h5 class="fw-bold text-secondary mb-1">Nenhum serviço cadastrado nesta categoria</h5>
        <p class="text-muted small mb-0">Cadastre um novo serviço ou altere o filtro acima.</p>
        </div>
        </div>`;
        return;
    }
    containerElement.innerHTML = servicos.map(criarCardHtml).join('');
}
// Notificações flutuantes assíncronas (Toasts) com auto-fechamento
export function exibirToast(mensagem, tipo = 'success') {
    const toastEl = document.getElementById('toastNotificacao');
    const toastMsg = document.getElementById('toastMensagem');
    const toastTitulo = document.getElementById('toastTitulo');
    if (toastEl && toastMsg) {
        toastMsg.innerText = mensagem;
        if (toastTitulo) {
            toastTitulo.innerText = tipo === 'success' ? 'Sucesso!' : 'Aviso';
        }
        toastEl.className = `toast align-items-center text-bg-${tipo} border-0 shadow-lg`;
        const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000 });
        toast.show();
    }
}