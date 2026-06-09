import { WorldFragment, LoreDocument } from './types';

export const DEFAULT_FRAGMENT_CONNECTIONS: Record<string, string[]> = {
  'alti-1': ['poet-2', 'memb-3'],
  'poet-2': ['alti-1'],
  'memb-3': ['alti-1'],
  'mang-4': [],
  'flor-5': ['linc-7'],
  'vale-6': [],
  'linc-7': ['flor-5'],
  'vento-8': [],
};

export const INITIAL_FRAGMENTS: WorldFragment[] = [
  {
    id: 'alti-1',
    title: 'Sussurros do Altiplano',
    type: 'audio',
    source: 'Terras Altas Andinas',
    territory: 'Setor 4',
    content: 'GravaÃ§Ã£o binaural das correntes de ar frio que sopram atravÃ©s das frestas rochosas rituais no desfiladeiro alto de TarapacÃ¡. O som simula uma flauta ancestral, modulada unicamente pelo sopro atmosfÃ©rico.',
    createdAt: '2026-05-12T14:35:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: ['poet-2', 'memb-3'],
  },
  {
    id: 'poet-2',
    title: '"A terra nÃ£o lembra nossos nomes, apenas o ritmo de nossos passos e o calor das sementes que deixamos para trÃ¡s."',
    type: 'poetic',
    source: 'TradiÃ§Ã£o Oral #22',
    territory: 'Setor 4',
    content: 'Fragmento lÃ­rico coletado durante os rituais de semeadura noturna. Reflete a recusa histÃ³rica do registro burocrÃ¡tico em prol de uma marcaÃ§Ã£o ritmada corporal na geografia viva do territÃ³rio.',
    createdAt: '2026-05-18T09:12:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: ['alti-1'],
  },
  {
    id: 'memb-3',
    title: 'Membrana Viva',
    type: 'visual',
    source: 'Arquivo BotÃ¢nico',
    territory: 'Setor 4',
    content: 'Registro fotogrÃ¡fico de uma simbiose de musgos andinos cultivados sobre hardware de comunicaÃ§Ã£o abandonado. De forma fascinante, o musgo formou canais umectantes que mantÃªm os circuitos reativos sob baixas correntes, retransmitindo dados de acoplamento bio-sintÃ©tico.',
    imageUrl: 'https://images.unsplash.com/photo-1545231027-63b39f612acf?q=80&w=600&auto=format&fit=crop', // Beautiful high-quality moss macroshot as base
    createdAt: '2026-05-24T18:40:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: ['alti-1'],
  },
  {
    id: 'mang-4',
    title: 'Eco Resonante do IgapÃ³',
    type: 'audio',
    source: 'Guardas da MarÃ©',
    territory: 'Setor 2A',
    content: 'RuÃ­dos estalados produzidos por colÃ´nias de caranguejos de mangue sob as raÃ­zes suspensas durante o pico da marÃ© vazante. Formam um mapa sonoro de sedimentaÃ§Ã£o e fluxo de Ã¡gua salgada.',
    createdAt: '2026-05-27T11:20:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: [],
  },
  {
    id: 'flor-5',
    title: 'Xilo-Sinalizadores de Solo',
    type: 'visual',
    source: 'LaboratÃ³rio das RaÃ­zes',
    territory: 'Setor 7G',
    content: 'RaÃ­zes aÃ©reas impregnadas com biocatalisadores biolinescentes naturais que reagem aos micro-tremores de terra. O brilho pulsa em tons esmeralda a cada vibraÃ§Ã£o infinitesimal do leito tectÃ´nico subjacente.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop', // Beautiful glowing roots image
    createdAt: '2026-05-29T10:00:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: ['linc-7'],
    isUserCreated: true,
  },
  {
    id: 'vale-6',
    title: 'Canto das Ãguas SubterrÃ¢neas',
    type: 'poetic',
    source: 'PoÃ©tica do Meio Bio',
    territory: 'Setor 9N',
    content: 'ExpressÃ£o falada transmitida por tubos hÃ­dricos em fossos subterrÃ¢neos desativados. Atua como um registro do movimento invisÃ­vel dos lenÃ§Ã³is profundos e murmÃºrios geolÃ³gicos compartilhados.',
    createdAt: '2026-06-01T12:00:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: [],
  },
  {
    id: 'linc-7',
    title: 'Comunidade LiquÃªnica Ativa',
    type: 'visual',
    source: 'Fotografia de Contato',
    territory: 'Setor 7G',
    content: 'Comunidades simbiÃ³ticas circulares formadas na interface entre as cascas de Ã¡rvores decÃ­duas e placas metÃ¡licas fotovoltaicas intemperizadas, gerando micro-padrÃµes de absorÃ§Ã£o de luz.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop',
    createdAt: '2026-06-02T15:30:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: ['flor-5'],
    isUserCreated: true,
  },
  {
    id: 'vento-8',
    title: 'MurmÃºrios do Vento Solar',
    type: 'audio',
    source: 'Coletor AtmosfÃ©rico',
    territory: 'Setor 4',
    content: 'Registro acÃºstico sintetizado a partir de alteraÃ§Ãµes geomagnÃ©ticas fracas causadas por ventos solares na atmosfera de baixa pressÃ£o do Altiplano TarapacÃ¡.',
    createdAt: '2026-06-02T19:45:00Z',
    isOpenToConnections: true,
    connectedFragmentIds: [],
  }
];

