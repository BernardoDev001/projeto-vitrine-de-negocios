export function formatarTelefone(telefone) {
return telefone.replace(/^(\d{2})(\d{5})(\d{4})/,'($1) $2-$3');
}

// No arquivo js/main.js
import { formatarTelefone }
from './utils/formatters.js';

// Resultado: (48) 99999-8888
console.log(formatarTelefone('48999998888'));