const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const ARTIFACTS_DIR = '/Users/samuelnovaes/.gemini/antigravity/brain/0eb2690b-154f-4325-b0c2-6948b4402141';

// Carregar dados dos veículos
const vehiclesData = require('./vehicles-data.json');
const vehicles = vehiclesData.vehicles;

// Mapear imagens existentes para diferentes ângulos
const availableImages = fs.readdirSync(ARTIFACTS_DIR)
    .filter(f => f.endsWith('.png') && (f.includes('carro_') || f.includes('toyota_') || f.includes('car_')))
    .map(f => path.join(ARTIFACTS_DIR, f));

console.log(`\n📸 Imagens disponíveis: ${availableImages.length}`);

// Função para login
async function login() {
    try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        }, {
            withCredentials: true
        });

        const cookies = response.headers['set-cookie'];
        return cookies ? cookies[0].split(';')[0] : null;
    } catch (error) {
        console.error('Erro no login:', error.message);
        return null;
    }
}

// Função para adicionar um veículo com imagens variadas
async function addVehicle(vehicle, sessionCookie, vehicleIndex) {
    try {
        const form = new FormData();

        // Adicionar campos
        form.append('marca', vehicle.marca);
        form.append('modelo', vehicle.modelo);
        form.append('ano', vehicle.ano.toString());
        form.append('km', vehicle.km.toString());
        form.append('preco', vehicle.preco.toString());
        form.append('cor', vehicle.cor);
        form.append('combustivel', vehicle.combustivel);
        form.append('cambio', vehicle.cambio);
        form.append('descricao', vehicle.descricao);
        form.append('destaque', vehicle.destaque ? '1' : '0');

        // Selecionar 10 imagens variadas para este veículo
        // Usaremos diferentes imagens para simular diferentes ângulos
        const numFotos = 10;
        const imagensParaVeiculo = [];

        for (let i = 0; i < numFotos; i++) {
            // Rotacionar pelas imagens disponíveis
            const imageIndex = (vehicleIndex * numFotos + i) % availableImages.length;
            imagensParaVeiculo.push(availableImages[imageIndex]);
        }

        // Adicionar as fotos ao formulário
        imagensParaVeiculo.forEach((imagePath, index) => {
            if (fs.existsSync(imagePath)) {
                const fileName = `${vehicle.marca}_${vehicle.modelo}_${index + 1}.png`.replace(/\s+/g, '_');
                form.append('images', fs.createReadStream(imagePath), fileName);
            }
        });

        console.log(`📸 ${imagensParaVeiculo.length} fotos preparadas para ${vehicle.marca} ${vehicle.modelo}`);

        // Fazer requisição
        const response = await axios.post(`${BASE_URL}/api/vehicles`, form, {
            headers: {
                ...form.getHeaders(),
                'Cookie': sessionCookie
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data.success) {
            console.log(`✅ ${vehicle.marca} ${vehicle.modelo} adicionado!`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Erro ao adicionar ${vehicle.marca} ${vehicle.modelo}:`, error.message);
        return false;
    }
}

// Função principal
async function seedDatabase() {
    console.log('\n🚗 ===================================');
    console.log('   SEED - Catálogo com 25 Veículos');
    console.log('   ===================================\n');

    // Login
    console.log('🔐 Fazendo login...');
    const sessionCookie = await login();

    if (!sessionCookie) {
        console.log('❌ Erro ao fazer login.');
        return;
    }

    console.log('✅ Login realizado!\n');

    // Adicionar veículos
    console.log(`📦 Adicionando ${vehicles.length} veículos...\n`);

    let successCount = 0;

    for (let i = 0; i < vehicles.length; i++) {
        const vehicle = vehicles[i];
        const success = await addVehicle(vehicle, sessionCookie, i);
        if (success) successCount++;

        await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('\n✨ ===================================');
    console.log(`   Processo concluído!`);
    console.log(`   ${successCount}/${vehicles.length} veículos adicionados`);
    console.log(`   Total de fotos: ~${successCount * 10}`);
    console.log('   ===================================\n');
    console.log('🌐 Acesse: http://localhost:3000\n');
}

seedDatabase().catch(console.error);
