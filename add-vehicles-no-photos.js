const axios = require('axios');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';

// Carregar os dados dos veículos
const vehiclesData = JSON.parse(fs.readFileSync('./vehicles-final.json', 'utf8'));

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

// Função para adicionar um veículo SEM FOTOS
async function addVehicle(vehicle, sessionCookie) {
    try {
        const response = await axios.post(`${BASE_URL}/api/vehicles`, {
            marca: vehicle.marca,
            modelo: vehicle.modelo,
            ano: vehicle.ano,
            km: vehicle.km,
            preco: vehicle.preco,
            cor: vehicle.cor,
            combustivel: vehicle.combustivel,
            cambio: vehicle.cambio,
            descricao: vehicle.descricao,
            destaque: vehicle.destaque ? 1 : 0
        }, {
            headers: {
                'Cookie': sessionCookie,
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            console.log(`✅ ${vehicle.marca} ${vehicle.modelo} - R$ ${vehicle.preco.toLocaleString('pt-BR')}`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Erro ao adicionar ${vehicle.marca} ${vehicle.modelo}:`, error.message);
        return false;
    }
}

// Função principal
async function seedDatabase() {
    console.log('\n🚗 ======================================');
    console.log('   ADICIONANDO 35 VEÍCULOS AO CATÁLOGO');
    console.log('   ======================================\n');

    // Login
    console.log('🔐 Fazendo login...');
    const sessionCookie = await login();

    if (!sessionCookie) {
        console.log('❌ Erro ao fazer login.');
        return;
    }

    console.log('✅ Login realizado!\n');

    // Adicionar veículos
    console.log(`📦 Adicionando ${vehiclesData.length} veículos SEM FOTOS...\n`);
    console.log('💡 Você poderá adicionar fotos depois pelo painel admin!\n');

    let successCount = 0;

    for (const vehicle of vehiclesData) {
        const success = await addVehicle(vehicle, sessionCookie);
        if (success) successCount++;

        // Pequeno delay para não sobrecarregar o servidor
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('\n✨ ======================================');
    console.log(`   Processo concluído!`);
    console.log(`   ${successCount}/${vehiclesData.length} veículos adicionados`);
    console.log('   ======================================\n');
    console.log('🌐 Acesse o catálogo: http://localhost:3000');
    console.log('🔐 Edite pelo admin: http://localhost:3000/admin/dashboard.html\n');
    console.log('📸 Próximo passo: Adicionar fotos reais editando cada veículo!\n');
}

seedDatabase().catch(console.error);
