import { formatarTelefone }
    from './utils/formatters.js';
    
import {
    obterServicos, salvarServico,
    atualizarServico, removerServico
} from './services/vitrineService.js';
import {
    renderizarCards, exibirToast
} from './views/vitrineView.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const container = document.getElementById('vitrineContainer');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const contadorEl = document.getElementById('totalServicosBadge');
    const modalEl = document.getElementById('modalCadastro');
    const servicoIdInput = document.getElementById('servicoId');

    function atualizarInterface() {
        const todos = obterServicos();
        const filtro = filtroCategoria.value;
        const filtrados = filtro === 'todas'
            ? todos
            : todos.filter(s => s.categoria === filtro);

        renderizarCards(filtrados, container);

        if (contadorEl) {
            contadorEl.innerText = `${todos.length} cadastrados`;
        }
    }

    // Filtros Reativos
    filtroCategoria.addEventListener('change', atualizarInterface);
    atualizarInterface();

    // Reset do Modal ao abrir para novo cadastro
    if (modalEl) {
        modalEl.addEventListener('show.bs.modal', () => {
            if (!servicoIdInput.value) {
                form.reset();
                form.classList.remove('was-validated');

                const modalTitulo = document.getElementById('modalCadastroLabel');
                if (modalTitulo) {
                    modalTitulo.innerHTML =
                        '<i class="bi bi-plus-circle text-primary me-2"></i>Novo Serviço na Vitrine';
                }
                const btnSalvarTexto = document.getElementById('btnSalvarTexto');
                if (btnSalvarTexto) {
                    btnSalvarTexto.innerText = 'Salvar';
                }
            }
        });

        // Limpa o id ao fechar o modal
        modalEl.addEventListener('hidden.bs.modal', () => {
            if (servicoIdInput) servicoIdInput.value = '';
        });
    }

    // Cliques nos cards (editar / excluir)
    container.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        if (btnEditar) {
            const id = btnEditar.getAttribute('data-id');
            const item = obterServicos().find(s => String(s.id) === String(id));

            if (item) {
                if (servicoIdInput) servicoIdInput.value = item.id;
                document.getElementById('nome').value = item.nome;
                document.getElementById('categoria').value = item.categoria;
                document.getElementById('bairro').value = item.bairro;
                document.getElementById('precoBase').value = item.precoBase;
                document.getElementById('telefone').value = item.telefone;
                document.getElementById('descricao').value = item.descricao;

                const modalTitulo = document.getElementById('modalCadastroLabel');
                if (modalTitulo) {
                    modalTitulo.innerHTML =
                        '<i class="bi bi-pencil-square text-primary me-2"></i>Editar Serviço na Vitrine';
                }
                const btnSalvarTexto = document.getElementById('btnSalvarTexto');
                if (btnSalvarTexto) {
                    btnSalvarTexto.innerText = 'Salvar Alterações';
                }

                const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
                modal.show();
            }
            return;
        }

        const btnExcluir = e.target.closest('.btn-excluir');
        if (btnExcluir) {
            const id = btnExcluir.getAttribute('data-id');
            if (confirm('Deseja realmente remover este serviço da vitrine?')) {
                removerServico(id);
                atualizarInterface();
                exibirToast('Serviço removido da vitrine.', 'warning');
            }
        }
    });

    // Envio do formulário (cadastrar / atualizar)
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const dados = {
            nome: document.getElementById('nome').value.trim(),
            categoria: document.getElementById('categoria').value,
            bairro: document.getElementById('bairro').value.trim(),
            precoBase: document.getElementById('precoBase').value,
            telefone: document.getElementById('telefone').value.trim(),
            descricao: document.getElementById('descricao').value.trim()
        };

        if (servicoIdInput.value) {
            atualizarServico(servicoIdInput.value, dados);
            exibirToast('Serviço atualizado com sucesso!', 'success');
        } else {
            salvarServico(dados);
            exibirToast('Serviço cadastrado com sucesso!', 'success');
        }

        servicoIdInput.value = '';
        bootstrap.Modal.getOrCreateInstance(modalEl).hide();
        atualizarInterface();
    });
});