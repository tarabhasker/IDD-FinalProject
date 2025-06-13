// server.js – shortened to the relevant parts ─────────────────────────
const express = require('express');
const fs       = require('fs');
const path     = require('path');
const cors     = require('cors');
const nodemailer = require('nodemailer');


require('dotenv').config();                // if you want to load env vars

const app  = express();
const PORT = 5050;
app.use(cors());
app.use(express.json());

const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'Eternally'
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection error:', err);
  } else {
    console.log('✅ MySQL connected');
  }
});

const bcrypt = require('bcrypt');

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, error: 'Missing fields' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)`;
    db.query(sql, [name, email, hash], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.json({ success: false, error: 'Email already registered.' });
        }
        console.error(err);
        return res.status(500).json({ success: false, error: 'Database error.' });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Registration failed.' });
  }
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, error: 'Missing credentials' });

  const sql = `SELECT id, full_name, email, password FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    if (results.length === 0)
      return res.json({ success: false, error: 'User not found' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.json({ success: false, error: 'Invalid password' });

    delete user.password; // remove hashed password from response
    res.json({ success: true, user });
  });
});

app.post('/api/add-card', (req, res) => {
  const { user_id, number, exp_m, exp_y } = req.body || {};

  const user = parseInt(user_id);
  const num  = (number || '').replace(/\D/g, '');
  const last4 = num.slice(-4);
  const brand = num[0] === '4' ? 'Visa' : (num[0] === '5' ? 'MasterCard' : 'Card');
  const expM = parseInt(exp_m);
  const expY = parseInt(exp_y);

  if (!user || num.length < 13) {
    return res.json({ success: false, error: 'invalid data' });
  }

  const sql = `INSERT INTO cards (user_id, brand, last4, exp_month, exp_year) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [user, brand, last4, expM, expY], (err, result) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.status(500).json({ success: false, error: 'DB error' });
    }

    res.json({
      success: true,
      card: {
        id: result.insertId,
        brand,
        last4,
        exp_month: expM,
        exp_year: expY
      }
    });
  });
});


app.post('/api/add-to-cart', (req, res) => {
  const { user_id, item_name } = req.body || {};
  const userId = parseInt(user_id);
  const itemName = (item_name || '').trim();

  if (!userId || !itemName) {
    return res.json({ error: 'Missing data' });
  }

  const checkSql = `SELECT id, quantity FROM cart WHERE user_id = ? AND item_name = ?`;
  db.query(checkSql, [userId, itemName], (err, rows) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.status(500).json({ error: 'DB error' });
    }

    if (rows.length > 0) {
      // Already in cart, do nothing
      return res.json({ success: true, message: 'Already in cart' });
    }

    const insertSql = `INSERT INTO cart (user_id, item_name, quantity) VALUES (?, ?, 1)`;
    db.query(insertSql, [userId, itemName], (err2) => {
      if (err2) {
        console.error('❌ DB error:', err2);
        return res.status(500).json({ error: 'DB error' });
      }

      res.json({ success: true });
    });
  });
});


app.post('/api/change-password', async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body || {};
    console.log('📥 Request body:', req.body);

    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const sql = `SELECT password FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('❌ SELECT error:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (!results.length) {
        console.log('🔍 No user found with email:', email);
        return res.status(404).json({ error: 'User not found' });
      }

      const user = results[0];
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) {
        console.log('❌ Old password does not match for', email);
        return res.status(401).json({ error: 'Old password incorrect' });
      }

      const hash = await bcrypt.hash(newPassword, 10);
      console.log('🔐 New hash:', hash);

      const updateSql = `UPDATE users SET password = ? WHERE email = ?`;
      db.query(updateSql, [hash, email], (err2, result) => {
        if (err2) {
          console.error('❌ UPDATE error:', err2);
          return res.status(500).json({ error: 'Failed to update password' });
        }

        console.log(`✅ Password updated for ${email}`);
        res.json({ success: true });
      });
    });
  } catch (e) {
    console.error('❌ Crash in change-password:', e);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/api/checkout', (req, res) => {
  const { user_id, card_id, location, total, discount = 0, postage = 0, items = [], timestamp } = req.body || {};

  const userId = parseInt(user_id);
  const cardId = parseInt(card_id);
  const locationClean = (location || '').trim();
  const totalFloat = parseFloat(total);
  const timestampFinal = timestamp
    ? new Date(timestamp).toISOString().slice(0, 19).replace('T', ' ')
    : new Date().toISOString().slice(0, 19).replace('T', ' ');

  if (!userId || !locationClean || !totalFloat || !items.length) {
    return res.json({ success: false, error: 'Missing required fields.' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });

    const purchaseSql = `
      INSERT INTO purchases 
      (user_id, card_id, purchase_date, purchase_location, purchase_total, discount, postage, purchase_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`;

    db.query(purchaseSql, [userId, cardId, timestampFinal, locationClean, totalFloat, discount, postage], (err, result) => {
      if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Insert failed' }));

      const purchaseId = result.insertId;
      const itemSql = `INSERT INTO purchase_items (purchase_id, item_name, quantity, item_price) VALUES (?, ?, ?, ?)`;

      let insertCount = 0;
      for (let item of items) {
        const name = (item.label || '').trim();
        const qty = parseInt(item.qty || 1);
        const price = parseFloat(item.price || 0);

        if (name && qty > 0) {
          db.query(itemSql, [purchaseId, name, qty, price], err => {
            if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Item insert failed' }));
            insertCount++;
            if (insertCount === items.length) {
              db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Commit failed' }));
                res.json({ success: true, purchase_id: purchaseId });
              });
            }
          });
        } else {
          insertCount++;
        }
      }
    });
  });
});


