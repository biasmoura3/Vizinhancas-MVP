import { Leaf, Award, Brain, Compass } from 'lucide-react';

export default function ManifestoTab() {
  const principles = [
    {
      icon: Award,
      title: 'Cuidar Juntos',
      description: 'Os fragmentos de mundo do nosso bairro não pertencem a grandes empresas ou à internet distante. Eles pertencem às pessoas que vivem aqui. Cada fragmento de mundo guardado protege nossa identidade comunitária.'
    },
    {
      icon: Brain,
      title: 'Tecnologia Simples e Humana',
      description: 'Rejeitamos a pressa das redes sociais tradicionais. Acreditamos no tempo de ouvir, conversar e deixar que cada fragmento de mundo seja compartilhado no seu próprio ritmo natural.'
    },
    {
      icon: Leaf,
      title: 'União com a Natureza',
      description: 'Acreditamos que os nossos espaços compartilhados, praças e plantas fazem parte da nossa comunidade. Queremos acolher o som do vento, da água e das árvores como fragmentos essenciais do nosso habitar.'
    },
    {
      icon: Compass,
      title: 'Fragmentos com Endereço',
      description: 'Todos os sons, poemas e observações têm um lugar especial onde aconteceram. Guardar esses fragmentos fortalece o nosso carinho com o chão onde pisamos.'
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10 sm:space-y-16 py-6 sm:py-8 px-4 animate-in fade-in duration-500">
      
      {/* Editorial Title */}
      <header className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-primary">Nossos Ideais</span>
        <h2 className="font-serif font-light text-3xl sm:text-5xl leading-tight text-on-surface">
          A Força dos <span className="italic text-primary">Nossos Fragmentos</span>
        </h2>
        <div className="h-[2px] w-16 bg-primary/30 mx-auto mt-4" />
      </header>

      {/* Main Philosophy Text */}
      <section className="glass-panel border border-outline/20 rounded-xl p-5 sm:p-8 md:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <span className="absolute top-4 right-6 font-serif text-8xl text-primary/5 select-none font-semibold">§</span>
        <p className="font-literata text-base sm:text-lg leading-relaxed text-on-surface-variant/90 sm:indent-8 font-serif sm:leading-8">
          Hoje em dia, passamos muito tempo conectados a redes distantes e feeds infinitos que não dizem nada sobre a nossa realidade. O projeto <strong>Vizinhanças</strong> nasce do desejo de criar um ponto de encontro verdadeiro. Queremos acolher de forma carinhosa os fragmentos de mundo do nosso povo.
        </p>
        <p className="font-literata text-base sm:text-lg leading-relaxed text-on-surface-variant/90 sm:indent-8 font-serif sm:leading-8">
          Não queremos medir ou controlar nada. Queremos apenas valorizar a vida local. Quando você envia um fragmento sonoro ambiente, um poema ou um fragmento visual do seu quintal, você está ajudando a tecer uma grande colcha de retalhos com os fragmentos de todos. O nosso mapa interativo mostra, de forma simples e bonita, como esses fragmentos se aproximam e se conectam na Constelação.
        </p>
      </section>

      {/* Core Principles Grid */}
      <section className="space-y-8">
        <h3 className="font-serif text-2xl font-light text-center text-on-surface tracking-wide">
          Valores Fundamentais de União
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {principles.map((pr, i) => {
            const Icon = pr.icon;
            return (
              <div 
                key={i} 
                className="glass-panel border border-outline/20 rounded-xl p-5 sm:p-6 hover:border-secondary/40 transition-all group flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-sans font-semibold text-sm text-on-surface tracking-wide">
                    {pr.title}
                  </h4>
                  <p className="font-sans text-xs text-on-surface-variant/80 leading-relaxed">
                    {pr.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer Reflection */}
      <footer className="text-center pt-8 border-t border-outline/15 text-xs font-mono text-on-surface-variant/50 max-w-lg mx-auto leading-relaxed">
        <p>"O nosso bairro tem voz. Cabe a nós acolhermos e cuidarmos com carinho de cada fragmento de mundo diariamente."</p>
        <span className="block mt-2 text-primary/60 font-sans text-[11px]">— COLETIVO VIZINHANÇAS, 2026.</span>
      </footer>
    </div>
  );
}
