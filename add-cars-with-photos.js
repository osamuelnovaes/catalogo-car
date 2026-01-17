// Script COMPLETO - Adiciona 20 carros COM fotos
const axios = require('axios');

const BASE_URL = 'https://catalogo-carcatalogo-car.onrender.com';

// Carros com suas fotos reais (URLs públicas)
const carrosComFotos = [
    // === SEDANS ===
    {
        marca: 'Toyota', modelo: 'Corolla XEi 2.0 Flex', ano: 2024, km: 12000, preco: 148900, cor: 'Branco Polar',
        combustivel: 'Flex', cambio: 'Automático', destaque: 1,
        descricao: 'Toyota Corolla XEi 2024 com apenas 12 mil km. Central multimídia 9 polegadas, Apple CarPlay, câmera de ré, bancos em couro, ar digital dual zone.',
        fotos: [
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
            'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'
        ]
    },
    {
        marca: 'Honda', modelo: 'Civic Touring 1.5 Turbo', ano: 2023, km: 28000, preco: 162500, cor: 'Cinza Metálico',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'Honda Civic Touring 2023 turbo 174cv. Teto solar, bancos em couro, som Bose, head-up display, Honda Sensing completo.',
        fotos: [
            'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80',
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'
        ]
    },
    {
        marca: 'Volkswagen', modelo: 'Jetta GLI 2.0 TSI', ano: 2023, km: 18500, preco: 189900, cor: 'Preto',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'VW Jetta GLI 2023 esportivo com 230cv. Suspensão esportiva, rodas aro 18, bancos exclusivos GLI.',
        fotos: [
            'https://images.unsplash.com/photo-1632441939588-3cf8f1f9cfed?w=800&q=80',
            'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=800&q=80'
        ]
    },
    {
        marca: 'Hyundai', modelo: 'HB20S Diamond Plus 1.0 Turbo', ano: 2024, km: 8500, preco: 98900, cor: 'Prata',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'HB20S Diamond Plus 2024 turbo 120cv. Central 10.25", ar digital, bancos em couro, carregador wireless.',
        fotos: [
            'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
        ]
    },
    {
        marca: 'Chevrolet', modelo: 'Onix Plus Premier 1.0 Turbo', ano: 2024, km: 15000, preco: 94500, cor: 'Vermelho',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Onix Plus Premier 2024 turbo 116cv. MyLink 8", Wi-Fi, 6 airbags, alerta de colisão e frenagem automática.',
        fotos: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
            'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'
        ]
    },

    // === SUVs COMPACTOS ===
    {
        marca: 'Jeep', modelo: 'Compass Limited 1.3 T270', ano: 2024, km: 11000, preco: 179900, cor: 'Branco',
        combustivel: 'Flex', cambio: 'Automático', destaque: 1,
        descricao: 'Jeep Compass Limited 2024 T270 185cv. Teto solar panorâmico, bancos em couro bege, som Beats, tela 10.1".',
        fotos: [
            'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
            'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80'
        ]
    },
    {
        marca: 'Volkswagen', modelo: 'T-Cross Highline 1.4 TSI', ano: 2023, km: 22000, preco: 129900, cor: 'Azul',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'VW T-Cross Highline 2023 TSI 150cv. Teto solar, painel digital, bancos em couro, câmera 360°, park assist.',
        fotos: [
            'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
            'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
        ]
    },
    {
        marca: 'Hyundai', modelo: 'Creta Platinum 2.0', ano: 2024, km: 9000, preco: 145900, cor: 'Verde',
        combustivel: 'Flex', cambio: 'Automático', destaque: 1,
        descricao: 'Hyundai Creta Platinum 2024 167cv. Teto panorâmico, ar dual zone, bancos ventilados, câmera 360°.',
        fotos: [
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
        ]
    },
    {
        marca: 'Honda', modelo: 'HR-V EXL 1.5 Turbo', ano: 2023, km: 19500, preco: 159900, cor: 'Cinza',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Honda HR-V EXL 2023 nova geração turbo 177cv. Bancos em couro, central 9", frenagem automática.',
        fotos: [
            'https://images.unsplash.com/photo-1568844293986-8c9a5bfc2930?w=800&q=80',
            'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80'
        ]
    },
    {
        marca: 'Nissan', modelo: 'Kicks Exclusive 1.6 CVT', ano: 2024, km: 7500, preco: 119900, cor: 'Laranja',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Nissan Kicks Exclusive 2024. Teto bicolor, bancos em couro, Around View Monitor, ProPILOT.',
        fotos: [
            'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
            'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80'
        ]
    },

    // === SUVs MÉDIOS/GRANDES ===
    {
        marca: 'Toyota', modelo: 'SW4 SRX 2.8 Diesel 4x4', ano: 2023, km: 35000, preco: 349900, cor: 'Branco',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 1,
        descricao: 'Toyota SW4 SRX 2023 diesel 204cv 4x4. 7 lugares, bancos em couro, teto solar, Toyota Safety Sense.',
        fotos: [
            'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
            'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'
        ]
    },
    {
        marca: 'Jeep', modelo: 'Grand Cherokee Limited 3.6 V6', ano: 2023, km: 28000, preco: 379900, cor: 'Preto',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'Grand Cherokee Limited 2023 V6 286cv 4x4. Couro Nappa, teto panorâmico duplo, som Alpine premium.',
        fotos: [
            'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
            'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80'
        ]
    },
    {
        marca: 'Volkswagen', modelo: 'Tiguan Allspace R-Line 2.0 TSI', ano: 2024, km: 12000, preco: 259900, cor: 'Cinza',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 0,
        descricao: 'VW Tiguan R-Line 2024 TSI 230cv 4Motion. 7 lugares, Harman Kardon, teto panorâmico, head-up display.',
        fotos: [
            'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
            'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800&q=80'
        ]
    },
    {
        marca: 'Mitsubishi', modelo: 'Outlander HPE-S 2.0 AWD', ano: 2023, km: 24000, preco: 195900, cor: 'Branco',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 0,
        descricao: 'Outlander HPE-S 2023 AWD 7 lugares. Bancos aquecidos, teto panorâmico, Rockford Fosgate.',
        fotos: [
            'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
            'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80'
        ]
    },

    // === HATCHES ===
    {
        marca: 'Volkswagen', modelo: 'Polo GTS 1.4 TSI', ano: 2024, km: 6500, preco: 119900, cor: 'Vermelho',
        combustivel: 'Flex', cambio: 'Automático', destaque: 1,
        descricao: 'VW Polo GTS 2024 esportivo TSI 150cv. Suspensão esportiva, rodas 17", bancos GTS, VW Play.',
        fotos: [
            'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
            'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80'
        ]
    },
    {
        marca: 'Fiat', modelo: 'Argo Trekking 1.3', ano: 2024, km: 14000, preco: 78900, cor: 'Branco',
        combustivel: 'Flex', cambio: 'Manual', destaque: 0,
        descricao: 'Fiat Argo Trekking 2024 visual aventureiro. Central 7", ar-condicionado, direção elétrica, rodas 16".',
        fotos: [
            'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
            'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80'
        ]
    },
    {
        marca: 'Hyundai', modelo: 'HB20 Diamond Plus 1.0 Turbo', ano: 2024, km: 5000, preco: 94900, cor: 'Azul',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'HB20 Diamond Plus 2024 top de linha turbo 120cv. Tela 10.25", teto solar, sensor ponto cego.',
        fotos: [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
            'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'
        ]
    },

    // === PICAPES ===
    {
        marca: 'Toyota', modelo: 'Hilux SRX 2.8 Diesel 4x4', ano: 2024, km: 18000, preco: 295900, cor: 'Prata',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 1,
        descricao: 'Toyota Hilux SRX 2024 diesel 204cv 4x4. Santo Antônio, capota, bancos em couro, Toyota Safety Sense.',
        fotos: [
            'https://images.unsplash.com/photo-1559935030-f6a9c02c9b5c?w=800&q=80',
            'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&q=80'
        ]
    },
    {
        marca: 'Ford', modelo: 'Ranger Limited 3.0 V6 Diesel 4x4', ano: 2024, km: 9500, preco: 329900, cor: 'Cinza',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 1,
        descricao: 'Nova Ranger Limited 2024 V6 250cv! SYNC 4 tela 12", painel digital 12.4", câmera 360°, B&O Sound.',
        fotos: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80'
        ]
    },
    {
        marca: 'Chevrolet', modelo: 'S10 High Country 2.8 Diesel 4x4', ano: 2023, km: 32000, preco: 249900, cor: 'Branco',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 0,
        descricao: 'S10 High Country 2023 diesel 200cv top de linha. Bancos em couro marrom, MyLink 8", capota rígida.',
        fotos: [
            'https://images.unsplash.com/photo-1575090536203-2a6193126514?w=800&q=80',
            'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80'
        ]
    }
];

