const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Ошибка подключения к БД:', err);
        process.exit(1);
    }
});

console.log('Проверка пользователей в базе данных:\n');

// Сначала проверяем структуру таблицы
db.all("PRAGMA table_info(users)", [], (err, columns) => {
    if (err) {
        console.error('Ошибка при проверке структуры:', err);
        db.close();
        return;
    }
    
    console.log('Колонки в таблице users:');
    columns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });
    console.log('');

    // Получаем всех пользователей
    db.all('SELECT id, name, email, role, can_edit, created_at FROM users', [], (err, rows) => {
        if (err) {
            console.error('Ошибка при получении пользователей:', err);
            db.close();
            return;
        }

        if (rows.length === 0) {
            console.log('Пользователей в базе данных нет.');
        } else {
            console.log(`Найдено пользователей: ${rows.length}\n`);
            rows.forEach((user, index) => {
                console.log(`Пользователь ${index + 1}:`);
                console.log(`  ID: ${user.id}`);
                console.log(`  Имя: ${user.name || 'не указано'}`);
                console.log(`  Email: ${user.email}`);
                console.log(`  Роль: ${user.role || 'не указана'}`);
                console.log(`  Право на редактирование: ${user.can_edit === 1 ? 'Да' : 'Нет'}`);
                console.log(`  Создан: ${user.created_at || 'не указано'}`);
                console.log('');
            });

            // Проверяем администраторов
            const admins = rows.filter(u => u.role === 'admin');
            if (admins.length > 0) {
                console.log(`\nАдминистраторы (${admins.length}):`);
                admins.forEach(admin => {
                    console.log(`  - ${admin.email} (ID: ${admin.id})`);
                });
            } else {
                console.log('\nАдминистраторов не найдено.');
            }
        }

        db.close();
    });
});

