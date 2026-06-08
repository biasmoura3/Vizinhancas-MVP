# Vizinhanças

Vizinhanças é um ambiente digital vivo para o cultivo de vizinhanças entre designers e mundos situados. O projeto existe para criar as condições para que o design sentipensante aconteça, desarmando o designer, protegendo a soberania discursiva das comunidades e sustentando compromissos de reciprocidade.

## Definições atuais do sistema

Este README deve acompanhar as definições vigentes do MVP. Sempre que uma regra de produto mudar, este documento deve ser atualizado junto com o código.

- Fragmentos de mundo são unidades independentes do acervo.
- A navegação acontece por constelação visual de pontos, detalhes do fragmento e acervo salvo.
- Cada fragmento traz metadados de origem, território, formato, conteúdo e data de registro.
- O sistema aceita fragmentos sonoros, visuais e textuais.
- Usuários podem propor, editar e excluir seus próprios fragmentos.
- Usuários podem salvar fragmentos de outros territórios para consulta posterior.
- O conteúdo é testemunhado dentro da interface, sem download, cópia ou exportação pelo app.

## Visão Geral

No MVP de Vizinhanças, a experiência central é uma constelação de fragmentos de mundo e saberes comunitários. Esses fragmentos são oferecidos por pessoas e coletivos, levando em conta:

- contextos de enunciação: quem ofereceu o fragmento e em qual território;
- formatos variados: fragmentos sonoros, imagem e texto;
- uma lógica de presença e testemunho em vez de busca tradicional ou extração de conteúdo.

O usuário é convidado a testemunhar. Pode ver fragmentos e suas referências incorporadas, mas não pode baixar, copiar ou exportar o conteúdo. Isso protege a comunidade contra extrativismo e reforça a presença no encontro com o material.

## O MVP Oferece

- uma constelação visual de fragmentos de mundo;
- acervo de conhecimentos de diferentes lugares e comunidades;
- alimentação comunitária do conteúdo;
- visualização por formato;
- edição e exclusão de fragmentos criados pelo próprio usuário;
- salvamento de fragmentos de outros territórios para consulta posterior;
- preservação da experiência de presença e não extração.

## Como Funciona

1. A comunidade compartilha fragmentos de mundo.
2. Cada fragmento registra origem, território, formato e conteúdo.
3. O usuário acessa esses fragmentos como testemunha, numa experiência que não transfere o conteúdo.
4. A navegação funciona como uma constelação de pontos independentes, com painéis de detalhe.
5. Fragmentos de outros territórios podem ser salvos em um acervo pessoal para consulta posterior.

## Estrutura do Projeto

- `src/` — código principal do app em React + TypeScript.
- `src/components/` — componentes de interface, como `CanvasMap`, `Sidebar`, `ProposalModal` e abas de conteúdo.
- `src/data.ts` — dados iniciais de fragmentos, territórios e documentos.
- `src/types.ts` — definições centrais dos tipos usados pelo app.

## Tecnologias Usadas

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Vercel como alvo de deploy

## Executar Localmente

**Pré-requisito:** Node.js

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

## Política de Mídia — Sem Armazenamento

- O sistema **não armazena** arquivos de mídia (imagens e vídeos) no nosso servidor ou em buckets gerenciados pelo projeto.
- Contribuintes devem fornecer **links de visualização** hospedados por serviços terceiros, como YouTube, Vimeo, Imgur ou provedores que ofereçam URLs de visualização pública.
- O app **incorpora** esses links para visualização inline dentro da interface; o arquivo não é transferido para armazenamento nosso nem disponibilizado para download.
- Cada fragmento pode ter **no máximo 3 links de visualização**. Essa limitação é parte do desenho da plataforma e deve ser mantida nos formulários, na persistência dos dados e na visualização responsiva dos fragmentos.

Padrões e exemplos aceitos:

- Imagem direta: `https://i.imgur.com/exemplo.jpg`
- Fragmento sonoro com preview: `https://www.youtube.com/watch?v=...`
- Vídeo: `https://www.youtube.com/watch?v=...` ou `https://vimeo.com/...`
- Texto/documento: links para páginas públicas que possam ser incorporadas em iframe

Orientações de implementação:

- Preferir uso de protocolos de embed padronizados, como oEmbed, quando disponível.
- Validar e sanitizar URLs recebidas; aplicar uma lista de domínios confiáveis.
- Renderizar mídia inline sem proxiar o arquivo.
- Manter o limite de 3 links por fragmento ao criar, editar, salvar e exibir mídias.
- Para iframes, usar atributos de `sandbox` restritivos e políticas de Content Security Policy no deploy.
- Para imagens, usar elemento nativo (`<img>`) sem links de download explícitos.
- Evitar `allow-scripts` em iframes quando possível; quando necessário, restringir a origem e auditar o provedor.

## Segurança e Governança

- Documentar claramente na interface que os conteúdos são hospedados por terceiros e não permanecem sob controle do projeto.
- Manter logs de referência sobre quem forneceu o link e em qual contexto o fragmento foi ofertado, sem gravar o arquivo em si.
- Evitar qualquer funcionalidade que facilite cópia, exportação ou download do acervo.

## Supabase

O app pode operar em modo local quando as variáveis Supabase não estão configuradas. Para ativar armazenamento remoto:

- crie um projeto Supabase;
- execute `supabase/migrations/20260608000000_create_vizinhancas_schema.sql`;
- execute `supabase/seed.sql` para carregar territórios e fragmentos iniciais;
- configure `VITE_SUPABASE_URL` com a URL raiz do projeto Supabase, por exemplo `https://seu-projeto.supabase.co`, sem `/auth/v1`, `/rest/v1` ou outros caminhos;
- configure `VITE_SUPABASE_ANON_KEY` no ambiente do Vite/Vercel;
- habilite o provedor de e-mail no painel de Auth do Supabase para cadastro, confirmacao e entrada com senha;
- em Auth > URL Configuration, cadastre a URL publicada do app e `http://localhost:3000` em Redirect URLs;
- cadastros retornam automaticamente para a URL atual do app depois da confirmacao por e-mail;
- se os e-mails de confirmacao nao chegarem, configure o envio SMTP do projeto ou desative a confirmacao obrigatoria de e-mail em Auth > Providers > Email para entrada imediata com senha.

As informacoes do perfil publico sao armazenadas automaticamente em `public.profiles` pelo trigger `on_auth_user_created` quando o usuario e criado em `auth.users`.

O banco guarda usuários, perfis públicos, territórios, fragmentos e fragmentos salvos. Arquivos de mídia continuam fora do Supabase: a plataforma armazena apenas links públicos de visualização, com limite de 3 links por fragmento.

## Propósito

Vizinhanças propõe um lugar para cuidar de relações e narrativas, não apenas para indexar informação. Aqui, a tecnologia é uma superfície para a escuta, o cuidado e a construção de presença coletiva.