let cookies = null;

async function fazerLogin() {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        cookies = response.headers['set-cookie'];
        console.log('✅ Login realizado!');
        return true;
    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        return false;
    }
}

async function limparCatalogo() {
    try {
        const response = await axios.get(`${BASE_URL}/api/vehicles`);
        const carros = response.data;

        if (carros.length > 0) {
            console.log(`🗑️ Removendo ${carros.length} carros antigos...`);
            for (const carro of carros) {
                await axios.delete(`${BASE_URL}/api/vehicles/${carro.id}`, {
                    headers: { Cookie: cookies }
                });
            }
            console.log('✅ Catálogo limpo!\n');
        }
    } catch (error) {
        console.log('Nenhum carro para remover');
    }
}

async function adicionarCarro(carro) {
    try {
        // Criar veículo
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

        const response = await axios.post(`${BASE_URL}/api/vehicles`, formData, {
            headers: {
                Cookie: cookies,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const vehicleId = response.data.id;

        // Adicionar fotos
        for (let i = 0; i < carro.fotos.length; i++) {
            await axios.post(`${BASE_URL}/api/vehicles/${vehicleId}/image-url`, {
                imageUrl: carro.fotos[i],
                isPrimary: i === 0,
                orderIndex: i
            }, {
                headers: { Cookie: cookies }
            });
        }

        return true;
    } catch (error) {
        console.error(`  Erro: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('🚗 ADICIONANDO 20 CARROS COM FOTOS REAIS');
    console.log('='.repeat(60));
    console.log(`📡 URL: ${BASE_URL}\n`);

    const loggedIn = await fazerLogin();
    if (!loggedIn) return;

    await limparCatalogo();

    let sucesso = 0;
    for (const carro of carrosComFotos) {
        const ok = await adicionarCarro(carro);
        if (ok) {
            sucesso++;
            console.log(`✅ [${sucesso}/20] ${carro.marca} ${carro.modelo} + ${carro.fotos.length} fotos`);
        } else {
            console.log(`❌ Erro: ${carro.marca} ${carro.modelo}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${sucesso} CARROS ADICIONADOS COM FOTOS!`);
    console.log('='.repeat(60));
    console.log(`\n🌐 Acesse: ${BASE_URL}`);
}

main();
