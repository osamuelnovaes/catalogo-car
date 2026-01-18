const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Configuração do Pool PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Inicializar banco de dados
async function initDatabase() {
  const client = await pool.connect();

  try {
    // Tabela de usuários admin
    await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    // Tabela de veículos
    await client.query(`
            CREATE TABLE IF NOT EXISTS vehicles (
                id SERIAL PRIMARY KEY,
                marca TEXT NOT NULL,
                modelo TEXT NOT NULL,
                ano INTEGER NOT NULL,
                km INTEGER NOT NULL,
                preco NUMERIC NOT NULL,
                cor TEXT,
                combustivel TEXT,
                cambio TEXT,
                descricao TEXT,
                destaque BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    // Tabela de imagens dos veículos
    await client.query(`
            CREATE TABLE IF NOT EXISTS vehicle_images (
                id SERIAL PRIMARY KEY,
                vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
                image_path TEXT NOT NULL,
                is_primary BOOLEAN DEFAULT FALSE,
                order_index INTEGER DEFAULT 0
            )
        `);

    // Criar usuário admin padrão
    await createDefaultAdmin(client);

    console.log('✅ Banco de dados PostgreSQL inicializado');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Criar usuário admin padrão
async function createDefaultAdmin(client) {
  const result = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);

  if (result.rows.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      ['admin', hashedPassword]
    );
    console.log('✅ Usuário admin criado (username: admin, password: admin123)');
  } else {
    console.log('✅ Usuário admin já existe');
  }
}

// Funções auxiliares compatíveis com a interface anterior
const dbRun = async (sql, params = []) => {
  // Converter placeholders ? para $1, $2, etc (formato PostgreSQL)
  let pgSql = sql;
  let paramIndex = 1;
  while (pgSql.includes('?')) {
    pgSql = pgSql.replace('?', `$${paramIndex}`);
    paramIndex++;
  }

  const result = await pool.query(pgSql, params);

  // Simular o comportamento do SQLite para INSERT (lastID)
  return {
    lastID: result.rows[0]?.id || null,
    changes: result.rowCount
  };
};

const dbGet = async (sql, params = []) => {
  // Converter placeholders ? para $1, $2, etc
  let pgSql = sql;
  let paramIndex = 1;
  while (pgSql.includes('?')) {
    pgSql = pgSql.replace('?', `$${paramIndex}`);
    paramIndex++;
  }

  const result = await pool.query(pgSql, params);
  return result.rows[0] || null;
};

const dbAll = async (sql, params = []) => {
  // Converter placeholders ? para $1, $2, etc
  let pgSql = sql;
  let paramIndex = 1;
  while (pgSql.includes('?')) {
    pgSql = pgSql.replace('?', `$${paramIndex}`);
    paramIndex++;
  }

  const result = await pool.query(pgSql, params);
  return result.rows;
};

module.exports = {
  pool,
  initDatabase,
  dbRun,
  dbGet,
  dbAll
};
