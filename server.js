const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { initDatabase, dbRun, dbGet, dbAll } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Criar pasta de uploads se não existir
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'catalogo-car-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Servir arquivos estáticos
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de autenticação
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Não autorizado' });
    }
};

// ==================== ROTAS DE AUTENTICAÇÃO ====================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await dbGet('SELECT * FROM users WHERE username = ?', [username]);

        if (!user) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Usuário ou senha inválidos' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ success: true, username: user.username });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
});

// Verificar autenticação
app.get('/api/auth/check', (req, res) => {
    if (req.session.userId) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ==================== ROTAS DE VEÍCULOS ====================

// Listar todos os veículos (público)
app.get('/api/vehicles', async (req, res) => {
    try {
        const { marca, modelo, anoMin, anoMax, kmMax, precoMin, precoMax, combustivel, cambio, search } = req.query;

        let query = 'SELECT * FROM vehicles WHERE 1=1';
        const params = [];

        if (marca && marca !== 'todas') {
            query += ' AND marca = ?';
            params.push(marca);
        }

        if (modelo && modelo !== 'todos') {
            query += ' AND modelo = ?';
            params.push(modelo);
        }

        if (anoMin) {
            query += ' AND ano >= ?';
            params.push(parseInt(anoMin));
        }

        if (anoMax) {
            query += ' AND ano <= ?';
            params.push(parseInt(anoMax));
        }

        if (kmMax) {
            query += ' AND km <= ?';
            params.push(parseInt(kmMax));
        }

        if (precoMin) {
            query += ' AND preco >= ?';
            params.push(parseFloat(precoMin));
        }

        if (precoMax) {
            query += ' AND preco <= ?';
            params.push(parseFloat(precoMax));
        }

        if (combustivel && combustivel !== 'todos') {
            query += ' AND combustivel = ?';
            params.push(combustivel);
        }

        if (cambio && cambio !== 'todos') {
            query += ' AND cambio = ?';
            params.push(cambio);
        }

        if (search) {
            query += ' AND (marca LIKE ? OR modelo LIKE ? OR descricao LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC';

        const vehicles = await dbAll(query, params);

        // Buscar imagens para cada veículo
        const vehiclesWithImages = await Promise.all(vehicles.map(async (vehicle) => {
            const images = await dbAll(
                'SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, order_index ASC',
                [vehicle.id]
            );
            return { ...vehicle, images };
        }));

        res.json(vehiclesWithImages);
    } catch (error) {
        console.error('Erro ao listar veículos:', error);
        res.status(500).json({ error: 'Erro ao listar veículos' });
    }
});

// Obter marcas disponíveis
app.get('/api/vehicles/marcas', async (req, res) => {
    try {
        const marcas = await dbAll('SELECT DISTINCT marca FROM vehicles ORDER BY marca');
        res.json(marcas.map(m => m.marca));
    } catch (error) {
        console.error('Erro ao buscar marcas:', error);
        res.status(500).json({ error: 'Erro ao buscar marcas' });
    }
});

// Obter modelos disponíveis
app.get('/api/vehicles/modelos', async (req, res) => {
    try {
        const { marca } = req.query;
        let query = 'SELECT DISTINCT modelo FROM vehicles';
        const params = [];

        if (marca && marca !== 'todas') {
            query += ' WHERE marca = ?';
            params.push(marca);
        }

        query += ' ORDER BY modelo';

        const modelos = await dbAll(query, params);
        res.json(modelos.map(m => m.modelo));
    } catch (error) {
        console.error('Erro ao buscar modelos:', error);
        res.status(500).json({ error: 'Erro ao buscar modelos' });
    }
});

// Obter veículo por ID
app.get('/api/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await dbGet('SELECT * FROM vehicles WHERE id = ?', [req.params.id]);

        if (!vehicle) {
            return res.status(404).json({ error: 'Veículo não encontrado' });
        }

        const images = await dbAll(
            'SELECT * FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, order_index ASC',
            [vehicle.id]
        );

        res.json({ ...vehicle, images });
    } catch (error) {
        console.error('Erro ao buscar veículo:', error);
        res.status(500).json({ error: 'Erro ao buscar veículo' });
    }
});

// Criar veículo (admin)
app.post('/api/vehicles', requireAuth, upload.array('images', 20), async (req, res) => {
    try {
        const { marca, modelo, ano, km, preco, cor, combustivel, cambio, descricao, destaque } = req.body;

        // Inserir veículo
        const result = await dbRun(
            `INSERT INTO vehicles (marca, modelo, ano, km, preco, cor, combustivel, cambio, descricao, destaque)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
            [marca, modelo, parseInt(ano), parseInt(km), parseFloat(preco), cor, combustivel, cambio, descricao, destaque ? 1 : 0]
        );

        const vehicleId = result.lastID;

        // Inserir imagens
        if (req.files && req.files.length > 0) {
            for (let i = 0; i < req.files.length; i++) {
                const isPrimary = i === 0 ? 1 : 0; // Primeira imagem é a principal
                await dbRun(
                    'INSERT INTO vehicle_images (vehicle_id, image_path, is_primary, order_index) VALUES (?, ?, ?, ?)',
                    [vehicleId, `/uploads/${req.files[i].filename}`, isPrimary, i]
                );
            }
        }

        res.json({ success: true, id: vehicleId });
    } catch (error) {
        console.error('Erro ao criar veículo:', error);
        res.status(500).json({ error: 'Erro ao criar veículo' });
    }
});

// Adicionar imagem via URL externa (admin)
app.post('/api/vehicles/:id/image-url', requireAuth, async (req, res) => {
    try {
        const vehicleId = req.params.id;
        const { imageUrl, isPrimary, orderIndex } = req.body;

        await dbRun(
            'INSERT INTO vehicle_images (vehicle_id, image_path, is_primary, order_index) VALUES (?, ?, ?, ?)',
            [vehicleId, imageUrl, isPrimary ? 1 : 0, orderIndex || 0]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
        res.status(500).json({ error: 'Erro ao adicionar imagem' });
    }
});

// Atualizar veículo (admin)
app.put('/api/vehicles/:id', requireAuth, upload.array('images', 20), async (req, res) => {
    try {
        const { marca, modelo, ano, km, preco, cor, combustivel, cambio, descricao, destaque, removeImages } = req.body;

        // Atualizar veículo
        await dbRun(
            `UPDATE vehicles SET marca = ?, modelo = ?, ano = ?, km = ?, preco = ?, cor = ?, combustivel = ?, cambio = ?, descricao = ?, destaque = ?
       WHERE id = ?`,
            [marca, modelo, parseInt(ano), parseInt(km), parseFloat(preco), cor, combustivel, cambio, descricao, destaque ? 1 : 0, req.params.id]
        );

        // Remover imagens deletadas
        if (removeImages) {
            const imageIds = JSON.parse(removeImages);
            for (const imageId of imageIds) {
                const image = await dbGet('SELECT image_path FROM vehicle_images WHERE id = ?', [imageId]);
                if (image) {
                    const imagePath = path.join(__dirname, image.image_path);
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                    await dbRun('DELETE FROM vehicle_images WHERE id = ?', [imageId]);
                }
            }
        }

        // Adicionar novas imagens
        if (req.files && req.files.length > 0) {
            const existingImages = await dbAll('SELECT COUNT(*) as count FROM vehicle_images WHERE vehicle_id = ?', [req.params.id]);
            const startIndex = existingImages[0].count;

            for (let i = 0; i < req.files.length; i++) {
                await dbRun(
                    'INSERT INTO vehicle_images (vehicle_id, image_path, is_primary, order_index) VALUES (?, ?, ?, ?)',
                    [req.params.id, `/uploads/${req.files[i].filename}`, 0, startIndex + i]
                );
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao atualizar veículo:', error);
        res.status(500).json({ error: 'Erro ao atualizar veículo' });
    }
});

// Deletar veículo (admin)
app.delete('/api/vehicles/:id', requireAuth, async (req, res) => {
    try {
        // Buscar imagens para deletar arquivos
        const images = await dbAll('SELECT image_path FROM vehicle_images WHERE vehicle_id = ?', [req.params.id]);

        // Deletar arquivos de imagem
        for (const image of images) {
            const imagePath = path.join(__dirname, image.image_path);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Deletar imagens do banco
        await dbRun('DELETE FROM vehicle_images WHERE vehicle_id = ?', [req.params.id]);

        // Deletar veículo
        await dbRun('DELETE FROM vehicles WHERE id = ?', [req.params.id]);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao deletar veículo:', error);
        res.status(500).json({ error: 'Erro ao deletar veículo' });
    }
});

// Estatísticas (admin)
app.get('/api/stats', requireAuth, async (req, res) => {
    try {
        const totalVehicles = await dbGet('SELECT COUNT(*) as count FROM vehicles');
        const totalValue = await dbGet('SELECT SUM(preco) as total FROM vehicles');
        const recentVehicles = await dbGet('SELECT COUNT(*) as count FROM vehicles WHERE created_at >= NOW() - INTERVAL \'7 days\'');

        res.json({
            totalVehicles: totalVehicles.count,
            totalValue: totalValue.total || 0,
            recentVehicles: recentVehicles.count
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ error: 'Erro ao buscar estatísticas' });
    }
});

// Rota raiz redireciona para catálogo público
app.get('/', (req, res) => {
    res.redirect('/index.html');
});

// Inicializar servidor
async function startServer() {
    try {
        await initDatabase();
        console.log('✅ Banco de dados inicializado');

        app.listen(PORT, () => {
            console.log(`\n🚗 ===================================`);
            console.log(`   CATÁLOGO DE CARROS - Sistema Online`);
            console.log(`   ===================================`);
            console.log(`\n   📱 Catálogo Público: http://localhost:${PORT}`);
            console.log(`   🔐 Painel Admin: http://localhost:${PORT}/admin/login.html`);
            console.log(`\n   Credenciais Admin:`);
            console.log(`   Username: admin`);
            console.log(`   Password: admin123`);
            console.log(`\n   ===================================\n`);
        });
    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error);
        process.exit(1);
    }
}

startServer();
