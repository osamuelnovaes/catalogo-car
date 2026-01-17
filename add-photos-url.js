// Script para adicionar fotos reais aos carros do catálogo
// Usa URLs públicas de imagens de alta qualidade

const axios = require('axios');

const BASE_URL = 'https://catalogo-carcatalogo-car.onrender.com';

// Mapeamento de modelos para URLs de fotos reais
// Usando imagens do Unsplash e outras fontes públicas confiáveis
const fotosCarros = {
    'Corolla': [
        'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80',
        'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80'
    ],
    'Civic': [
        'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80',
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800&q=80'
    ],
    'Jetta': [
        'https://images.unsplash.com/photo-1632441939588-3cf8f1f9cfed?w=800&q=80',
        'https://images.unsplash.com/photo-1616455579100-2ceaa4eb2d37?w=800&q=80'
    ],
    'HB20S': [
        'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80'
    ],
    'Onix': [
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80'
    ],
    'Compass': [
        'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80',
        'https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=800&q=80'
    ],
    'T-Cross': [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80'
    ],
    'Creta': [
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
        'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80'
    ],
    'HR-V': [
        'https://images.unsplash.com/photo-1568844293986-8c9a5bfc2930?w=800&q=80',
        'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800&q=80'
    ],
    'Kicks': [
        'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80',
        'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80'
    ],
    'SW4': [
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80',
        'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800&q=80'
    ],
    'Grand Cherokee': [
        'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&q=80',
        'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80'
    ],
    'Tiguan': [
        'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80',
        'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800&q=80'
    ],
    'Outlander': [
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80',
        'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800&q=80'
    ],
    'Polo': [
        'https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=800&q=80',
        'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=800&q=80'
    ],
    'Argo': [
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80',
        'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&q=80'
    ],
    'HB20': [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'
    ],
    'Hilux': [
        'https://images.unsplash.com/photo-1559935030-f6a9c02c9b5c?w=800&q=80',
        'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&q=80'
    ],
    'Ranger': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
        'https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=800&q=80'
    ],
    'S10': [
        'https://images.unsplash.com/photo-1575090536203-2a6193126514?w=800&q=80',
        'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=800&q=80'
    ]
};

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

async function buscarVeiculos() {
    try {
        const response = await axios.get(`${BASE_URL}/api/vehicles`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar veículos:', error.message);
        return [];
    }
}

function encontrarFotos(modelo) {
    // Procura correspondência no mapeamento de fotos
    for (const [key, urls] of Object.entries(fotosCarros)) {
        if (modelo.toLowerCase().includes(key.toLowerCase())) {
            return urls;
        }
    }
    // Fotos genéricas de carros se não encontrar
    return [
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80'
    ];
}

async function adicionarFotos(vehicleId, fotos) {
    for (let i = 0; i < fotos.length; i++) {
        try {
            await axios.post(`${BASE_URL}/api/vehicles/${vehicleId}/image-url`, {
                imageUrl: fotos[i],
                isPrimary: i === 0,
                orderIndex: i
            }, {
                headers: { Cookie: cookies }
            });
        } catch (error) {
            console.error(`  Erro ao adicionar foto ${i + 1}:`, error.message);
        }
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('📷 ADICIONANDO FOTOS REAIS AOS CARROS');
    console.log('='.repeat(60));

    const loggedIn = await fazerLogin();
    if (!loggedIn) {
        console.log('❌ Falha no login. Abortando.');
        return;
    }

    const veiculos = await buscarVeiculos();
    console.log(`\n📦 Encontrados ${veiculos.length} veículos\n`);

    for (const veiculo of veiculos) {
        const fotos = encontrarFotos(veiculo.modelo);
        console.log(`🚗 ${veiculo.marca} ${veiculo.modelo}`);
        console.log(`   Adicionando ${fotos.length} fotos...`);

        await adicionarFotos(veiculo.id, fotos);
        console.log(`   ✅ Fotos adicionadas!`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TODAS AS FOTOS FORAM ADICIONADAS!');
    console.log('='.repeat(60));
    console.log(`\n🌐 Acesse: ${BASE_URL}`);
}

main();
