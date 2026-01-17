const axios = require('axios');
const BASE_URL = 'http://localhost:3000';

// 35 veículos populares do mercado brasileiro com dados completos e realistas
const vehicles = [
    // SEDÃS MÉDIOS/GRANDES
    {
        marca: 'Toyota',
        modelo: 'Corolla XEi 2.0',
        ano: 2022,
        km: 28500,
        preco: 129900,
        cor: 'Prata',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Toyota Corolla XEi 2.0 Flex 2022 em excelente estado de conservação. Único dono, todas as revisões realizadas na concessionária autorizada Toyota. Equipado com central multimídia de 8 polegadas com Android Auto e Apple CarPlay, câmera de ré com linhas dinâmicas, sensores de estacionamento traseiros, ar-condicionado digital dual zone, bancos revestidos em couro legítimo, volante multifuncional com controles de áudio e telefone, rodas de liga leve aro 16 polegadas. Motor 2.0 flex de 177cv, câmbio automático CVT. Consumo médio urbano: 11km/l. Veículo impecável, pronto para uso. Manual do proprietário, chave reserva. Aceito veículo como parte do pagamento e financio em até 60 meses com entrada facilitada.',
        destaque: true
    },
    {
        marca: 'Honda',
        modelo: 'Civic EXL 2.0',
        ano: 2021,
        km: 35200,
        preco: 139900,
        cor: 'Preto',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Honda Civic EXL 2.0 2021, versão topo de linha do sedã mais vendido do Brasil. Motor 2.0 i-VTEC flex com 155 cavalos de potência. Bancos em couro premium com ajustes elétricos, teto solar elétrico com função anti-esmagamento, sistema de som premium com 8 alto-falantes e subwoofer, cruise control adaptativo (ACC), sistema Honda Sensing com frenagem automática de emergência, faróis full LED com DRL, rodas de liga leve aro 17 polegadas diamantadas, central multimídia de 7 polegadas com câmera de visão traseira de alta resolução. Revisões em dia na concessionária Honda, pneus Michelin com 80% de vida útil, pintura impecável sem retoques. IPVA 2024 pago. Garantia estendida Honda Care válida até 2025. Aceito troca por veículo de menor valor.',
        destaque: true
    },
    {
        marca: 'Nissan',
        modelo: 'Versa Exclusive CVT',
        ano: 2023,
        km: 18200,
        preco: 99900,
        cor: 'Prata',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Nissan Versa Exclusive 2023, o sedã mais espaçoso da categoria média. Motor 1.6 flex de 120cv com câmbio CVT (transmissão continuamente variável). Porta-malas gigante de 465 litros, ideal para viagens em família. Equipado com ar-condicionado digital com controle dual zone, central multimídia de 8 polegadas touchscreen com Android Auto e Apple CarPlay wireless, câmera de ré com visão 360 graus, sensores de estacionamento dianteiros e traseiros, volante revestido em couro com comandos multimídia, bancos em tecido premium com revestimento resistente a manchas. Sistema de som com 6 alto-falantes, controle de velocidade de cruzeiro, faróis com acendimento automático, sensor de chuva, computador de bordo completo. Consumo médio de 13,5 km/l na cidade. Garantia de fábrica válida até 2026. Revisões agendadas na Nissan. Veículo de único dono, procedência comprovada.',
        destaque: false
    },

    // SEDÃS COMPACTOS
    {
        marca: 'Hyundai',
        modelo: 'HB20S Diamond Plus',
        ano: 2023,
        km: 11800,
        preco: 89900,
        cor: 'Preto',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Hyundai HB20S Diamond Plus 2023, edição especial com acabamento Premium. Motor 1.0 Turbo GDi de 120 cavalos, câmbio automático de 6 marchas. Central multimídia Bluelink de 8 polegadas com conectividade total (rastreamento, assistente virtual, Wi-Fi hotspot), carregamento de celular por indução wireless, ar-condicionado digital automático, bancos revestidos em couro com costura diamantada exclusiva, rodas de liga leve aro 16 com design exclusivo Diamond, faróis de neblina com contorno cromado, acabamento interno com detalhes em piano black. Sistema de som com 6 alto-falantes. Consumo urbano: 12,8 km/l. Garantia de 5 anos ou 100.000 km (o que ocorrer primeiro). Único dono, manual e chave reserva presentes. Pacote de revisões pré-pagas para os próximos 30.000 km já incluído.',
        destaque: false
    },
    {
        marca: 'Volkswagen',
        modelo: 'Virtus GTS 1.4 TSI',
        ano: 2023,
        km: 9500,
        preco: 134900,
        cor: 'Vermelho',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Volkswagen Virtus GTS 2023, a versão esportiva do sedã alemão. Motor 1.4 TSI turbo com 150 cavalos de potência e 25,5 kgfm de torque, aceleração de 0-100km/h em 8,2 segundos. Câmbio automático Tiptronic de 6 marchas com modo manual e paddle shifts no volante. Suspensão esportiva rebaixada, freios a disco nas 4 rodas com sistema ABS e EBD, controle eletrônico de estabilidade (ESC), assistente de partida em rampa. Interior com bancos esportivos com logo GTS, volante multifuncional com base achatada, pedais esportivos em alumínio, painel digital Active Info Display de 10,25 polegadas totalmente configurável, central multimídia Composition Media de 10,1 polegadas. Ar-condicionado Climatronic dual zone, teto solar elétrico panorâmico, sensor de estacionamento traseiro com câmera, faróis full LED com DRL em formato de C. Rodas de liga leve aro 17 diamantadas. Garantia VW até 2026.',
        destaque: true
    },
    {
        marca: 'Chevrolet',
        modelo: 'Onix Plus Premier',
        ano: 2023,
        km: 8900,
        preco: 89900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Chevrolet Onix Plus Premier 2023 praticamente zero quilômetro. Motor 1.0 Turbo flex de 116 cavalos com câmbio automático de 6 marchas. Central multimídia MyLink 2.0 de 8 polegadas com Wi-Fi nativo 4G, sistema OnStar com conectividade total e emergência automática, carregamento de celular wireless por indução, ar-condicionado digital automático, sensor de chuva e crepuscular com acionamento automático de faróis e limpadores, volante multifuncional revestido em couro com aquecimento, bancos dianteiros com ajuste de altura, porta-malas de 469 litros. Faróis de LED com função auto high beam, rodas de liga leve aro 16, retrovisores elétricos com rebatimento automático. 6 airbags de série. Consumo médio: 13,2 km/l (etanol) e 14,5 km/l (gasolina). Garantia de fábrica até 2026. Oportunidade única, veículo semi-novo com preço de usado!',
        destaque: true
    },

    // SUVS COMPACTOS
    {
        marca: 'Honda',
        modelo: 'HR-V Touring 1.5 Turbo',
        ano: 2022,
        km: 22100,
        preco: 149900,
        cor: 'Azul',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Honda HR-V Touring 2022, versão topo de linha do SUV compacto mais desejado do Brasil. Motor 1.5 VTEC Turbo flex de 177 cavalos e 24,5 kgfm de torque, câmbio CVT com 7 marchas simuladas e modo Sport. Pacote completo Honda Sensing (frenagem automática de emergência, assistente de permanência em faixa, controle de cruzeiro adaptativo, alerta de atenção do motorista). Teto solar elétrico panorâmico com abertura total, bancos revestidos em couro legítimo com ajustes elétricos e memória, ar-condicionado digital dual zone com saídas traseiras, central multimídia de 8 polegadas com Apple CarPlay e Android Auto wireless, sistema de som premium com 8 alto-falantes, rodas de liga leve aro 18 diamantadas. Faróis full LED com farol alto automático, lanternas LED tridimensionais. Magic Seats com 6 configurações diferentes. Único dono, manual e chave reserva, IPVA 2024 quitado.',
        destaque: true
    },
    {
        marca: 'Nissan',
        modelo: 'Kicks SV Limited',
        ano: 2022,
        km: 31500,
        preco: 109900,
        cor: 'Vermelho',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Nissan Kicks SV Limited 2022, edição especial com itens exclusivos. Motor 1.6 flex de 114 cavalos com câmbio CVT (consumo médio de 15,2 km/l). Ar-condicionado digital automático, central multimídia de 8 polegadas com Android Auto e Apple CarPlay, câmera de visão 360 graus Around View Monitor com detecção de objetos, sensores de estacionamento dianteiros e traseiros com alerta sonoro progressivo, freio de estacionamento eletrônico com função Auto Hold, controle de tração e estabilidade, 6 airbags, banco do motorista com ajuste de altura, volante multifuncional revestido em couro com comandos de áudio e telefone. Rodas de liga leve aro 16 exclusivas da versão Limited, acabamento interno diferenciado com costuras contrastantes. Revisões em dia na Nissan. Pneus Goodyear novos (trocados com 28.000 km). Manual do proprietário, chave reserva codificada. Aceito financiamento pelo banco de sua preferência.',
        destaque: false
    },
    {
        marca: 'Hyundai',
        modelo: 'Creta Prestige 2.0',
        ano: 2023,
        km: 15200,
        preco: 144900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Hyundai Creta Prestige 2.0 2023, SUV topo de linha da Hyundai. Motor 2.0 aspirado flex de 167 cavalos com câmbio automático de 6 marchas. Teto solar panorâmico com acionamento elétrico e função anti-esmagamento, bancos revestidos em couro premium com aquecimento nos dianteiros, carregamento de celular wireless, painel digital de 10,25 polegadas totalmente configurável (Digital Cluster), central multimídia de 10,25 polegadas widescreen com Bluelink (conectividade total via app), sistema de som premium Bose com 8 alto-falantes e subwoofer, ar-condicionado digital dual zone com controle automático de temperatura. Faróis full LED com DRL em formato de LED, lanternas LED, rodas de liga leve aro 18 diamantadas. Sensor de estacionamento 360° com câmera de alta resolução. Garantia de fábrica de 5 anos sem limite de quilometragem. Veículo de único dono, revisões em dia, procedência comprovada.',
        destaque: true
    },
    {
        marca: 'Volkswagen',
        modelo: 'T-Cross Highline 1.4 TSI',
        ano: 2022,
        km: 27800,
        preco: 124900,
        cor: 'Cinza',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Volkswagen T-Cross Highline 2022, o SUV compacto alemão premium. Motor 1.4 TSI turbo flex de 150 cavalos e 25 kgfm de torque, câmbio automático Tiptronic de 6 marchas com modo manual. Central multimídia Composition de 10,1 polegadas com controle por gestos, Active Info Display (painel digital configur ável) de 10,25 polegadas, ar-condicionado digital Climatronic dual zone, controle de velocidade de cruzeiro ACC (adaptativo com frenagem automática), sensor de estacionamento traseiro Park Distance Control, câmera de ré com linhas dinâmicas, Park Assist (estacionamento semiautomático), faróis de LED com função Coming/Leaving Home, rodas de liga leve aro 17 Braga, bancos em tecido premium com costuras contrastantes. App Connect wireless (Android Auto e Apple CarPlay sem fio). Porta-malas de 455 litros expansível. Revisões realizadas na concessionária VW, histórico completo de manutenção disponível.',
        destaque: false
    },
    {
        marca: 'Jeep',
        modelo: 'Renegade Sport 1.8',
        ano: 2023,
        km: 12400,
        preco: 119900,
        cor: 'Laranja',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Jeep Renegade Sport 2023 na exclusiva cor Volcano Orange (laranja metálico). Motor 1.8 E.torQ flex de 139 cavalos com câmbio automático de 6 marchas. Ar-condicionado com controle manual, direção elétrica progressiva, vidros e travas elétricas nas 4 portas com acionamento one-touch, central multimídia Uconnect de 7 polegadas touchscreen com Android Auto e Apple CarPlay via cabo USB, bluetooth para streaming de áudio, volante multifuncional revestido em couro ecológico com comandos de áudio, telefone e cruise control, rodas de aço aro 16 com calotas exclusivas Jeep. Controles eletrônicos de tração (ESC) e estabilidade (TCS), 4 airbags frontais e laterais, sensores de pressão dos pneus (TPMS). Faróis com máscara negra, grade frontal com as tradicionais 7 aberturas Jeep. Garantia de fábrica até 2026. Ideal para quem busca um SUV robusto com design único e preço acessível.',
        destaque: false
    },
    {
        marca: 'Peugeot',
        modelo: '2008 Griffe 1.6 AT6',
        ano: 2022,
        km: 28900,
        preco: 114900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Peugeot 2008 Griffe 2022, SUV francês com design diferenciado. Motor 1.6 flex de 118 cavalos com câmbio automático de 6 marchas. Peugeot i-Cockpit 3D: painel digital tridimensional de 10 polegadas com efeito 3D, central multimídia touchscreen de 10 polegadas com navegação GPS integrada, volante compacto multifuncional (conceito exclusivo Peugeot), teto solar panorâmico em vidro com acionamento elétrico, bancos revestidos em couro com costuras contrastantes, ar-condicionado digital automático dual zone. Controle de voz em português para comandar multimídia, navegação e telefone. Grip Control: sistema de controle de tração com 5 modos (Normal, Neve, Lama, Areia e ESP Off), ideal para estradas de terra. Park Assist: estacionamento semiautomático com sensores dianteiros e traseiros, espelhos retrovisores com rebatimento elétrico e memória. Design único e tecnologia de ponta. Revisões na concessionária Peugeot em dia.',
        destaque: false
    },
    {
        marca: 'Fiat',
        modelo: 'Pulse Abarth 1.3 Turbo',
        ano: 2023,
        km: 6500,
        preco: 134900,
        cor: 'Preto',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Fiat Pulse Abarth 2023, o SUV esportivo da Fiat com a preparação exclusiva Abarth! Motor 1.3 Turbo T270 flex de 185 cavalos de potência e 27 kgfm de torque, aceleração de 0 a 100 km/h em apenas 7,4 segundos, velocidade máxima de 210 km/h. Câmbio CVT com modo Sport, paddle shifts (borboletas) atrás do volante para trocas manuais, suspensão esportiva rebaixada 20mm com amortecedores esportivos, freios Brembo de alto desempenho. Bancos esportivos Abarth com logo bordado e suporte lateral reforçado, sistema de som JBL premium com 8 alto-falantes e subwoofer, teto solar elétrico panorâmico, volante esportivo revestido em couro com base achatada. Acabamento externo exclusivo: grade frontal Abarth, para-choques diferenciados, aerofólio traseiro esportivo, difusor traseiro, ponteiras de escapamento duplas cromadas, rodas de liga leve aro 18 diamantadas. Pintura preta com detalhes vermelhos Abarth (retrovisores, calotas de freio, emblemas). Garantia de fábrica até 2026.',
        destaque: true
    },

    // HATCHES COMPACTOS
    {
        marca: 'Hyundai',
        modelo: 'HB20 Comfort Plus 1.0',
        ano: 2023,
        km: 5800,
        preco: 74900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Hyundai HB20 Comfort Plus 1.0 2023 praticamente zero! Motor 1.0 aspirado de 12 válvulas flex com 80 cavalos, câmbio manual de 5 marchas. Ar-condicionado com controle manual, direção elétrica progressiva com ajuste de altura e profundidade, vidros elétricos nas 4 portas com acionamento one-touch no motorista, travas elétricas, alarme de fábrica com imobilizador eletrônico, central multimídia Bluelink de 8 polegadas com Android Auto, Apple CarPlay e espelhamento wireless, câmera de ré com linhas de distância, 4 alto-falantes, bluetooth, entrada USB, volante multifuncional com comandos de áudio e telefone. Faróis com máscara negra, grade frontal cascata moderna, rodas de aço aro 14 com calotas. Computador de bordo com informações de consumo médio, autonomia e velocidade média. Garantia Hyundai de 5 anos ou 100.000 km. Consumo médio: 14,2 km/l na cidade. Perfeito como primeiro carro ou para uso urbano. Procedência, único dono.',
        destaque: false
    },
    {
        marca: 'Fiat',
        modelo: 'Argo Trekking 1.3',
        ano: 2023,
        km: 12400,
        preco: 79900,
        cor: 'Vermelho',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Fiat Argo Trekking 1.3 2023, a versão aventureira do hatch italiano. Motor Firefly 1.3 flex de 109 cavalos com câmbio CVT simulando 7 marchas. Design diferenciado com suspensão elevada em 25mm, proteções de caçamba dianteira e traseira em plástico preto fosco, rack de teto longitudinal em alumínio, frisos laterais de proteção, para-lamas alargados. Central multimídia Uconnect de 7 polegadas com Android Auto e Apple CarPlay, ar-condicionado digital automático, sensor de chuva e crepuscular, volante multifuncional revestido em couro, bancos com revestimento exclusivo Trekking em tecido impermeável. Rodas de liga leve aro 15 com pneus de perfil mais alto. Modo de condução Grip (facilita saída em trechos com baixa aderência como areia, lama ou neve). Ideal para quem gosta de aventura urbana e estradas de terra nos finais de semana. Consumo médio: 12,5 km/l. Garantia Fiat até 2026.',
        destaque: false
    },
    {
        marca: 'Volkswagen',
        modelo: 'Polo Highline 1.0 TSI',
        ano: 2023,
        km: 9200,
        preco: 94900,
        cor: 'Azul',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Volkswagen Polo Highline 1.0 TSI 2023, hatch premium alemão. Motor 1.0 TSI turbo de 3 cilindros flex com 128 cavalos e 20 kgfm de torque, câmbio automático de 6 marchas. Central multimídia Composition Media de 10,1 polegadas com wireless Android Auto e Apple CarPlay (espelhamento sem fio), ar-condicionado digital Climatronic com controle automático de temperatura, bancos dianteiros com ajuste de altura, volante multifuncional revestido em couro com base achatada e comandos touch, faróis full LED com DRL integrado e função auto high beam, lanternas LED com efeito 3D, rodas de liga leve aro 16 diamantadas modelo Braga. Porta-malas de 300 litros. Sensor de estacionamento traseiro com aviso sonoro, computador de bordo multifuncional, sistema Start/Stop para economia de combustível. Consumo médio: 13,5 km/l (urbano) e 15,8 km/l (rodoviário). Garantia VW até 2026. Veículo semi-novo, único dono, procedência total.',
        destaque: false
    },
    {
        marca: 'Renault',
        modelo: 'Kwid Intense 1.0',
        ano: 2023,
        km: 7200,
        preco: 64900,
        cor: 'Laranja',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Renault Kwid Intense 1.0 2023, o hatch mais econômico e moderno da categoria. Motor 1.0 SCe de 12v flex com 70 cavalos, câmbio manual de 5 marchas. Ar-condicionado com controle manual, direção elétrica, vidros elétricos dianteiros, travas elétricas nas 4 portas, central multimídia Media Evolution de 8 polegadas com Android Auto, Apple CarPlay e espelhamento wireless, câmera de ré integrada com linhas de distância, bluetooth, entrada USB-C, 4 alto-falantes. Computador de bordo com informações de consumo instantâneo e médio. Faróis com máscara negra, grade frontal moderna, rodas de aço aro 14 com calotas exclusivas Intense. Airbags frontais, freios ABS com EBD, alarme de fábrica. Consumo médio impressionante: 15,3 km/l (gasolina) e 14,1 km/l (etanol) - um dos mais econômicos do Brasil! Porta-malas de 290 litros. Garantia Renault de 3 anos. Ideal para uso urbano e economia máxima. Procedência comprovada, aceito financiamento.',
        destaque: false
    },

    // SUVS MÉDIOS
    {
        marca: 'Jeep',
        modelo: 'Compass Limited 2.0 Diesel 4x4',
        ano: 2021,
        km: 41800,
        preco: 159900,
        cor: 'Cinza',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Jeep Compass Limited Diesel 4x4 2021, SUV premium com tração nas 4 rodas. Motor 2.0 Turbodiesel Multijet de 170 cavalos e incríveis 35,7 kgfm de torque, câmbio automático de 9 marchas ZF, tração 4x4 ativa automática (liga quando detecta perda de aderência). Sistema Selec-Terrain com 5 modos de condução: Auto, Snow, Sand, Mud e 4WD Lock. Bancos revestidos em couro legítimo com logo Jeep bordado, teto solar elétrico panorâmico com abertura total, central multimídia Uconnect de 8,4 polegadas NAV com navegação GPS integrada e mapas atualizáveis, carregamento de celular wireless por indução, ar-condicionado digital dual zone, volante multifuncional revestido em couro com aquecimento para dias frios, sensor de estacionamento dianteiro e traseiro, câmera de ré com linhas dinâmicas, partida remota via chave (liga o carro à distância), keyless entry and go (abre e liga sem usar a chave). Rodas de liga leve aro 18 diamantadas. Consumo diesel: 13 km/l urbano e 17 km/l rodoviário. Revisões Jeep em dia.',
        destaque: false
    },
    {
        marca: 'Volkswagen',
        modelo: 'Taos Highline 1.4 TSI',
        ano: 2023,
        km: 18200,
        preco: 179900,
        cor: 'Cinza',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Volkswagen Taos Highline 2023, SUV médio premium da Volkswagen. Motor 1.4 TSI turbo flex de 150 cavalos e 25 kgfm de torque, câmbio automático Tiptronic de 6 marchas com modo manual. Teto solar panorâmico elétrico em vidro temperado com abertura total e função anti-esmagamento, bancos em couro premium com costuras contrastantes, Digital Cockpit (painel 100% digital) de 10,25 polegadas totalmente configurável, central multimídia Discover Media de 10,1 polegadas com navegação GPS e controle por gestos, ar-condicionado digital Climatronic tri-zone (3 zonas independentes de temperatura), sistema de som Beats Audio premium com 8 alto-falantes e subwoofer. Park Assist (estacionamento automático), câmera de ré Area View com visão 360°, sensores de estacionamento 12 pontos (dianteiros, traseiros e laterais). Faróis full LED Matrix com farol alto automático seletivo, rodas de liga leve aro 18 Sebring diamantadas. Porta-malas de 498 litros. Garantia VW até 2026. Top de linha!',
        destaque: true
    },
    {
        marca: 'Caoa Chery',
        modelo: 'Tiggo 7 Sport 1.5 Turbo',
        ano: 2022,
        km: 25600,
        preco: 134900,
        cor: 'Azul',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Caoa Chery Tiggo 7 Sport 2022, SUV chinês com melhor custo-benefício do mercado. Motor 1.5 TGDI turbo flex de 152 cavalos e 23 kgfm de torque, câmbio automático CVT com simulação de 9 marchas e modo Sport. Teto solar elétrico panorâmico, bancos revestidos em couro ecológico com ajustes elétricos no banco do motorista, central multimídia de 10,25 polegadas com Android e iOS conectividade, câmera 360° com visão aérea (4 câmeras ao redor do veículo), sensor de estacionamento dianteiro e traseiro com alerta visual e sonoro, ar-condicionado digital automático dual zone, cruise control adaptativo ACC com frenagem automática, assistente de manutenção de faixa (LKA), alerta de colisão frontal (FCW), monitoramento de ponto cego (BSD). Faróis full LED com DRL, rodas de liga leve aro 18 diamantadas. Porta-malas de 475 litros. Garantia Caoa Chery de 5 anos ou 150.000 km (a maior do segmento!). Revisões com espaçamento de 10.000 km, manutenção econômica.',
        destaque: false
    },
    {
        marca: 'Volkswagen',
        modelo: 'Nivus Highline 1.0 TSI',
        ano: 2022,
        km: 31200,
        preco: 119900,
        cor: 'Cinza',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Volkswagen Nivus Highline 2022, o SUV cupê alemão com design diferenciado. Motor 1.0 TSI turbo de 128 cavalos e 20 kgfm de torque, câmbio automático de 6 marchas. Design cupê esportivo com teto descendente, spoiler traseiro integrado, para-choque traseiro com difusor e ponteiras cromadas. Central multimídia VW Play de 10,1 polegadas com sistema operacional próprio VW, GPS integrado, reconhecimento de voz em português, wireless Android Auto e Apple CarPlay, ar-condicionado digital Climatronic com sensor de qualidade do ar, Digital Cockpit (painel digital) de 10,25 polegadas personalizável. Volante multifuncional com base achatada estilo esportivo, cruise control adaptativo ACC com frenagem automática, sensor de estacionamento traseiro, câmera de ré HD, sensor de chuva e crepuscular. Faróis full LED com assinatura em C, rodas de liga leve aro 17 Kufstein. Porta-malas de 415 litros. Consumo médio: 13km/l. Revisões VW em dia. Aceito troca.',
        destaque: false
    },
    {
        marca: 'Chevrolet',
        modelo: 'Tracker Premier 1.2 Turbo',
        ano: 2022,
        km: 24600,
        preco: 139900,
        cor: 'Vermelho',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Chevrolet Tracker Premier 2022, SUV médio topo de linha da Chevrolet. Motor 1.2 Turbo flex de 133 cavalos e 21 kgfm de torque, câmbio automático de 6 marchas. Teto solar panorâmico elétrico com abertura total, bancos revestidos em couro premium com ajustes elétricos e memória no banco do motorista, carregamento de celular wireless por indução, central multimídia MyLink 2.0 de 10,25 polegadas widescreen com sistema OnStar integrado (Wi-Fi 4G nativo, rastreamento, chamadas de emergência automáticas), ar-condicionado digital dual zone com controle independente. Painel de instrumentos digital de 8 polegadas configurável. Faróis full LED com DRL integrado e farol alto automático, rodas de liga leve aro 17 diamantadas, retrovisores elétricos com rebatimento automático e setas integradas. Sensor de estacionamento traseiro, câmera de ré HD, controle de velocidade cruise control. Porta-malas de 430 litros. Único dono, todas as revisões na Chevrolet. IPVA quitado.',
        destaque: true
    },

    // PICAPES
    {
        marca: 'Toyota',
        modelo: 'Hilux SRX 2.8 Diesel 4x4',
        ano: 2022,
        km: 38500,
        preco: 289900,
        cor: 'Branco',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Toyota Hilux SRX 2.8 Diesel 4x4 2022, a picape mais vendida e confiável do Brasil! Motor 2.8 turbodiesel de 16 válvulas com 204 cavalos de potência e impressionantes 51 kgfm de torque, câmbio automático de 6 marchas com modo sequencial e reduzida. Tração 4x4 com reduzida, ideal para off-road. Cabine dupla com 5 lugares em couro legítimo, ar-condicionado digital dual zone, central multimídia Toyota de 8 polegadas touchscreen com Android Auto e Apple CarPlay, câmera de visão traseira com linhas dinâmicas e visão 360 graus (4 câmeras), sensores de estacionamento dianteiros e traseiros, controle de velocidade adaptativo, assistente de descida em declive (DAC), controle de tração ativo A-TRAC. Caçamba de 1.550mm revestida em plástico resistente, capacidade de carga de 1 tonelada. Faróis de LED com limpadores integrados, rodas de liga leve aro 18. Consumo diesel: 10 km/l urbano e 14 km/l rodoviário. Revisões Toyota em dia, procedência total. Aceito veículo de menor valor como parte do pagamento.',
        destaque: true
    },
    {
        marca: 'Ford',
        modelo: 'Ranger XLT 2.2 Diesel 4x4',
        ano: 2021,
        km: 52100,
        preco: 239900,
        cor: 'Prata',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Ford Ranger XLT 2.2 Diesel 4x4 2021, picape robusta e confiável. Motor 2.2 Duratorq turbodiesel de 160 cavalos e 39 kgfm de torque, câmbio automático SelectShift de 6 marchas com modo manual via alavanca, tração 4x4 selecionável com reduzida disponível. Cabine dupla com 5 lugares, bancos em tecido resistente, ar-condicionado com controle manual, central multimídia SYNC 3 da Ford de 8 polegadas com Android Auto e Apple CarPlay, bluetooth, USB, câmera de ré, 6 alto-falantes. Volante multifuncional revestido em couro com comandos de áudio e telefone, controle eletrônico de estabilidade (ESC) e tração (TCS), assistente de partida em rampa, 6 airbags. Caçamba reforçada com capacidade de 1.180 kg de carga. Rodas de liga leve aro 17, para-choque cromado com protetor inferior, estribos laterais. Consumo diesel: 9,5 km/l urbano e 13 km/l rodoviário. Revisões realizadas na Ford. Ótimo estado de conservação, pronta para trabalho.',
        destaque: false
    },
    {
        marca: 'Chevrolet',
        modelo: 'S10 High Country 2.8 Diesel 4x4',
        ano: 2022,
        km: 44300,
        preco: 259900,
        cor: 'Preto',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Chevrolet S10 High Country 2.8 Diesel 4x4 2022, a versão premium da picape da Chevrolet. Motor 2.8 Duramax turbodiesel de 200 cavalos e 51 kgfm de torque, câmbio automático de 6 marchas, tração 4x4 automática com reduzida eletrônica. Cabine dupla de luxo: bancos revestidos em couro premium com costuras contrastantes e logo High Country bordado, ar-condicionado digital dual zone, central multimídia MyLink de 8 polegadas com OnStar e Wi-Fi 4G, carregamento de celular wireless, câmera de ré com linhas dinâmicas, sensores de estacionamento traseiros. Painel de instrumentos com tela digital de 8 polegadas. Rodas de liga leve aro 18 cromadas exclusivas High Country, estribos laterais cromados, grade frontal cromada com dupla barra horizontal, para-choques cromados. Caçamba reforçada com tampa marítima rígida (hard cover) inclusa. Controle de descida, assistente de partida em rampa, controle eletrônico de estabilidade. Consumo diesel: 10 km/l médio. Revisões Chevrolet em dia.',
        destaque: false
    },
    {
        marca: 'Mitsubishi',
        modelo: 'L200 Triton Sport 2.4 Diesel 4x4',
        ano: 2021,
        km: 56700,
        preco: 229900,
        cor: 'Cinza',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Mitsubishi L200 Triton Sport 2.4 Diesel 4x4 2021, picape japonesa robusta e econômica. Motor 2.4 MIVEC turbodiesel de 190 cavalos e 43,5 kgfm de torque (maior torque da categoria na época), câmbio automático de 6 marchas com modo manual e paddle shifts, tração 4x4 Super Select com 4 modos (2WD, 4WD alta, 4WD alta com bloqueio central, 4WD baixa com reduzida). Cabine dupla com 5 lugares em couro, ar-condicionado digital automático, central multimídia Mitsubishi de 7 polegadas com smartphone link (Android e iOS), câmera de ré, bluetooth, entrada USB e AUX, 4 alto-falantes. Controle de cruzeiro, volante multifuncional em couro, computador de bordo. Rodas de liga leve aro 17, estribos laterais, para-lama alargado. Caçamba com capacidade de 1 tonelada de carga útil. Sistemas de segurança: ABS, EBD, controle de estabilidade e tração, assistente de partida em rampa, 7 airbags. Consumo diesel: 11 km/l médio. Revisões Mitsubishi.',
        destaque: false
    },

    // SUVS GRANDES/PREMIUM
    {
        marca: 'Toyota',
        modelo: 'SW4 Diamond 2.8 Diesel 4x4',
        ano: 2022,
        km: 35400,
        preco: 379900,
        cor: 'Branco',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Toyota SW4 Diamond 2.8 Diesel 4x4 2022, o SUV 7 lugares mais desejado do Brasil! Versão topo de linha Diamond. Motor 2.8 turbodiesel de 204 cavalos e 51 kgfm de torque, câmbio automático de 6 marchas, tração 4x4 com reduzida e bloqueio do diferencial traseiro. TRÊS FILEIRAS DE BANCOS em couro premium com capacidade para 7 ocupantes, ar-condicionado digital tri-zone (3 zonas independentes), teto solar elétrico panorâmico, central multimídia Toyota de 9 polegadas com navegação GPS, sistema de som JBL premium com 11 alto-falantes e subwoofer, câmera 360° Multi-Terrain Monitor (visão de todas as direções), carregamento wireless. Painel digital de 4,2 polegadas multi-informação. Volante aquecido (ótimo para frio), bancos dianteiros com ventilação e aquecimento, banco do motorista com ajustes elétricos e memória. Faróis LED adaptativos com lavadores de alta pressão, rodas de liga leve aro 18 cromadas. Sistema Toyota Safety Sense (frenagem automática, controle adaptativo, alerta de faixa). Porta-malas de 200L (7 lugares) expansível até 1.970L.',
        destaque: true
    },
    {
        marca: 'Jeep',
        modelo: 'Grand Cherokee Laredo 3.6 V6',
        ano: 2022,
        km: 28800,
        preco: 349900,
        cor: 'Preto',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Jeep Grand Cherokee Laredo 2022, SUV premium americano. Motor 3.6 V6 Pentastar flex de 295 cavalos e 35,4 kgfm de torque, câmbio automático de 8 marchas, tração 4x4 automática Quadra-Trac II com Selec-Terrain (5 modos de condução). Interior em couro Nappa premium, ar-condicionado digital tri-zone, central multimídia Uconnect 4C NAV de 8,4 polegadas com navegação 3D e mapas atualizáveis, sistema de som premium Alpine com 9 alto-falantes, teto solar elétrico Comando View duplo (dianteiro e traseiro), volante multifuncional aquecido com paddle shifts em alumínio, bancos dianteiros com 8 ajustes elétricos, memória e aquecimento. Tecnologias de segurança avançadas: frenagem automática de emergência, controle de cruzeiro adaptativo, alerta de ponto cego, alerta de tráfego cruzado traseiro, sensor de estacionamento dianteiro e traseiro, câmera de ré HD. Faróis bi-xenon adaptativos com lavadores, rodas de liga leve aro 20 diamantadas. Porta-malas de 968 litros. Consumo: 8 km/l urbano (gasolina).',
        destaque: true
    },

    // CARROS COMPACTOS ECONÔMICOS
    {
        marca: 'Fiat',
        modelo: 'Mobi Like 1.0',
        ano: 2023,
        km: 8500,
        preco: 59900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Fiat Mobi Like 1.0 2023, o carro perfeito para iniciantes e uso urbano! Motor 1.0 Firefly de 8v flex com 75 cavalos, câmbio manual de 5 marchas. Ar-condicionado, direção elétrica, vidros elétricos dianteiros, travas elétricas, central multimídia Uconnect de 7 polegadas com Android Auto, Apple CarPlay e câmera de ré integrada, bluetooth, entrada USB. Airbags frontais motorista e passageiro, freios ABS com EBD, cintos de segurança dianteiros com pré-tensionadores. Volante com ajuste de altura, computador de bordo com informações de consumo e autonomia. Design compacto perfeito para estacionar na cidade (3,60m de comprimento). Consumo médio excelente: 15,1 km/l (gasolina) e 13,8 km/l (etanol). Porta-malas de 235 litros. Garantia Fiat de 3 anos. Baixo custo de manutenção, peças acessíveis. IPVA e seguro baratos. Ideal como primeiro carro ou segundo carro da família. Aceito financiamento com entrada a partir de R$ 5.000.',
        destaque: false
    },
    {
        marca: 'Volkswagen',
        modelo: 'Gol 1.0 MPI',
        ano: 2023,
        km: 11200,
        preco: 64900,
        cor: 'Prata',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Volkswagen Gol 1.0 MPI 2023, o hatch mais vendido da história do Brasil em versão moderna! Motor 1.0 MPI de 12v flex com 84 cavalos (gasolina) e 82 cv (etanol), câmbio manual de 5 marchas. Ar-condicionado, direção elétrica progressiva, vidros elétricos nas 4 portas com acionamento one-touch, travas elétricas com alarme de fábrica, central multimídia Composition Touch de 6,5 polegadas com bluetooth, entrada USB, espelhamento de celular, 4 alto-falantes. Airbags frontais, freios ABS com EBD, controle eletrônico de estabilidade (ESC), assistente de partida em rampa. Volante multifuncional com comandos de áudio, computador de bordo. Rodas de aço aro 14 com calotas. Porta-malas de 285 litros. Consumo médio: 14,3 km/l (cidade) e 16,8 km/l (estrada) com gasolina. Garantia VW de 3 anos. Baixo custo de manutenção, rede de concessionárias VW em todo Brasil, peças facilmente encontradas. Pronto para rodar!',
        destaque: false
    },
    {
        marca: 'Chevrolet',
        modelo: 'Onix 1.0 Turbo LT',
        ano: 2023,
        km: 14500,
        preco: 79900,
        cor: 'Vermelho',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Chevrolet Onix 1.0 Turbo LT 2023, o hatch mais vendido do Brasil! Motor 1.0 Turbo flex de 116 cavalos de potência e 16,8 kgfm de torque, câmbio manual de 6 marchas. Ar-condicionado com controle manual, direção elétrica, vidros elétricos nas 4 portas, travas elétricas, alarme com imobilizador, central multimídia MyLink de 8 polegadas touchscreen com Android Auto, Apple CarPlay e Chevrolet Infotainment 3 (CI3), bluetooth, entrada USB, 4 alto-falantes. 6 airbags de série (frontais, laterais e de cortina), freios ABS com EBD, controle de estabilidade e tração, assistente de partida em rampa, sensor de pressão dos pneus. Volante multifuncional ajustável em altura, computador de bordo completo. Rodas de aço aro 15 com calotas. Porta-malas de 303 litros. Consumo urbano de 12,5 km/l. Garantia Chevrolet de 3 anos. Revisões com espaçamento de 15.000 km ou 1 ano. Imbatível em custo-benefício!',
        destaque: false
    },

    // SEDÃS EXECUTIVOS
    {
        marca: 'Toyota',
        modelo: 'Camry XLE 3.5 V6',
        ano: 2022,
        km: 22400,
        preco: 249900,
        cor: 'Preto',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Toyota Camry XLE 3.5 V6 2022, sedã executivo premium japonês. Motor 3.5 V6 a gasolina com 301 cavalos de potência e 36,3 kgfm de torque, câmbio automático de 8 marchas com paddle shifts. Aceleração de 0 a 100 km/h em 6 segundos. Interior em couro premium com bancos dianteiros elétricos com 8 ajustes, memória, aquecimento e ventilação, ar-condicionado digital tri-zone, teto solar elétrico panorâmico, central multimídia Toyota de 9 polegadas com navegação GPS, sistema de som premium JBL com 9 alto-falantes, carregamento wireless, head-up display (projeção de informações no para-brisa). Painel digital TFT de 7 polegadas multi-informação. Toyota Safety Sense 2.0: controle de cruzeiro adaptativo inteligente, pré-colisão com detecção de pedestres, assistente de manutenção de faixa, farol alto automático, alerta de ponto cego, alerta de tráfego cruzado. Faróis full LED adaptativos com lavadores, rodas de liga leve aro 18 diamantadas. Porta-malas de 524 litros. Acabamento interno com madeira nobre e alumínio escovado. Consumo: 9 km/l urbano.',
        destaque: true
    },
    {
        marca: 'Honda',
        modelo: 'Accord EX 2.0 Turbo',
        ano: 2021,
        km: 38700,
        preco: 209900,
        cor: 'Cinza',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Honda Accord EX 2.0 Turbo 2021, sedã executivo espo rtivo. Motor 2.0 VTEC Turbo a gasolina com 261 cavalos e 37,7 kgfm de torque, câmbio automático de 10 marchas com paddle shifts. Performance esportiva: 0-100 km/h em 6,5 segundos. Bancos em couro perfurado, bancos dianteiros com ventilação, aquecimento e ajustes elétricos com memória, ar-condicionado digital dual zone, teto solar elétrico, central multimídia Honda de 8 polegadas com Apple CarPlay e Android Auto wireless, sistema de som premium com 10 alto-falantes. Painel digital de 7 polegadas TFT multi-informação. Honda Sensing completo: frenagem automática de emergência, controle de cruzeiro adaptativo com low-speed follow, assistente de centralização em faixa, reconhecimento de placas, alerta de atenção do motorista. Head-up display colorido. Faróis full LED adaptativos, rodas de liga leve aro 19 esportivas. Porta-malas de 473 litros. Suspensão esportiva independente nas 4 rodas. Revisões Honda, procedência total.',
        destaque: false
    },

    // CARROS ESPORTIVOS/DIFERENCIADOS  
    {
        marca: 'Mini',
        modelo: 'Cooper S 2.0 Turbo',
        ano: 2022,
        km: 15800,
        preco: 189900,
        cor: 'Vermelho',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Mini Cooper S 2.0 Turbo 2022, o icônico hatch premium inglês! Motor 2.0 TwinPower Turbo a gasolina de 192 cavalos e 28,5 kgfm de torque, câmbio automático Steptronic de 7 marchas com paddle shifts e modo Sport. Aceleração explosiva: 0-100 km/h em 6,7 segundos, velocidade máxima de 233 km/h. Design exclusivo Mini com teto branco contrastante, grade frontal cromada com luzes de LED integradas, faróis de LED circulares clássicos, rodas de liga leve aro 17 Black Turnstyle. Interior premium: bancos esportivos em couro e tecido Dinamica com costuras contrastantes vermelhas, volante esportivo em couro com base achatada, central multimídia circular de 8,8 polegadas (conceito exclusivo Mini) com sistema operacional próprio, ar-condicionado digital, teto solar elétrico panorâmico. Sistema de som Harman Kardon premium com 12 alto-falantes. Modo de condução Sport (acelere mais rápido, direção mais pesada, escape mais esportivo). Consumo: 11 km/l médio. Diversão ao dirigir garantida! Revisões Mini em dia.',
        destaque: true
    },
    {
        marca: 'Volkswagen',
        modelo: 'Jetta GLI 2.0 TSI',
        ano: 2022,
        km: 21500,
        preco: 174900,
        cor: 'Branco',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Volkswagen Jetta GLI 2.0 TSI 2022, o sedã esportivo alemão! Motor 2.0 TSI turbo a gasolina de 230 cavalos e 35,7 kgfm de torque, câmbio automático DSG de dupla embreagem com 7 marchas e paddle shifts. Aceleração: 0-100 km/h em 6,6 segundos, velocidade máxima de 241 km/h. Design esportivo GLI: grade frontal favo de mel com acabamento preto brilhante, para-choques diferenciados com entradas de ar maiores, difusor traseiro, spoiler traseiro, 4 ponteiras de escapamento cromadas, badge GLI vermelho. Rodas de liga leve aro 18 Pretoria diamantadas. Interior esportivo: bancos Tartan (xadrez vermelho e preto - trademark GLI), volante R-Line com base achatada, pedais em alumínio, costuras vermelhas. Digital Cockpit Pro de 10,25 polegadas, central multimídia Discover Media de 10 polegadas, ar digital, teto solar. Suspensão esportiva, freios a disco ventilados nas 4 rodas. Modo de condução Sport. Consumo: 10 km/l. O GLI mais moderno já vendido no Brasil!',
        destaque: true
    }
];

console.log(`\n📋 Total de veículos preparados: ${vehicles.length}`);
console.log('✅ Dados completos para adicionar manualmente via painel admin\n');

// Salvar para referência
const fs = require('fs');
fs.writeFileSync('vehicles-final.json', JSON.stringify(vehicles, null, 2));
console.log('💾 Dados salvos em vehicles-final.json\n');
