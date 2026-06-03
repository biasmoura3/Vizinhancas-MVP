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

## Política de mídia — sem armazenamento

- O sistema **não armazena** arquivos de mídia (imagens, áudios, vídeos) no nosso servidor ou em buckets gerenciados pelo projeto.
- Contribuintes devem fornecer **links de visualização** hospedados por serviços terceiros (por exemplo: YouTube, Vimeo, SoundCloud, Imgur, ou provedores que ofereçam URLs de visualização pública).
- O app **incorpora** esses links para visualização inline dentro da interface; o arquivo NÃO é transferido para armazenamento nosso nem disponibilizado para download.

Padrões e exemplos aceitos:

- Imagem direta: https://i.imgur.com/exemplo.jpg
- Áudio (embed): SoundCloud ou URL direta para mp3/ogg com CORS habilitado
- Vídeo: https://www.youtube.com/watch?v=... ou https://vimeo.com/...
- Texto/Documento: links para páginas públicas que possam ser embedadas em iframe

Orientações de implementação (dev notes):

- Preferir uso de protocolos de embed padronizados (oEmbed) quando disponível.
- Validar e sanitizar URLs recebidas; aplicar uma whitelist de domínios confiáveis.
- Renderizar mídia inline sem proxiar o arquivo. Para iframes, usar atributos de `sandbox` restritivos e políticas de Content Security Policy (CSP) no deploy.
- Para imagens e áudio, usar elementos nativos (`<img>`, `<audio>`) com controles limitados e sem links de download explícitos.
- Evitar `allow-scripts` em iframes quando possível; quando necessário, restringir a origem e auditar o provedor.

Motivação e efeitos UX:

- Essa política evita custos de armazenamento e reduz responsabilidade sobre conteúdos sensíveis.
- Garante também que a experiência do usuário permaneça dentro da página (visualização inline), reforçando a ideia de presença e testemunho sem extração.

Notas de segurança e governança:

- Documentar claramente na interface que os conteúdos são hospedados por terceiros e não permanecem sob controle do projeto.
- Manter logs de referência (metadados) sobre quem forneceu o link e sob que condição de conexão foi ofertado, sem gravar o arquivo em si.

## Propósito

Vizinhanças propõe um lugar para cuidar de relações e narrativas, não apenas para indexar informação. Aqui, a tecnologia é uma superfície para a escuta, o cuidado e a construção de presença coletiva.
