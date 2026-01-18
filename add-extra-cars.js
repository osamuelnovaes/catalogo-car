const axios = require('axios');

const BASE_URL = 'https://catalogo-carcatalogo-car.onrender.com';

// Novos 20 Carros com fotos reais (URLs públicas)
const novosCarros = [
    // === SEDANS PREMIUM/MÉDIO ===
    {
        marca: 'BMW', modelo: '320i M Sport', ano: 2024, km: 5000, preco: 359900, cor: 'Azul Portimao',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'BMW 320i M Sport 2024. Painel curvo, rodas 19", teto solar, assistente de direção profissional.',
        fotos: [
            'https://images.unsplash.com/photo-1555215695-3004980adade?w=800&q=80',
            'https://images.unsplash.com/photo-1556189250-72ba954e9664?w=800&q=80'
        ]
    },
    {
        marca: 'Audi', modelo: 'A4 Sedan Prestige', ano: 2023, km: 15000, preco: 299900, cor: 'Cinza Daytona',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 0,
        descricao: 'Audi A4 Prestige Plus 2023. Motor 2.0 TFSI 204cv, Virtual Cockpit, faróis Full LED.',
        fotos: [
            'https://images.unsplash.com/photo-1606152421811-aa91107bac1b?w=800&q=80',
            'https://images.unsplash.com/photo-1629897048514-3dd741586528?w=800&q=80'
        ]
    },
    {
        marca: 'Nissan', modelo: 'Sentra Exclusive 2.0', ano: 2024, km: 8000, preco: 174900, cor: 'Branco Diamond',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 0,
        descricao: 'Novo Nissan Sentra 2024. Design esportivo, teto solar, som Bose, Safety Shield 360.',
        fotos: [
            'https://images.unsplash.com/photo-1549520018-7b447a1bc7cd?w=800&q=80',
            'https://images.unsplash.com/photo-1579361680516-ae020083049b?w=800&q=80'
        ]
    },
    {
        marca: 'Fiat', modelo: 'Cronos Precision 1.3', ano: 2024, km: 12000, preco: 98900, cor: 'Vermelho Montecarlo',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Fiat Cronos Precision 2024. Câmbio CVT, central 7", ar digital, keyless, bancos em couro ecológico.',
        fotos: [
            'https://images.unsplash.com/photo-1549426915-b59c25bb2a04?w=800&q=80',
            'https://images.unsplash.com/photo-1582260667086-4e5c54ec4764?w=800&q=80'
        ]
    },

    // === SUVs & CROSSOVERS ===
    {
        marca: 'Volvo', modelo: 'XC60 Recharge', ano: 2024, km: 4500, preco: 449900, cor: 'Crystal White',
        combustivel: 'Híbrido', cambio: 'Automático', destaque: 1,
        descricao: 'Volvo XC60 Recharge Híbrido Plug-in. 462cv combinados, Google nativo, som Bowers & Wilkins.',
        fotos: [
            'https://images.unsplash.com/photo-1605315570267-2850942472d7?w=800&q=80',
            'https://images.unsplash.com/photo-1605315571168-984bb3522f74?w=800&q=80'
        ]
    },
    {
        marca: 'Caoa Chery', modelo: 'Tiggo 8 Pro Plug-in', ano: 2024, km: 6000, preco: 239900, cor: 'Preto',
        combustivel: 'Híbrido', cambio: 'Automático', destaque: 0,
        descricao: 'Tiggo 8 Pro Híbrido Plug-in. 7 lugares, autonomia elétrica de 77km, teto panorâmico, ADAS.',
        fotos: [
            'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80', // usando outlander como ref visual parecida
            'https://images.unsplash.com/photo-1633503598506-c852bc063b4f?w=800&q=80'
        ]
    },
    {
        marca: 'Fiat', modelo: 'Fastback Limited Edition', ano: 2024, km: 10000, preco: 159900, cor: 'Cinza Strato',
        combustivel: 'Flex', cambio: 'Automático', destaque: 1,
        descricao: 'Fiat Fastback Limited Edition by Abarth. Motor 1.3 Turbo 185cv, rodas 18", painel digital 7".',
        fotos: [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // ref visual coupe
            'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80'
        ]
    },
    {
        marca: 'Renault', modelo: 'Duster Iconic 1.3 Turbo', ano: 2024, km: 14500, preco: 148900, cor: 'Laranja',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Renault Duster Iconic Turbo. Motor TCe 1.3 Mercedes, câmbio CVT Xtronic, câmeras multiview.',
        fotos: [
            'https://images.unsplash.com/photo-1621503306807-6f021d7b6b19?w=800&q=80',
            'https://images.unsplash.com/photo-1621503306915-188b02c638be?w=800&q=80'
        ]
    },
    {
        marca: 'Chevrolet', modelo: 'Tracker Premier 1.2', ano: 2024, km: 11000, preco: 162900, cor: 'Azul Eclipse',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Tracker Premier 1.2 Turbo. Teto solar panorâmico, Wi-Fi, frenagem de emergência, park assist.',
        fotos: [
            'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=800&q=80',
            'https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=800&q=80'
        ]
    },
    {
        marca: 'Land Rover', modelo: 'Defender 110 SE', ano: 2023, km: 18000, preco: 689900, cor: 'Verde Pangea',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 1,
        descricao: 'Land Rover Defender 110. O ícone off-road reinventado. Motor diesel D300, suspensão a ar.',
        fotos: [
            'https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80',
            'https://images.unsplash.com/photo-1533558778401-2098d6c753df?w=800&q=80'
        ]
    },

    // === HATCHES & COMPACTOS ===
    {
        marca: 'Peugeot', modelo: '208 Style 1.0', ano: 2024, km: 9000, preco: 84900, cor: 'Cinza Artense',
        combustivel: 'Flex', cambio: 'Manual', destaque: 0,
        descricao: 'Peugeot 208 Style. O 1.0 mais completo. Teto panorâmico, faróis Full LED, multimídia 10".',
        fotos: [
            'https://images.unsplash.com/photo-1549520018-7b447a1bc7cd?w=800&q=80', // ref visual
            'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800&q=80'
        ]
    },
    {
        marca: 'Toyota', modelo: 'Yaris XLS 1.5', ano: 2024, km: 13000, preco: 115900, cor: 'Prata',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Toyota Yaris Hatch XLS. Teto solar, 7 airbags, alerta de colisão, confiabilidade Toyota.',
        fotos: [
            'https://images.unsplash.com/photo-1594070319944-7c0cbebb6f58?w=800&q=80', // ref visual yaris/corolla hatch
            'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80'
        ]
    },
    {
        marca: 'Honda', modelo: 'City Hatchback Touring', ano: 2024, km: 7000, preco: 138900, cor: 'Branco Topázio',
        combustivel: 'Flex', cambio: 'Automático', destaque: 0,
        descricao: 'Honda City Hatch Touring. Magic Seat, motor 1.5 DI injeção direta, Honda Sensing.',
        fotos: [
            'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', // ref visual
            'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'
        ]
    },
    {
        marca: 'Mini', modelo: 'Cooper S 2.0 Turbo', ano: 2023, km: 12000, preco: 219900, cor: 'Verde Britânico',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'Mini Cooper S 3 portas. O Go-Kart feeling autêntico. Motor 2.0 Turbo 192cv, som Harman Kardon.',
        fotos: [
            'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=800&q=80',
            'https://images.unsplash.com/photo-1555626906-fcf10d6851b4?w=800&q=80'
        ]
    },

    // === PICAPES ===
    {
        marca: 'Fiat', modelo: 'Toro Ranch 2.0 Diesel', ano: 2024, km: 16000, preco: 212900, cor: 'Marrom',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 0,
        descricao: 'Fiat Toro Ranch Diesel 4x4. Acabamento exclusivo em marrom, santantônio cromado, estribos.',
        fotos: [
            'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80', // ref visual pickup
            'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80'
        ]
    },
    {
        marca: 'Ram', modelo: '1500 Rebel 5.7 V8', ano: 2023, km: 11000, preco: 469900, cor: 'Vermelho Flame',
        combustivel: 'Gasolina', cambio: 'Automático', destaque: 1,
        descricao: 'Ram 1500 Rebel V8 HEMI 400cv. A picape mais potente do Brasil. Teto panorâmico, som Harman Kardon.',
        fotos: [
            'https://images.unsplash.com/photo-1550389886-c4d6eb293fb8?w=800&q=80', // ref visual ram
            'https://images.unsplash.com/photo-1584941913982-f54f738fe76d?w=800&q=80'
        ]
    },
    {
        marca: 'Mitsubishi', modelo: 'L200 Triton Sport HPE-S', ano: 2024, km: 19000, preco: 289900, cor: 'Cinza',
        combustivel: 'Diesel', cambio: 'Automático', destaque: 0,
        descricao: 'L200 Triton Sport HPE-S. A casca grossa da Mitsubishi. Super Select II 4WD, assistente de descida.',
        fotos: [
            'https://images.unsplash.com/photo-1559935030-f6a9c02c9b5c?w=800&q=80', // ref visual
            'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'
        ]
    },

    // === ELÉTRICOS & HÍBRIDOS (Novidade) ===
    {
        marca: 'BYD', modelo: 'Dolphin EV', ano: 2024, km: 3000, preco: 149800, cor: 'Rosa',
        combustivel: 'Elétrico', cambio: 'Automático', destaque: 1,
        descricao: 'BYD Dolphin Elétrico. O mais vendido do Brasil. Autonomia de 291km (PBEV), tela giratória de 12.8".',
        fotos: [
            'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', // ref visual elétrico compacto
            'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&q=80'
        ]
    },
    {
        marca: 'GWM', modelo: 'Haval H6 GT', ano: 2024, km: 6500, preco: 319000, cor: 'Preto',
        combustivel: 'Híbrido', cambio: 'Automático', destaque: 1,
        descricao: 'GWM Haval H6 GT PHEV. SUV Cupê esportivo com 393cv. 0 a 100 em 4,8s, reconhecimento facial.',
        fotos: [
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80', // ref visual suv coupe
            'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
        ]
    },
    {
        marca: 'Porsche', modelo: 'Taycan 4S', ano: 2023, km: 9000, preco: 780000, cor: 'Branco',
        combustivel: 'Elétrico', cambio: 'Automático', destaque: 1,
        descricao: 'Porsche Taycan 4S 100% Elétrico. A performance Porsche na era elétrica. 571cv no Overboost.',
        fotos: [
            'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?w=800&q=80',
            'https://images.unsplash.com/photo-1611651338412-8403fa6e3599?w=800&q=80'
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
        console.error(`  Erro ao adicionar ${carro.modelo}: ${error.message}`);
        return false;
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('🚀 ADICIONANDO MAIS 20 CARROS EXTRAS');
    console.log('='.repeat(60));
    console.log(`📡 URL: ${BASE_URL}\n`);

    const loggedIn = await fazerLogin();
    if (!loggedIn) return;

    let sucesso = 0;
    for (const carro of novosCarros) {
        const ok = await adicionarCarro(carro);
        if (ok) {
            sucesso++;
            console.log(`✅ [${sucesso}/20] ${carro.marca} ${carro.modelo}`);
        } else {
            console.log(`❌ Falha: ${carro.marca} ${carro.modelo}`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ CONCLUÍDO! ${sucesso} NOVOS VEÍCULOS ADICIONADOS.`);
    console.log('='.repeat(60));
    console.log('Total estimado no sistema: ~40 veículos');
}

main();
