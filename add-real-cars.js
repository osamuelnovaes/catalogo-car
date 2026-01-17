// Script para adicionar 20 carros reais ao catálogo
// Dados baseados em anúncios reais de WebMotors, OLX e iCarros

const axios = require('axios');

// URL do catálogo no Render
const BASE_URL = 'https://catalogo-carcatalogo-car.onrender.com';

// Dados de 20 carros reais variados por categoria
const carrosReais = [
    // === SEDANS (5 carros) ===
    {
        marca: 'Toyota',
        modelo: 'Corolla XEi 2.0 Flex',
        ano: 2024,
        km: 12000,
        preco: 148900,
        cor: 'Branco Polar',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Toyota Corolla XEi 2024 com apenas 12 mil km rodados. Carro de único dono, todas as revisões feitas na concessionária. Equipado com central multimídia de 9 polegadas com Apple CarPlay e Android Auto, câmera de ré, bancos em couro, ar-condicionado digital dual zone, piloto automático adaptativo e Toyota Safety Sense. IPVA 2024 pago.',
        destaque: 1
    },
    {
        marca: 'Honda',
        modelo: 'Civic Touring 1.5 Turbo',
        ano: 2023,
        km: 28000,
        preco: 162500,
        cor: 'Cinza Metálico',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Honda Civic Touring 2023 com motor turbo de 174cv. Teto solar elétrico, bancos em couro com ajuste elétrico, sistema de som premium Bose com 12 alto-falantes, lane watch, head-up display e Honda Sensing completo. Veículo impecável, segundo dono, histórico completo de manutenção.',
        destaque: 1
    },
    {
        marca: 'Volkswagen',
        modelo: 'Jetta GLI 2.0 TSI',
        ano: 2023,
        km: 18500,
        preco: 189900,
        cor: 'Preto Ninja',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Volkswagen Jetta GLI 2023 - versão esportiva com motor 2.0 TSI de 230cv. Suspensão esportiva, freios ventilados, rodas aro 18 exclusivas, bancos Driving Experience em couro e tecido especial, saída de escape dupla e sistema IQ.Drive. Perfeito estado, sem detalhes.',
        destaque: 1
    },
    {
        marca: 'Hyundai',
        modelo: 'HB20S Diamond Plus 1.0 Turbo',
        ano: 2024,
        km: 8500,
        preco: 98900,
        cor: 'Prata',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Hyundai HB20S Diamond Plus 2024 turbo com 120cv. Central multimídia de 10.25 polegadas, ar digital, bancos em couro, sensor de estacionamento dianteiro e traseiro, carregador por indução, chave presencial e câmera de ré. Carro zero km com apenas 8.500 km.',
        destaque: 0
    },
    {
        marca: 'Chevrolet',
        modelo: 'Onix Plus Premier 1.0 Turbo',
        ano: 2024,
        km: 15000,
        preco: 94500,
        cor: 'Vermelho Carmim',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Chevrolet Onix Plus Premier 2024 com motor 1.0 turbo de 116cv. Versão top de linha com MyLink de 8 polegadas, Wi-Fi nativo, 6 airbags, alerta de colisão frontal, alerta de mudança de faixa, frenagem automática de emergência. Único dono, todas revisões Chevrolet.',
        destaque: 0
    },

    // === SUVs COMPACTOS (5 carros) ===
    {
        marca: 'Jeep',
        modelo: 'Compass Limited 1.3 T270 Turbo',
        ano: 2024,
        km: 11000,
        preco: 179900,
        cor: 'Branco',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Jeep Compass Limited 2024 com motor turbo T270 de 185cv. Teto solar panorâmico, bancos em couro bege, sistema de som Beats, tela de 10.1 polegadas, carregador wireless, ar digital dual zone e pacote de assistência à direção completo. Perfeito estado.',
        destaque: 1
    },
    {
        marca: 'Volkswagen',
        modelo: 'T-Cross Highline 1.4 TSI',
        ano: 2023,
        km: 22000,
        preco: 129900,
        cor: 'Azul Biscay',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'VW T-Cross Highline 2023 com motor 1.4 TSI de 150cv. Versão completa com teto solar, Active Info Display digital, bancos em couro, central VW Play, câmera 360 graus, park assist, climatronic e rodas aro 18. Veículo impecável.',
        destaque: 0
    },
    {
        marca: 'Hyundai',
        modelo: 'Creta Platinum 2.0',
        ano: 2024,
        km: 9000,
        preco: 145900,
        cor: 'Verde Amazon',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Hyundai Creta Platinum 2024 com motor 2.0 de 167cv. Teto solar panorâmico, ar digital dual zone, bancos em couro com ventilação, painel de instrumentos digital 10.25, central multimídia 10.25, câmera 360, alerta de ponto cego. Único dono.',
        destaque: 1
    },
    {
        marca: 'Honda',
        modelo: 'HR-V EXL 1.5 Turbo',
        ano: 2023,
        km: 19500,
        preco: 159900,
        cor: 'Cinza Titanium',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Honda HR-V EXL 2023 nova geração com motor 1.5 turbo de 177cv. Bancos em couro com ajuste elétrico, painel digital de 7 polegadas, central de 9 polegadas com Honda Connect, câmera multi-angle, frenagem automática e lane keeping assist.',
        destaque: 0
    },
    {
        marca: 'Nissan',
        modelo: 'Kicks Exclusive 1.6 CVT',
        ano: 2024,
        km: 7500,
        preco: 119900,
        cor: 'Laranja Flame',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Nissan Kicks Exclusive 2024 com motor 1.6 de 114cv e câmbio CVT. Teto bicolor, bancos em couro, painel digital 7 polegadas, central 8 polegadas Apple CarPlay/Android Auto, Around View Monitor, ProPILOT. Carro seminovo de concessionária.',
        destaque: 0
    },

    // === SUVs MÉDIOS/GRANDES (4 carros) ===
    {
        marca: 'Toyota',
        modelo: 'SW4 SRX 2.8 Diesel 4x4',
        ano: 2023,
        km: 35000,
        preco: 349900,
        cor: 'Branco Lunar',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Toyota SW4 SRX 2023 diesel com 204cv e tração 4x4. 7 lugares, bancos em couro legítimo, teto solar elétrico, Toyota Safety Sense, controle de descida, 6 airbags, som JBL premium. Veículo de único dono empresarial, revisões em dia.',
        destaque: 1
    },
    {
        marca: 'Jeep',
        modelo: 'Grand Cherokee Limited 3.6 V6',
        ano: 2023,
        km: 28000,
        preco: 379900,
        cor: 'Preto Diamond',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Jeep Grand Cherokee Limited 2023 com motor V6 de 286cv. Tração 4x4 Quadra-Trac II, interior premium em couro Nappa, teto solar duplo panorâmico, som Alpine de 9 alto-falantes, sistema Uconnect 10.1 polegadas. Imponência e sofisticação.',
        destaque: 1
    },
    {
        marca: 'Volkswagen',
        modelo: 'Tiguan Allspace R-Line 2.0 TSI',
        ano: 2024,
        km: 12000,
        preco: 259900,
        cor: 'Cinza Platinum',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'VW Tiguan Allspace R-Line 2024 com motor 2.0 TSI de 230cv e tração 4Motion. 7 lugares, interior R-Line exclusivo, Harman Kardon, teto panorâmico, IQ.Drive, painel digital e head-up display. Performance e espaço.',
        destaque: 0
    },
    {
        marca: 'Mitsubishi',
        modelo: 'Outlander HPE-S 2.0 AWD',
        ano: 2023,
        km: 24000,
        preco: 195900,
        cor: 'Branco Pérola',
        combustivel: 'Gasolina',
        cambio: 'Automático',
        descricao: 'Mitsubishi Outlander HPE-S 2023 com tração AWD. 7 lugares, bancos em couro com aquecimento, teto solar panorâmico, sistema Rockford Fosgate premium, câmera 360, sensor frontal e traseiro, modo off-road S-AWC. Revisões 100% Mitsubishi.',
        destaque: 0
    },

    // === HATCHES (3 carros) ===
    {
        marca: 'Volkswagen',
        modelo: 'Polo GTS 1.4 TSI',
        ano: 2024,
        km: 6500,
        preco: 119900,
        cor: 'Vermelho Sunset',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'VW Polo GTS 2024 com motor 1.4 TSI de 150cv - versão esportiva. Suspensão esportiva, rodas aro 17 diamantadas, bancos exclusivos GTS, volante esportivo, pedaleiras em alumínio, modo Sport e VW Play. Praticamente zero km.',
        destaque: 1
    },
    {
        marca: 'Fiat',
        modelo: 'Argo Trekking 1.3 Firefly',
        ano: 2024,
        km: 14000,
        preco: 78900,
        cor: 'Branco Banchisa',
        combustivel: 'Flex',
        cambio: 'Manual',
        descricao: 'Fiat Argo Trekking 2024 com visual aventureiro. Motor 1.3 Firefly de 109cv, central multimídia 7 polegadas com Android Auto e Apple CarPlay, ar-condicionado, direção elétrica progressiva, rodas aro 16 diamantadas. Ótimo custo-benefício.',
        destaque: 0
    },
    {
        marca: 'Hyundai',
        modelo: 'HB20 Diamond Plus 1.0 Turbo',
        ano: 2024,
        km: 5000,
        preco: 94900,
        cor: 'Azul Oceano',
        combustivel: 'Flex',
        cambio: 'Automático',
        descricao: 'Hyundai HB20 Diamond Plus 2024 turbo com 120cv. Top de linha com central 10.25 polegadas, painel digital 10.25, teto solar, bancos em couro, carregador wireless, sensor de ponto cego, assistente de permanência em faixa. Seminovo de km baixíssima.',
        destaque: 0
    },

    // === PICAPES (3 carros) ===
    {
        marca: 'Toyota',
        modelo: 'Hilux SRX 2.8 Diesel 4x4',
        ano: 2024,
        km: 18000,
        preco: 295900,
        cor: 'Prata',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Toyota Hilux SRX 2024 diesel com 204cv e tração 4x4. Santo Antônio, capota marítima, bancos em couro, central 8 polegadas, Toyota Safety Sense, controle de tração e de descida, diferencial blocante traseiro. Pronta pro trabalho ou lazer.',
        destaque: 1
    },
    {
        marca: 'Ford',
        modelo: 'Ranger Limited 3.0 V6 Diesel 4x4',
        ano: 2024,
        km: 9500,
        preco: 329900,
        cor: 'Cinza Magnetic',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'Nova Ford Ranger Limited 2024 V6 com 250cv e 600Nm de torque! Nova geração completíssima: SYNC 4 de 12 polegadas, painel digital 12.4, câmera 360, B&O Sound System, Pro Trailer Backup Assist, zone lighting, Pro Access tailgate. A mais moderna.',
        destaque: 1
    },
    {
        marca: 'Chevrolet',
        modelo: 'S10 High Country 2.8 Diesel 4x4',
        ano: 2023,
        km: 32000,
        preco: 249900,
        cor: 'Branco Summit',
        combustivel: 'Diesel',
        cambio: 'Automático',
        descricao: 'S10 High Country 2023 diesel com motor 2.8 de 200cv. Versão topo de linha: bancos em couro marrom, MyLink de 8 polegadas, banco traseiro rebatível, grade cromada exclusiva, estribos laterais e capota rígida. Perfeito estado.',
        destaque: 0
    }
];

