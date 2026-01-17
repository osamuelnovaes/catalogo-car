const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const ARTIFACTS_DIR = '/Users/samuelnovaes/.gemini/antigravity/brain/0eb2690b-154f-4325-b0c2-6948b4402141';

// Mapear fotos por tipo de veículo
const photosByType = {
    sedan: [
        'sedan_front_angle',
        'sedan_side_view',
        'sedan_rear_angle',
        'car_interior_dashboard',
        'car_interior_seats',
        'car_wheel_detail'
    ],
    suv: [
        'suv_front_angle',
        'suv_side_view',
        'suv_rear_angle',
        'car_interior_dashboard',
        'car_interior_seats',
        'car_wheel_detail'
    ],
    hatch: [
        'hatch_front_angle',
        'hatch_side_view',
        'hatch_rear_angle',
        'car_interior_dashboard',
        'car_interior_seats',
        'car_wheel_detail'
    ],
    pickup: [
        'pickup_front_angle',
        'pickup_side_view',
        'pickup_rear_angle',
        'car_interior_dashboard',
        'car_interior_seats',
        'car_wheel_detail'
    ]
};

// Mapear veículos para tipos
const vehicleTypeMap = {
    // Sedans
    'Corolla': 'sedan',
    'Civic': 'sedan',
    'Versa': 'sedan',
    'HB20S': 'sedan',
    'Virtus': 'sedan',
    'Onix Plus': 'sedan',
    'Camry': 'sedan',
    'Accord': 'sedan',
    'Jetta': 'sedan',

    // Hatches
    'HB20 Comfort': 'hatch',
    'Argo': 'hatch',
    'Polo': 'hatch',
    'Kwid': 'hatch',
    'Mobi': 'hatch',
    'Gol': 'hatch',
    'Onix 1.0': 'hatch',

    // SUVs
    'HR-V': 'suv',
    'Kicks': 'suv',
    'Creta': 'suv',
    'T-Cross': 'suv',
    'Renegade': 'suv',
    '2008': 'suv',
    'Pulse': 'suv',
    'Compass': 'suv',
    'Taos': 'suv',
    'Tiggo': 'suv',
    'Nivus': 'suv',
    'Tracker': 'suv',
    'SW4': 'suv',
    'Grand Cherokee': 'suv',
    'Cooper': 'suv',

    // Picapes
    'Hilux': 'pickup',
    'Ranger': 'pickup',
    'S10': 'pickup',
    'L200': 'pickup'
};

// Função para determinar tipo do veículo
function getVehicleType(modelo) {
    for (const [key, type] of Object.entries(vehicleTypeMap)) {
        if (modelo.includes(key)) {
            return type;
        }
    }
    return 'sedan'; // default
}

// Função para encontrar imagens no diretório
function findImages(photoNames) {
    const images = [];
    const files = fs.readdirSync(ARTIFACTS_DIR);

    for (const photoName of photoNames) {
        const matchingFile = files.find(f =>
            f.startsWith(photoName) && f.endsWith('.png')
        );

        if (matchingFile) {
            images.push(path.join(ARTIFACTS_DIR, matchingFile));
        }
    }

    return images;
}

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

// Função para obter todos os veículos
async function getVehicles(sessionCookie) {
    try {
        const response = await axios.get(`${BASE_URL}/api/vehicles`, {
            headers: {
                'Cookie': sessionCookie
            }
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao obter veículos:', error.message);
        return [];
    }
}

// Função para atualizar veículo com fotos
async function updateVehicleWithPhotos(vehicle, sessionCookie) {
    try {
        const vehicleType = getVehicleType(vehicle.modelo);
        const photoNames = photosByType[vehicleType];
        const imagePaths = findImages(photoNames);

        if (imagePaths.length === 0) {
            console.log(`⚠️  Nenhuma foto encontrada para ${vehicle.marca} ${vehicle.modelo}`);
            return false;
        }

        const form = new FormData();

        // Adicionar dados do veículo
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

        // Adicionar fotos
        imagePaths.forEach((imagePath, index) => {
            if (fs.existsSync(imagePath)) {
                const fileName = `${vehicle.modelo.replace(/\s+/g, '_')}_${index + 1}.png`;
                form.append('images', fs.createReadStream(imagePath), fileName);
            }
        });

        // Fazer requisição de atualização
        const response = await axios.put(`${BASE_URL}/api/vehicles/${vehicle.id}`, form, {
            headers: {
                ...form.getHeaders(),
                'Cookie': sessionCookie
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        });

        if (response.data.success) {
            console.log(`✅ ${vehicle.marca} ${vehicle.modelo} - ${imagePaths.length} fotos (${vehicleType})`);
            return true;
        }
    } catch (error) {
        console.error(`❌ Erro ao atualizar ${vehicle.marca} ${vehicle.modelo}:`, error.message);
        return false;
    }
}

// Função principal
async function updateAllVehiclesWithPhotos() {
    console.log('\n🚗 ==========================================');
    console.log('   ATUALIZANDO 35 VEÍCULOS COM FOTOS');
    console.log('   ==========================================\n');

    // Login
    console.log('🔐 Fazendo login...');
    const sessionCookie = await login();

    if (!sessionCookie) {
        console.log('❌ Erro ao fazer login.');
        return;
    }

    console.log('✅ Login realizado!\n');

    // Obter todos os veículos
    console.log('📦 Buscando veículos cadastrados...');
    const vehicles = await getVehicles(sessionCookie);

    if (!vehicles || vehicles.length === 0) {
        console.log('❌ Nenhum veículo encontrado no banco.');
        return;
    }

    console.log(`✅ ${vehicles.length} veículos encontrados!\n`);
    console.log('📸 Adicionando fotos a cada veículo...\n');

    let successCount = 0;
    let totalPhotos = 0;

    for (const vehicle of vehicles) {
        const success = await updateVehicleWithPhotos(vehicle, sessionCookie);
        if (success) {
            successCount++;
            const vehicleType = getVehicleType(vehicle.modelo);
            totalPhotos += photosByType[vehicleType].length;
        }

        // Delay para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 800));
    }

    console.log('\n✨ ==========================================');
    console.log(`   Processo concluído!`);
    console.log(`   ${successCount}/${vehicles.length} veículos atualizados`);
    console.log(`   ~${totalPhotos} fotos adicionadas ao catálogo`);
    console.log('   ==========================================\n');
    console.log('🌐 Acesse o catálogo: http://localhost:3000\n');
}

updateAllVehiclesWithPhotos().catch(console.error);
