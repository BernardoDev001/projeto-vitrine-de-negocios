// Resultado: (48) 99999-8888
console.log(formatarTelefone('48999998888'));

export function formatarMoeda(valor) {
    const num = parseFloat(valor) || 0;
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}
export function formatarTelefone(fone) {
    const digits = (fone || '').replace(/\D/g, '');
    if (digits.length === 11) {
        return digits.replace(
            /^(\d{2})(\d{5})(\d{4})/,
            '($1) $2-$3'
        );
    }
    return fone;
}
export function escapeHtml(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}