app.post('/api/delete-card', (req, res) => {
  const card = parseInt(req.body.id || 0);
  if (!card) return res.json({ success: false, error: 'bad id' });

  const sql = `DELETE FROM cards WHERE id = ?`;
  db.query(sql, [card], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    res.json({ success: true });
  });
});


app.post('/api/delete-cart-item', (req, res) => {
  const userId = parseInt(req.body.user_id || 0);
  const itemName = (req.body.item_name || '').trim();

  if (!userId || !itemName) return res.json({ error: 'bad data' });

  const sql = `DELETE FROM cart WHERE user_id = ? AND item_name = ?`;
  db.query(sql, [userId, itemName], (err) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ success: true });
  });
});

app.post('/api/delete-cart', (req, res) => {
  const userId = parseInt(req.body.user_id || 0);
  if (!userId) return res.json({ success: false, error: 'Missing user ID' });

  const sql = `DELETE FROM cart WHERE user_id = ?`;
  db.query(sql, [userId], (err) => {
    if (err) return res.status(500).json({ success: false, error: 'DB error' });
    res.json({ success: true });
  });
});

app.post('/api/delete-purchase', (req, res) => {
  const userId = parseInt(req.body.user_id || 0);
  const purchaseId = parseInt(req.body.purchase_id || 0);
  if (!userId || !purchaseId) {
    return res.json({ success: false, error: 'Missing user_id or purchase_id' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ success: false, error: 'Transaction error' });

    const check = `SELECT id FROM purchases WHERE id = ? AND user_id = ?`;
    db.query(check, [purchaseId, userId], (err, rows) => {
      if (err || !rows.length) {
        return db.rollback(() => res.json({ success: false, error: 'Unauthorized or not found' }));
      }

      const delItems = `DELETE FROM purchase_items WHERE purchase_id = ?`;
      db.query(delItems, [purchaseId], err => {
        if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Failed to delete items' }));

        const delPurchase = `DELETE FROM purchases WHERE id = ? AND user_id = ?`;
        db.query(delPurchase, [purchaseId, userId], err => {
          if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Failed to delete purchase' }));

          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Commit failed' }));
            res.json({ success: true });
          });
        });
      });
    });
  });
});


app.get('/api/get-cards', (req, res) => {
  const userId = parseInt(req.query.user_id || 0);
  if (!userId) return res.json({ success: false, cards: [] });

  const sql = `SELECT id, brand, last4, exp_month, exp_year FROM cards WHERE user_id = ? ORDER BY id`;
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('❌ get-cards error:', err);
      return res.status(500).json({ success: false, cards: [] });
    }
    res.json({ success: true, cards: rows });
  });
});