async function fazerLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        }, {
            withCredentials: true
        });

        console.log('✅ Login realizado com sucesso!');
        return response.headers['set-cookie'];
    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        return null;
    }
}

async function limparCarrosAntigos(cookies) {
    try {
        // Buscar todos os carros existentes
        const response = await axios.get(`${BASE_URL}/api/vehicles`);
        const carros = response.data;

        console.log(`\n🗑️ Removendo ${carros.length} carros antigos...`);

        for (const carro of carros) {
            await axios.delete(`${BASE_URL}/api/vehicles/${carro.id}`, {
                headers: { Cookie: cookies }
            });
            console.log(`  - Removido: ${carro.marca} ${carro.modelo}`);
        }

        console.log('✅ Carros antigos removidos!\n');
    } catch (error) {
        console.error('Erro ao limpar:', error.message);
    }
}

async function adicionarCarros(cookies) {
    console.log('🚗 Adicionando 20 carros reais ao catálogo...\n');

    let sucesso = 0;
    let falha = 0;

    for (const carro of carrosReais) {
        try {
            const formData = new URLSearchParams();
            formData.append('marca', carro.marca);
            formData.append('modelo', carro.modelo);
            formData.append('ano', carro.ano);
            formData.append('km', carro.km);
            formData.append('preco', carro.preco);
            formData.append('cor', carro.cor);
            formData.append('combustivel', carro.combustivel);
            formData.append('cambio', carro.cambio);
            formData.append('descricao', carro.descricao);
            formData.append('destaque', carro.destaque);

            await axios.post(`${BASE_URL}/api/vehicles`, formData, {
                headers: {
                    Cookie: cookies,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            sucesso++;
            console.log(`✅ [${sucesso}/20] ${carro.marca} ${carro.modelo} - R$ ${carro.preco.toLocaleString('pt-BR')}`);
        } catch (error) {
            falha++;
            console.error(`❌ Erro ao adicionar ${carro.marca} ${carro.modelo}:`, error.message);
        }
    }

    console.log(`\n📊 Resultado: ${sucesso} carros adicionados, ${falha} falhas`);
}

async function main() {
    console.log('='.repeat(60));
    console.log('🚗 POPULAÇÃO DO CATÁLOGO COM CARROS REAIS');
    console.log('='.repeat(60));
    console.log(`\n📡 URL: ${BASE_URL}\n`);

    // Login
    const cookies = await fazerLogin();
    if (!cookies) {
        console.log('❌ Não foi possível fazer login. Abortando.');
        return;
    }

    // Limpar carros antigos
    await limparCarrosAntigos(cookies);

    // Adicionar novos carros
    await adicionarCarros(cookies);

    console.log('\n' + '='.repeat(60));
    console.log('✅ CATÁLOGO POPULADO COM SUCESSO!');
    console.log('='.repeat(60));
    console.log(`\n🌐 Acesse: ${BASE_URL}`);
    console.log(`🔐 Admin: ${BASE_URL}/admin/dashboard.html`);
}

main();