export const TERRITORIES = [
  { id: 'Setor 4', name: 'TerritÃ³rio das Alturas (Setor 4)', coordinates: '19.4324Â° S, 69.2154Â° W' },
  { id: 'Setor 7G', name: 'Selvageria Urbana (Setor 7G)', coordinates: '23.5505Â° S, 46.6333Â° W' },
  { id: 'Setor 2A', name: 'Margens do IgapÃ³ (Setor 2A)', coordinates: '3.0722Â° S, 60.0125Â° W' },
  { id: 'Setor 9N', name: 'AluviÃµes do Vale Central (Setor 9N)', coordinates: '33.4489Â° S, 70.6693Â° W' }
];

export const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1545231027-63b39f612acf?q=80&w=600&auto=format&fit=crop', // Moss macro
  'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop', // Rainforest green
  'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop', // Pine trees forest
  'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop' // Textured wood lichen
];

export const LORE_DOCUMENTS: LoreDocument[] = [
  {
    id: 'doc-1',
    category: 'ManisfestaÃ§Ã£o TeÃ³rica',
    title: 'Tratado de Simbiose Mineral e Tecno-Urbana',
    content: 'O projeto propÃµe que as tecnologias obsoletas do antropoceno nÃ£o precisam se transformar em lixo inerte. Sob condiÃ§Ãµes adequadas de umidade, temperatura e quietude ritual, as interfaces computacionais se tornam o berÃ§Ã¡rio ideal para os esporos e micÃ©lios nativos. AtravÃ©s deste amÃ¡lgama metal-fÃºngico, novas transmissÃµes sonoras e de baixa voltagem sÃ£o percebidas como registros situados.',
    date: 'Setembro, 2025'
  },
  {
    id: 'doc-2',
    category: 'Mapeamento BotÃ¢nico',
    title: 'Musgo Andino e RetransmissÃ£o Bio-AnÃ¡loga',
    content: 'A espÃ©cie Bryophyta tarapacensis demonstra afinidade incomum por ligas de cobre e silÃ­cio presentes em microcontroladores descartados. Ela age como uma esponja capacitiva. Quando o ar estÃ¡ Ãºmido, a membrana do musgo altera a resistividade elÃ©trica dos trilhos condutores. Esses ciclos diÃ¡rios de umidade sÃ£o transcritos por nossos receptores analÃ³gicos como variaÃ§Ãµes sonoras rÃ­tmicas e sussurros de baixa frequÃªncia.',
    date: 'Janeiro, 2026'
  },
  {
    id: 'doc-3',
    category: 'Sabedoria Ancestral',
    title: 'Registro das TradiÃ§Ãµes Orais de Semeadura',
    content: 'A tradiÃ§Ã£o oral andina nÃ£o separa a fala humana do som da terra. As canÃ§Ãµes de plantio (tarapacas) agem como moduladores de solo. A hipÃ³tese especulativa de nosso cuidado (Zelo) Ã© que o ritmo das batidas corporais e cÃ¢nticos gera micro-sinais mecÃ¢nicos que alteram a germinaÃ§Ã£o das sementes nativas, explicando o sucesso ecolÃ³gico das plantaÃ§Ãµes guardadas.',
    date: 'MarÃ§o, 2026'
  }
];