app.get('/api/get-cart', (req, res) => {
  const userId = parseInt(req.query.user_id || 0);
  if (!userId) return res.json({ error: 'missing user_id' });

  const sql = `SELECT item_name, quantity FROM cart WHERE user_id = ?`;
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error('❌ get-cart error:', err);
      return res.status(500).json({ error: 'db-failure' });
    }
    res.json({ success: true, items: rows });
  });
});

app.post('/api/get-purchases', (req, res) => {
  const userId = parseInt(req.body.user_id || 0);
  if (!userId) return res.json({ success: false, error: 'Missing user ID.' });

  const purchaseSql = `SELECT * FROM purchases WHERE user_id = ? ORDER BY purchase_date DESC`;
  db.query(purchaseSql, [userId], (err, purchases) => {
    if (err) {
      console.error('❌ get-purchases error:', err);
      return res.status(500).json({ success: false, error: 'DB error' });
    }

    if (!purchases.length) return res.json([]);

    const itemSql = `SELECT item_name, quantity FROM purchase_items WHERE purchase_id = ?`;
    let result = [];
    let completed = 0;

    purchases.forEach((purchase, index) => {
      db.query(itemSql, [purchase.id], (err2, items) => {
        if (err2) {
          console.error('❌ item-fetch error:', err2);
          return res.status(500).json({ success: false, error: 'DB error on items' });
        }

        result[index] = {
          purchase_id: purchase.id,
          timestamp: purchase.purchase_date,
          discount: parseFloat(purchase.discount),
          postage: parseFloat(purchase.postage),
          total: parseFloat(purchase.purchase_total),
          status: purchase.purchase_status,
          location: purchase.purchase_location,
          items
        };

        completed++;
        if (completed === purchases.length) {
          res.json(result);
        }
      });
    });
  });
});


app.get('/api/get-user', (req, res) => {
  const email = (req.query.email || '').trim();
  if (!email) return res.json({ success: false, error: 'missing email' });

  const sql = `
    SELECT id, full_name, last_name, email, phone, address
    FROM users WHERE email = ? LIMIT 1
  `;
  db.query(sql, [email], (err, rows) => {
    if (err) {
      console.error('❌ get-user error:', err);
      return res.status(500).json({ success: false, error: 'DB error' });
    }

    const user = rows[0] || null;
    res.json({ success: !!user, user });
  });
});


app.post('/api/update-cart', (req, res) => {
  const userId = parseInt(req.body.user_id || 0);
  const itemName = (req.body.item_name || '').trim();
  const quantity = parseInt(req.body.quantity || 1);

  if (!userId || !itemName) return res.json({ error: 'bad data' });

  const updateSql = `UPDATE cart SET quantity = ? WHERE user_id = ? AND item_name = ?`;
  const deleteSql = `DELETE FROM cart WHERE user_id = ? AND item_name = ?`;

  const sql = quantity > 0 ? updateSql : deleteSql;
  const values = quantity > 0 ? [quantity, userId, itemName] : [userId, itemName];

  db.query(sql, values, (err) => {
    if (err) {
      console.error('❌ update-cart error:', err);
      return res.status(500).json({ error: 'db' });
    }
    res.json({ success: true });
  });
});


app.post('/api/update-profile', (req, res) => {
  const oldEmail = (req.body.oldEmail || '').trim();
  const newData = req.body.newData || {};

  if (!oldEmail) return res.json({ error: 'Missing oldEmail' });

  if (newData.email && newData.email !== oldEmail) {
    const checkDup = `SELECT id FROM users WHERE email = ?`;
    db.query(checkDup, [newData.email], (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (rows.length) return res.json({ error: 'Email already in use' });
      updateUser();
    });
  } else {
    updateUser();
  }

  function updateUser() {
    const updateSql = `
      UPDATE users SET full_name = ?, last_name = ?, email = ?, phone = ?, address = ?
      WHERE email = ?
    `;
    const values = [
      newData.first_name || '',
      newData.last_name || '',
      newData.email || '',
      newData.phone || '',
      newData.address || '',
      oldEmail
    ];

    db.query(updateSql, values, (err) => {
      if (err) {
        console.error('❌ update-profile error:', err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ success: true });
    });
  }
});


