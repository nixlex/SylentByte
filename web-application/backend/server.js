// Подключаем необходимые модули
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// Подключаем базу
const Database = require('./database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Инициализация Express и порта
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Инициализация базы данных
let db;
const initDatabase = async () => {
    try {
        db = new Database();
        await db.init();
        console.log('База данных инициализирована');
        return db;
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error);
        throw error;
    }
};

// Middleware для обработки ошибок базы данных
app.use((req, res, next) => {
    if (!db || !db.db) {
        return res.status(503).json({
            success: false,
            error: 'База данных не готова'
        });
    }
    req.db = db;
    next();
});

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Токен не предоставлен'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: 'Недействительный токен'
            });
        }
        req.user = user;
        next();
    });
};

// Регистрация пользователя
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email и пароль обязательны'
            });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const result = await db.register({ name, email, password: hashedPassword });

        const queryUser = `SELECT id, name, email, role, can_edit FROM users WHERE id = ?`;
        db.db.get(queryUser, [result.id], (err, userData) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка сервера'
                });
            }

            const token = jwt.sign(
                { id: result.id, email: result.email, role: userData.role },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: userData.id,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    can_edit: userData.can_edit === 1
                }
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Авторизация пользователя
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email и пароль обязательны'
            });
        }

        const query = `SELECT id, name, email, password FROM users WHERE email = ?`;
        db.db.get(query, [email], async (err, user) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка сервера'
                });
            }

            if (!user || !bcrypt.compareSync(password, user.password)) {
                return res.status(401).json({
                    success: false,
                    error: 'Неверный email или пароль'
                });
            }

            const queryUser = `SELECT id, name, email, role, can_edit FROM users WHERE id = ?`;
            db.db.get(queryUser, [user.id], (err, userData) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        error: 'Ошибка сервера'
                    });
                }

                const token = jwt.sign(
                    { id: user.id, email: user.email, role: userData.role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    success: true,
                    token,
                    user: {
                        id: userData.id,
                        email: userData.email,
                        name: userData.name,
                        role: userData.role,
                        can_edit: userData.can_edit === 1
                    }
                });
            });
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            error: error.message
        });
    }
});

