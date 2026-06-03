import { WorldFragment, AssemblyItem, LoreDocument } from './types';

export const INITIAL_FRAGMENTS: WorldFragment[] = [
  {
    id: 'alti-1',
    title: 'Sussurros do Altiplano',
    type: 'audio',
    source: 'Terras Altas Andinas',
    territory: 'Setor 4',
    status: 'Zelo Concedido',
    content: 'Gravação binaural das correntes de ar frio que sopram através das frestas rochosas rituais no desfiladeiro alto de Tarapacá. O som simula uma flauta ancestral, modulada unicamente pelo sopro atmosférico.',
    audioDuration: '00:12',
    audioWaveform: [4, 12, 18, 14, 8, 12, 22, 25, 16, 9, 7, 13, 19, 11, 8, 4, 10, 15, 12, 5],
    connections: ['poet-2', 'memb-3', 'vento-8'],
    openToConnections: true,
    createdAt: '2026-05-12T14:35:00Z',
  },
  {
    id: 'poet-2',
    title: '"A terra não lembra nossos nomes, apenas o ritmo de nossos passos e o calor das sementes que deixamos para trás."',
    type: 'poetic',
    source: 'Tradição Oral #22',
    territory: 'Setor 4',
    status: 'Zelo Concedido',
    content: 'Fragmento lírico coletado durante os rituais de semeadura noturna. Reflete a recusa histórica do registro burocrático em prol de uma marcação ritmada corporal na geografia viva do território.',
    connections: ['alti-1', 'memb-3', 'flor-5', 'vale-6'],
    openToConnections: true,
    createdAt: '2026-05-18T09:12:00Z',
  },
  {
    id: 'memb-3',
    title: 'Membrana Viva',
    type: 'visual',
    source: 'Arquivo Botânico',
    territory: 'Setor 4',
    status: 'Zelo Concedido',
    content: 'Registro fotográfico de uma simbiose de musgos andinos cultivados sobre hardware de comunicação abandonado. De forma fascinante, o musgo formou canais umectantes que mantêm os circuitos reativos sob baixas correntes, retransmitindo dados de acoplamento bio-sintético.',
    imageUrl: 'https://images.unsplash.com/photo-1545231027-63b39f612acf?q=80&w=600&auto=format&fit=crop', // Beautiful high-quality moss macroshot as base
    connections: ['alti-1', 'poet-2', 'mang-4', 'vale-6'],
    openToConnections: true,
    createdAt: '2026-05-24T18:40:00Z',
  },
  {
    id: 'mang-4',
    title: 'Eco Resonante do Igapó',
    type: 'audio',
    source: 'Guardas da Maré',
    territory: 'Setor 2A',
    status: 'Ritualizado',
    content: 'Ruídos estalados produzidos por colônias de caranguejos de mangue sob as raízes suspensas durante o pico da maré vazante. Formam um mapa sonoro de sedimentação e fluxo de água salgada.',
    audioDuration: '00:45',
    audioWaveform: [3, 6, 4, 9, 15, 19, 11, 5, 8, 14, 20, 24, 18, 10, 12, 6, 4, 3, 7, 10],
    connections: ['memb-3', 'vale-6'],
    openToConnections: true,
    createdAt: '2026-05-27T11:20:00Z',
  },
  {
    id: 'flor-5',
    title: 'Xilo-Sinalizadores de Solo',
    type: 'visual',
    source: 'Laboratório das Raízes',
    territory: 'Setor 7G',
    status: 'Zelo Concedido',
    content: 'Raízes aéreas impregnadas com biocatalisadores biolinescentes naturais que reagem aos micro-tremores de terra. O brilho pulsa em tons esmeralda a cada vibração infinitesimal do leito tectônico subjacente.',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=600&auto=format&fit=crop', // Beautiful glowing roots image
    connections: ['poet-2', 'linc-7'],
    openToConnections: false,
    createdAt: '2026-05-29T10:00:00Z',
    isUserCreated: true,
  },
  {
    id: 'vale-6',
    title: 'Canto das Águas Subterrâneas',
    type: 'poetic',
    source: 'Poética do Meio Bio',
    territory: 'Setor 9N',
    status: 'Zelo Concedido',
    content: 'Expressão falada transmitida por tubos hídricos em fossos subterrâneos desativados. Atua como um registro do movimento invisível dos lençóis profundos e murmúrios geológicos compartilhados.',
    connections: ['memb-3', 'poet-2', 'mang-4'],
    openToConnections: true,
    createdAt: '2026-06-01T12:00:00Z',
  },
  {
    id: 'linc-7',
    title: 'Comunidade Liquênica Ativa',
    type: 'visual',
    source: 'Fotografia de Contato',
    territory: 'Setor 7G',
    status: 'Zelo Concedido',
    content: 'Comunidades simbióticas circulares formadas na interface entre as cascas de árvores decíduas e placas metálicas fotovoltaicas intemperizadas, gerando micro-padrões de absorção de luz.',
    imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop',
    connections: ['flor-5'],
    openToConnections: true,
    createdAt: '2026-06-02T15:30:00Z',
    isUserCreated: true,
  },
  {
    id: 'vento-8',
    title: 'Murmúrios do Vento Solar',
    type: 'audio',
    source: 'Coletor Atmosférico',
    territory: 'Setor 4',
    status: 'Ritualizado',
    content: 'Registro acústico sintetizado a partir de alterações geomagnéticas fracas causadas por ventos solares na atmosfera de baixa pressão do Altiplano Tarapacá.',
    audioDuration: '00:15',
    audioWaveform: [5, 12, 15, 20, 10, 12, 14, 18, 22, 25, 20, 15, 10, 8, 12, 14, 16, 12, 8, 4],
    connections: ['alti-1'],
    openToConnections: true,
    createdAt: '2026-06-02T19:45:00Z',
  }
];

