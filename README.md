# Vizinhanças

Vizinhanças é um ambiente digital vivo para o cultivo de vizinhanças entre designers e mundos situados. O projeto existe para criar as condições para que o design sentipensante aconteça, desarmando o designer, protegendo a soberania discursiva das comunidades e tecendo compromissos de reciprocidade.

## Visão geral

No MVP de Vizinhanças, a experiência central é uma constelação de fragmentos de mundo e saberes comunitários. Esses fragmentos são oferecidos por pessoas e coletivos, levando em conta:

- contextos de enunciação: quem ofereceu o fragmento, em qual território, com ou sem permissão de conexão;
- formatos variados: áudio, imagem e texto;
- uma lógica de ressonância em vez de busca tradicional, semelhante à construção de um acervo relacional como o Obsidian.

O usuário é convidado a testemunhar. Pode ouvir e ver fragmentos, mas não pode baixar, copiar ou exportar o conteúdo. Isso protege a comunidade contra extrativismo e força a presença no encontro com o material.

## O MVP oferece

- uma constelação de fragmentos de mundo;
- acervo de conhecimentos de diferentes lugares e comunidades;
- alimentação comunitária do conteúdo;
- navegação por ressonância e contexto;
- preservação da experiência de presença e não extração.

## Como funciona

1. A comunidade compartilha fragmentos de mundo.
2. Cada fragmento traz metadados de origem e condição de conexão.
3. O usuário acessa esses fragmentos como testemunha, numa experiência não transfere conteúdo.
4. A navegação funciona como uma constelação de conhecimento, com conexões que ressoam entre si.

## Estrutura do projeto

- `src/` — código principal do app em React + TypeScript.
- `src/components/` — componentes de interface, como `CanvasMap`, `Sidebar`, `ProposalModal` e abas de conteúdo.
- `server/` — backend leve para suportar APIs ou dados se necessário.
- `data/` — espaço para dados de referência e conteúdo.
- `assets/` — mídia e recursos estáticos.

## Tecnologias usadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express
- Vercel (deployment alvo)

## Executar localmente

**Pré-requisitos:** Node.js

1. Instale dependências:
   `npm install`
2. Inicie o aplicativo:
   `npm run dev`
3. Abra `http://localhost:3000`

## Deploy

O projeto será implantado no Vercel. Para publicar:

- configure o repositório no Vercel;
- ajuste variáveis de ambiente no painel do Vercel, se necessário;
- use o build padrão do Vite: `npm run build`.

## Propósito

Vizinhanças propõe um lugar para cuidar de relações e narrativas, não apenas para indexar informação. Aqui, a tecnologia é uma superfície para a escuta, o cuidado e a construção de presença coletiva.
