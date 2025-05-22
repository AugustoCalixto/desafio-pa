# Streamline - Projeto de Scripts TMDb

Este projeto contém três scripts em TypeScript que consomem a API do The Movie Database (TMDb) para buscar e salvar informações sobre filmes populares, filmes em cartaz e filmes por gênero.

## Pré-requisitos
- Node.js (recomendado v18+)
- npm

## Instalação
1. Clone o repositório ou baixe os arquivos.
2. Instale as dependências:
   ```bash
   npm install
   ```

## Scripts Disponíveis

### 1. Rodar scripts individualmente
- **Filmes Populares:**
  ```bash
  npm run script1
  ```
  Salva os filmes populares e seus trailers em `results/movies.json`.

- **Filmes por Gênero (gêneros iniciados com "A")**
  ```bash
  npm run script2
  ```
  Salva os filmes do terceiro gênero iniciado com "A" em `results/animation-movies.json`.

- **Filmes em Cartaz:**
  ```bash
  npm run script3
  ```
  Salva os filmes em cartaz em `results/now-playing.json` e exibe detalhes de um filme aleatório.

### 2. Rodar todos os scripts em sequência
Execute:
```bash
npm run dev
```
Isso executa o arquivo `src/main.ts`, que centraliza a execução dos três scripts.

## Estrutura dos Resultados
Os arquivos gerados ficam na pasta `results/`:
- `movies.json`: Filmes populares
- `animation-movies.json`: Filmes do gênero filtrado
- `now-playing.json`: Filmes em cartaz

## Observações
- O projeto já inclui uma chave de API TMDb para testes. Para uso em produção, utilize sua própria chave.
- Os scripts usam `ts-node` para execução direta de arquivos TypeScript.

---

Se tiver dúvidas ou quiser personalizar algum script, fique à vontade para abrir uma issue ou contribuir!
# desafio-pa