// Получение всех товаров
app.get('/api/products', async (req, res) => {
    try {
        const products = await db.getAllProducts();
        res.json({
            success: true,
            data: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Получение товара по ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const product = await db.getProductById(productId);
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
});

// Получение отзывов по product_id
app.get('/api/products/:id/reviews', async (req, res) => {
    try {
        const productId = parseInt(req.params.id);
        const reviews = await db.getReviewsByProductId(productId);
        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Получение отзывов по user_id
app.get('/api/users/:id/reviews', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const reviews = await db.getReviewsByUserId(userId);
        res.json({
            success: true,
            data: reviews,
            count: reviews.length
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Создание отзыва
app.post('/api/reviews', async (req, res) => {
    try {
        const { user_id, product_id, review, stars } = req.body;
        const result = await db.createReview({
            user_id: parseInt(user_id),
            product_id: parseInt(product_id),
            review,
            stars: parseInt(stars)
        });
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Получение всех магазинов
app.get('/api/shops', async (req, res) => {
    try {
        const shops = await db.getAllShops();
        res.json({
            success: true,
            data: shops,
            count: shops.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Создание товара
app.post('/api/products', async (req, res) => {
    try {
        const { name, price, description, image_url, category } = req.body;
        const result = await db.createProduct({
            name,
            price: parseFloat(price),
            description,
            image_url,
            category
        });
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Создание магазина
app.post('/api/shops', async (req, res) => {
    try {
        const { address, phone, latitude, longitude } = req.body;
        const result = await db.createShop({
            address,
            phone,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null
        });
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Middleware для проверки прав администратора
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            error: 'Доступ запрещен. Требуются права администратора'
        });
    }
    next();
};

// Middleware для проверки прав на редактирование
const canEdit = (req, res, next) => {
    const query = `SELECT can_edit, role FROM users WHERE id = ?`;
    db.db.get(query, [req.user.id], (err, user) => {
        if (err || !user) {
            return res.status(500).json({
                success: false,
                error: 'Ошибка проверки прав'
            });
        }
        if (user.role === 'admin' || user.can_edit === 1) {
            req.canEdit = true;
            next();
        } else {
            return res.status(403).json({
                success: false,
                error: 'У вас нет прав на редактирование'
            });
        }
    });
};

// Получение данных для дэшборда (требует авторизации)
app.get('/api/dashboard/data', authenticateToken, async (req, res) => {
    try {
        const queryUser = `SELECT role, can_edit FROM users WHERE id = ?`;
        db.db.get(queryUser, [req.user.id], async (err, userData) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка сервера'
                });
            }

            const projects = await db.getProjectsByUserId(req.user.id);

            res.json({
                success: true,
                data: projects,
                user: {
                    role: userData.role,
                    can_edit: userData.can_edit === 1
                }
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Создание проекта (требует права на редактирование)
app.post('/api/projects', authenticateToken, canEdit, async (req, res) => {
    try {
        const { project, status, date, amount } = req.body;
        const result = await db.createProject({
            user_id: req.user.id,
            project,
            status,
            date,
            amount: parseInt(amount)
        });
        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Обновление проекта (требует права на редактирование)
app.put('/api/projects/:id', authenticateToken, canEdit, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const { project, status, date, amount } = req.body;

        const query = `UPDATE projects SET project = ?, status = ?, date = ?, amount = ? WHERE id = ? AND user_id = ?`;
        db.db.run(query, [project, status, date, parseInt(amount), projectId, req.user.id], function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка обновления проекта'
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Проект не найден'
                });
            }
            res.json({
                success: true,
                message: 'Проект обновлен'
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Удаление проекта (требует права на редактирование)
app.delete('/api/projects/:id', authenticateToken, canEdit, async (req, res) => {
    try {
        const projectId = parseInt(req.params.id);
        const query = `DELETE FROM projects WHERE id = ? AND user_id = ?`;
        db.db.run(query, [projectId, req.user.id], function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка удаления проекта'
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Проект не найден'
                });
            }
            res.json({
                success: true,
                message: 'Проект удален'
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Получение всех пользователей (только для админа)
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
    try {
        const query = `SELECT id, name, email, role, can_edit, created_at FROM users`;
        db.db.all(query, [], (err, users) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка сервера'
                });
            }
            res.json({
                success: true,
                data: users.map(u => ({
                    ...u,
                    can_edit: u.can_edit === 1
                }))
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Обновление прав пользователя (только для админа)
app.put('/api/users/:id/permissions', authenticateToken, isAdmin, async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const { can_edit } = req.body;

        const query = `UPDATE users SET can_edit = ? WHERE id = ?`;
        db.db.run(query, [can_edit ? 1 : 0, userId], function (err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: 'Ошибка обновления прав'
                });
            }
            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Пользователь не найден'
                });
            }
            res.json({
                success: true,
                message: 'Права обновлены'
            });
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// Корневой маршрут
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API работает',
        endpoints: {
            auth: {
                register: 'POST /api/register',
                login: 'POST /api/login'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:id',
                create: 'POST /api/products'
            },
            reviews: {
                getByProduct: 'GET /api/products/:id/reviews',
                getByUser: 'GET /api/users/:id/reviews',
                create: 'POST /api/reviews'
            },
            shops: {
                getAll: 'GET /api/shops',
                create: 'POST /api/shops'
            }
        }
    });
});

// Middleware для обработки ошибок
app.use((error, req, res, next) => {
    console.error('Ошибка сервера:', error);
    res.status(500).json({
        success: false,
        error: 'Внутренняя ошибка сервера'
    });
});

// Миграция: добавление колонок role и can_edit, если их нет
const migrateDatabase = async () => {
    return new Promise((resolve, reject) => {
        if (!db || !db.db) {
            console.error('База данных не инициализирована');
            return resolve();
        }

        // Проверяем структуру таблицы users
        db.db.all("PRAGMA table_info(users)", [], (err, columns) => {
            if (err) {
                console.error('Ошибка при проверке структуры таблицы:', err);
                return resolve();
            }

            const columnNames = columns.map(col => col.name);
            const migrations = [];

            // Проверяем наличие колонки role
            if (!columnNames.includes('role')) {
                migrations.push("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'");
            }

            // Проверяем наличие колонки can_edit
            if (!columnNames.includes('can_edit')) {
                migrations.push("ALTER TABLE users ADD COLUMN can_edit INTEGER DEFAULT 0");
            }

            // Выполняем миграции
            if (migrations.length > 0) {
                console.log(`Выполняется миграция: добавление ${migrations.length} колонок в таблицу users`);
                let completed = 0;
                migrations.forEach((migration, index) => {
                    db.db.run(migration, [], (err) => {
                        if (err) {
                            console.error(`Ошибка при выполнении миграции ${index + 1}:`, err);
                        } else {
                            console.log(`Миграция ${index + 1} выполнена успешно`);
                        }
                        completed++;
                        if (completed === migrations.length) {
                            resolve();
                        }
                    });
                });
            } else {
                resolve();
            }
        });
    });
};

// Создание тестового пользователя и админа при первом запуске
const createTestUser = async () => {
    return new Promise((resolve, reject) => {
        if (!db || !db.db) {
            console.error('База данных не инициализирована');
            return resolve();
        }

        const query = `SELECT COUNT(*) as count FROM users WHERE email = ?`;
        db.db.get(query, ['demo@example.com'], async (err, row) => {
            if (err) {
                console.error('Ошибка при проверке пользователя:', err);
                return resolve();
            }

            if (row && row.count === 0) {
                const hashedPassword = bcrypt.hashSync('password123', 10);
                try {
                    await db.register({
                        name: 'Demo User',
                        email: 'demo@example.com',
                        password: hashedPassword
                    });
                    const updateQuery = `UPDATE users SET can_edit = 1 WHERE email = ?`;
                    db.db.run(updateQuery, ['demo@example.com']);
                    console.log('Тестовый пользователь создан: demo@example.com / password123 (с правами на редактирование)');
                } catch (error) {
                    console.error('Ошибка при создании тестового пользователя:', error);
                }
            }

            // Проверяем и создаем администратора
            // Сначала проверяем наличие колонки role
            db.db.all("PRAGMA table_info(users)", [], (err, columns) => {
                if (err) {
                    console.error('Ошибка при проверке структуры таблицы:', err);
                    return resolve();
                }

                const columnNames = columns.map(col => col.name);
                const hasRoleColumn = columnNames.includes('role');

                const checkAndCreateAdmin = () => {
                    if (!hasRoleColumn) {
                        // Если колонки role нет, проверяем по email
                        const adminQuery = `SELECT COUNT(*) as count FROM users WHERE email = 'Frontex@jaber.com'`;
                        db.db.get(adminQuery, [], async (err, adminRow) => {
                            if (err) {
                                return resolve();
                            }

                            if (adminRow && adminRow.count === 0) {
                                const hashedPassword = bcrypt.hashSync('frontexceo', 10);
                                const insertQuery = `INSERT INTO users (name, email, password, can_edit) VALUES (?, ?, ?, ?)`;
                                db.db.run(insertQuery, ['CEO Frontex', 'Frontex@jb.com', hashedPassword, 1], (err) => {
                                    if (!err) {
                                        console.log('Пользователь создан: Frontex@jb.com / frontexceo (роль будет установлена после миграции)');
                                    }
                                    resolve();
                                });
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        // Обновляем существующего пользователя с ролью 'frontexceo' на 'admin'
                        const updateOldAdminQuery = `UPDATE users SET role = 'admin' WHERE role = 'frontexceo'`;
                        db.db.run(updateOldAdminQuery, [], (err) => {
                            if (err && !err.message.includes('no such column')) {
                                console.error('Ошибка при обновлении роли администратора:', err);
                            }

                            // Проверяем наличие администратора
                            const adminQuery = `SELECT COUNT(*) as count FROM users WHERE role = 'admin'`;
                            db.db.get(adminQuery, [], async (err, adminRow) => {
                                if (err) {
                                    return resolve();
                                }

                                if (adminRow && adminRow.count === 0) {
                                    const hashedPassword = bcrypt.hashSync('frontexceo', 10);
                                    const insertQuery = `INSERT INTO users (name, email, password, role, can_edit) VALUES (?, ?, ?, ?, ?)`;
                                    db.db.run(insertQuery, ['CEO Frontex', 'Frontex@jaber.com', hashedPassword, 'admin', 1], (err) => {
                                        if (!err) {
                                            console.log('Администратор создан: Frontex@jaber.com / frontexceo');
                                        }
                                        resolve();
                                    });
                                } else {
                                    resolve();
                                }
                            });
                        });
                    }
                };

                checkAndCreateAdmin();
            });
        });
    });
};

// Запуск сервера
const startServer = async () => {
    try {
        await initDatabase();
        await migrateDatabase();
        await createTestUser();

        app.listen(PORT, () => {
            console.log(`Сервер запущен на порту ${PORT}`);
            console.log(`API доступно по адресу: http://localhost:${PORT}/api`);
            console.log(`Тестовый пользователь: demo@example.com / password123`);
        });
    } catch (error) {
        console.error('Ошибка запуска сервера:', error);
        process.exit(1);
    }
};

// Завершение работы сервера при прерывании процесса
process.on('SIGINT', async () => {
    console.log('\nЗавершение работы сервера...');
    if (db) {
        await db.close();
    }
    process.exit(0);
});

startServer().catch(console.error);