export const TERRITORIES = [
  { id: 'Setor 4', name: 'Território das Alturas (Setor 4)', coordinates: '19.4324° S, 69.2154° W' },
  { id: 'Setor 7G', name: 'Selvageria Urbana (Setor 7G)', coordinates: '23.5505° S, 46.6333° W' },
  { id: 'Setor 2A', name: 'Margens do Igapó (Setor 2A)', coordinates: '3.0722° S, 60.0125° W' },
  { id: 'Setor 9N', name: 'Aluviões do Vale Central (Setor 9N)', coordinates: '33.4489° S, 70.6693° W' }
];

export const INITIAL_ASSEMBLIES: AssemblyItem[] = [
  {
    id: 'ass-1',
    title: 'Assembleia de Re-Escuta das Alturas',
    date: 'Amanhã às 18:00 (Fuso Local)',
    territory: 'Setor 4',
    description: 'Encontro circular para audição coletiva de novos registros binaurais recolhidos pelas redes de sismógrafos e flautas eólicas do desfiladeiro alto.',
    attendees: 14,
  },
  {
    id: 'ass-2',
    title: 'Mutirão Teia Linfática',
    date: 'Próxima Lua Cheia (03/06)',
    territory: 'Setor 7G',
    description: 'Ritual prático de costura urbana de conexões físicas e bioluminescentes entre o Archive Room central e as praças sementes do território 7G.',
    attendees: 29,
  },
  {
    id: 'ass-3',
    title: 'Escuta das Células Cíclicas',
    date: 'Finalizado há 2 dias',
    territory: 'Setor 2A',
    description: 'Mapeamento acústico de bio-indicadores estuarinos. Debate sobre a salinização precoce do lençol freático.',
    attendees: 8,
  }
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
    category: 'Manisfestação Teórica',
    title: 'Tratado de Simbiose Mineral e Tecno-Urbana',
    content: 'O projeto propõe que as tecnologias obsoletas do antropoceno não precisam se transformar em lixo inerte. Sob condições adequadas de umidade, temperatura e quietude ritual, as interfaces computacionais se tornam o berçário ideal para os esporos e micélios nativos. Através deste amálgama metal-fúngico, novas transmissões sonoras e de baixa voltagem são tecidas, gerando o que chamamos de teias situadas.',
    date: 'Setembro, 2025'
  },
  {
    id: 'doc-2',
    category: 'Mapeamento Botânico',
    title: 'Musgo Andino e Retransmissão Bio-Análoga',
    content: 'A espécie Bryophyta tarapacensis demonstra afinidade incomum por ligas de cobre e silício presentes em microcontroladores descartados. Ela age como uma esponja capacitiva. Quando o ar está úmido, a membrana do musgo altera a resistividade elétrica dos trilhos condutores. Esses ciclos diários de umidade são transcritos por nossos receptores analógicos como variações sonoras rítmicas e sussurros de baixa frequência.',
    date: 'Janeiro, 2026'
  },
  {
    id: 'doc-3',
    category: 'Sabedoria Ancestral',
    title: 'Registro das Tradições Orais de Semeadura',
    content: 'A tradição oral andina não separa a fala humana do som da terra. As canções de plantio (tarapacas) agem como moduladores de solo. A hipótese especulativa de nosso cuidado (Zelo) é que o ritmo das batidas corporais e cânticos gera micro-sinais mecânicos que alteram a germinação das sementes nativas, explicando o sucesso ecológico das plantações guardadas.',
    date: 'Março, 2026'
  }
];
