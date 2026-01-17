const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('\n🗑️  Limpando banco de dados...\n');

db.serialize(() => {
    // Apagar todas as imagens
    db.run('DELETE FROM vehicle_images', (err) => {
        if (err) console.error('Erro ao limpar vehicle_images:', err);
        else console.log('✅ Imagens removidas');
    });

    // Apagar todos os veículos
    db.run('DELETE FROM vehicles', (err) => {
        if (err) console.error('Erro ao limpar vehicles:', err);
        else console.log('✅ Veículos removidos');
    });

    // Resetar os auto-increment IDs
    db.run('DELETE FROM sqlite_sequence WHERE name="vehicles"', (err) => {
        if (err) console.error('Erro ao resetar sequence:', err);
    });

    db.run('DELETE FROM sqlite_sequence WHERE name="vehicle_images"', (err) => {
        if (err) console.error('Erro ao resetar sequence:', err);
    });
});

db.close(() => {
    console.log('\n✨ Banco de dados limpo com sucesso!\n');
});