app.post('/api/update-purchase', (req, res) => {
  const {
    timestamp,
    items = [],
    subtotal,
    postage,
    discount,
    total,
    location,
    status = 'Pending',
    user_id,
    purchase_id
  } = req.body || {};

  const userId = parseInt(user_id || 0);
  const purchaseId = parseInt(purchase_id || 0);

  if (!timestamp || !items.length) {
    return res.json({ success: false, error: 'Missing fields' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).json({ success: false, error: 'Transaction error' });

    const updateSql = `
      UPDATE purchases SET purchase_total = ?, discount = ?, postage = ?, purchase_location = ?, purchase_status = ?
      WHERE id = ? AND user_id = ?
    `;
    db.query(updateSql, [total, discount, postage, location, status, purchaseId, userId], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Update failed' }));

      db.query(`DELETE FROM purchase_items WHERE purchase_id = ?`, [purchaseId], (err2) => {
        if (err2) return db.rollback(() => res.status(500).json({ success: false, error: 'Delete items failed' }));

        const itemSql = `INSERT INTO purchase_items (purchase_id, item_name, quantity, item_price) VALUES (?, ?, ?, ?)`;
        let inserted = 0;

        for (let item of items) {
          const name = (item.label || '').trim();
          const qty = parseInt(item.qty || 1);
          const price = parseFloat(item.price || 0);
          if (!name || qty <= 0) {
            inserted++;
            continue;
          }

          db.query(itemSql, [purchaseId, name, qty, price], (err3) => {
            if (err3) return db.rollback(() => res.status(500).json({ success: false, error: 'Insert item failed' }));

            inserted++;
            if (inserted === items.length) {
              db.commit(err => {
                if (err) return db.rollback(() => res.status(500).json({ success: false, error: 'Commit failed' }));
                res.json({ success: true });
              });
            }
          });
        }
      });
    });
  });
});






// Add this route to trigger the DB reset
app.post('/api/reset-database', (req, res) => {
  const sqlPath = path.join(__dirname, 'setup', 'setup.sql');
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',      // default for XAMPP is empty string
    multipleStatements: true
  });

  connection.connect(err => {
    if (err) {
      console.error('❌ MySQL connection error:', err);
      return res.status(500).json({ success: false, error: 'MySQL connection failed' });
    }

    connection.query(sqlContent, (err, result) => {
      connection.end();
      if (err) {
        console.error('❌ Error executing SQL:', err);
        return res.status(500).json({ success: false, error: 'SQL execution failed' });
      }

      console.log('✅ Database reset completed');
      res.json({ success: true, message: 'Database reset and recreated' });
    });
  });
});


/* ───── nodemailer transport (Gmail App-Password) ───── */

/* ▼ NEW – Outlook / Office 365 SMTP */
const transporter = require('nodemailer').createTransport({
  host: 'smtp.gmail.com',
  port: 465,            // 465 = SSL; you can also use 587 + secure:false
  secure: true,         // true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify(err => console.log(err ? err : '✅  Gmail auth OK'));




/* ───── middleware ───── */
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../client')));

/* ══════════════════════════════════════════════════════
   POST  /api/contact      → send e-mail
   body: { name, email, subject, message }
   ══════════════════════════════════════════════════════ */
app.post('/api/contact', async (req, res) => {
  const { name='', email='', subject='', message='' } = req.body || {};

  if (!name.trim() || !email.trim() || !message.trim()) {
    return res.status(400).json({ success:false, error:'Missing fields' });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to  : 'tarabhasker26@gmail.com',
      subject: subject ? `Website enquiry – ${subject}` : 'Website enquiry',
      html:
        `<b>Name:</b> ${name}<br>` +
        `<b>Email:</b> ${email}<br>` +
        (subject ? `<b>Service:</b> ${subject}<br><br>` : '<br>') +
        message.replace(/\n/g,'<br>'),
      text:
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        (subject ? `Service: ${subject}\n\n` : '\n') +
        message
    });

    res.json({ success:true });
  } catch (err) {
    console.error('✖  Mail error:', err);
    res.status(500).json({ success:false, error:'Mail send failed' });
  }
});

/* ───── SPA fallback – keep as last route ───── */
app.get(/^(?!\/api).*/, (req, res) =>
  res.sendFile(path.resolve(__dirname, '../client/index.html'))
);

/* ───── start server ───── */
app.listen(PORT, () =>
  console.log(`✅ Express server running at http://localhost:${PORT}`)
);
