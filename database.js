const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Inicializar banco de dados
function initDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabela de usuários admin
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de veículos
      db.run(`
        CREATE TABLE IF NOT EXISTS vehicles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          marca TEXT NOT NULL,
          modelo TEXT NOT NULL,
          ano INTEGER NOT NULL,
          km INTEGER NOT NULL,
          preco REAL NOT NULL,
          cor TEXT,
          combustivel TEXT,
          cambio TEXT,
          descricao TEXT,
          destaque BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabela de imagens dos veículos
      db.run(`
        CREATE TABLE IF NOT EXISTS vehicle_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          vehicle_id INTEGER NOT NULL,
          image_path TEXT NOT NULL,
          is_primary BOOLEAN DEFAULT 0,
          order_index INTEGER DEFAULT 0,
          FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
        )
      `, (err) => {
        if (err) {
          reject(err);
        } else {
          // Criar usuário admin padrão
          createDefaultAdmin().then(resolve).catch(reject);
        }
      });
    });
  });
}

// Criar usuário admin padrão
async function createDefaultAdmin() {
  return new Promise(async (resolve, reject) => {
    db.get('SELECT * FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      
      if (!row) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.run(
          'INSERT INTO users (username, password) VALUES (?, ?)',
          ['admin', hashedPassword],
          (err) => {
            if (err) {
              reject(err);
            } else {
              console.log('✅ Usuário admin criado (username: admin, password: admin123)');
              resolve();
            }
          }
        );
      } else {
        console.log('✅ Usuário admin já existe');
        resolve();
      }
    });
  });
}

// Funções auxiliares
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = {
  db,
  initDatabase,
  dbRun,
  dbGet,
  dbAll
};
