const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs').promises;

const dbPath = path.join(__dirname, 'database.sqlite');
const ARTIFACTS_DIR = '/Users/samuelnovaes/.gemini/antigravity/brain/0eb2690b-154f-4325-b0c2-6948b4402141';
const UPLOADS_DIR = path.join(__dirname, 'uploads');

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
    'Corolla': 'sedan',
    'Civic': 'sedan',
    'Versa': 'sedan',
    'HB20S': 'sedan',
    'Virtus': 'sedan',
    'Onix Plus': 'sedan',
    'Camry': 'sedan',
    'Accord': 'sedan',
    'Jetta': 'sedan',
    'HB20 Comfort': 'hatch',
    'Argo': 'hatch',
    'Polo': 'hatch',
    'Kwid': 'hatch',
    'Mobi': 'hatch',
    'Gol': 'hatch',
    'Onix 1.0': 'hatch',
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
    'Hilux': 'pickup',
    'Ranger': 'pickup',
    'S10': 'pickup',
    'L200': 'pickup'
};

function getVehicleType(modelo) {
    for (const [key, type] of Object.entries(vehicleTypeMap)) {
        if (modelo.includes(key)) {
            return type;
        }
    }
    return 'sedan';
}

async function findImages(photoNames) {
    const images = [];
    const files = await fs.readdir(ARTIFACTS_DIR);

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

async function copyImageToUploads(sourcePath, vehicleModelo, index) {
    const fileName = `${vehicleModelo.replace(/\s+/g, '_')}_${index}_${Date.now()}.png`;
    const destPath = path.join(UPLOADS_DIR, fileName);
    await fs.copyFile(sourcePath, destPath);
    return `/uploads/${fileName}`;
}

async function addPhotosToVehicle(db, vehicle) {
    return new Promise(async (resolve, reject) => {
        try {
            const vehicleType = getVehicleType(vehicle.modelo);
            const photoNames = photosByType[vehicleType];
            const imagePaths = await findImages(photoNames);

            if (imagePaths.length === 0) {
                console.log(`⚠️  Nenhuma foto encontrada para ${vehicle.marca} ${vehicle.modelo}`);
                resolve(0);
                return;
            }

            let photosAdded = 0;

            for (let i = 0; i < imagePaths.length; i++) {
                const imagePath = imagePaths[i];
                const uploadPath = await copyImageToUploads(imagePath, vehicle.modelo, i + 1);
                const isPrimary = i === 0 ? 1 : 0;

                await new Promise((res, rej) => {
                    db.run(
                        'INSERT INTO vehicle_images (vehicle_id, image_path, is_primary, order_index) VALUES (?, ?, ?, ?)',
                        [vehicle.id, uploadPath, isPrimary, i],
                        (err) => {
                            if (err) rej(err);
                            else {
                                photosAdded++;
                                res();
                            }
                        }
                    );
                });
            }

            console.log(`✅ ${vehicle.marca} ${vehicle.modelo} - ${photosAdded} fotos (${vehicleType})`);
            resolve(photosAdded);

        } catch (error) {
            console.error(`❌ Erro ao adicionar fotos em ${vehicle.marca} ${vehicle.modelo}:`, error.message);
            resolve(0);
        }
    });
}

async function main() {
    console.log('\n🚗 ==========================================');
    console.log('   ADICIONANDO FOTOS AOS 35 VEÍCULOS');
    console.log('   ==========================================\n');

    const db = new sqlite3.Database(dbPath);

    // Buscar todos os veículos
    const vehicles = await new Promise((resolve, reject) => {
        db.all('SELECT * FROM vehicles', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });

    console.log(`📦 ${vehicles.length} veículos encontrados\n`);
    console.log('📸 Adicionando fotos...\n');

    let totalPhotos = 0;
    let successCount = 0;

    for (const vehicle of vehicles) {
        const photosAdded = await addPhotosToVehicle(db, vehicle);
        if (photosAdded > 0) {
            successCount++;
            totalPhotos += photosAdded;
        }
    }

    db.close();

    console.log('\n✨ ==========================================');
    console.log(`   Processo concluído!`);
    console.log(`   ${successCount}/${vehicles.length} veículos atualizados`);
    console.log(`   ${totalPhotos} fotos adicionadas`);
    console.log('   ==========================================\n');
    console.log('🌐 Acesse: http://localhost:3000\n');
}

main().catch(console.error);
