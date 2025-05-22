// Este arquivo centraliza a execução dos scripts script1, script2 e script3.
import('./script1').then(() => {
    console.log('script1.ts executado com sucesso!');
}).catch((e) => {
    console.error('Erro ao executar script1:', e);
});

import('./script2').then(() => {
    console.log('script2.ts executado com sucesso!');
}).catch((e) => {
    console.error('Erro ao executar script2:', e);
});

import('./script3').then(() => {
    console.log('script3.ts executado com sucesso!');
}).catch((e) => {
    console.error('Erro ao executar script3:', e);
});
