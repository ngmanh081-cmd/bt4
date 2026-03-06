const express = require('express');
const crypto = require('crypto'); // Thư viện có sẵn của Node để tạo ID

const app = express();
app.use(express.json());

// ==========================================
// 1. MOCK DATABASE (Lưu tạm vào mảng)
// ==========================================
let roles = [];
let users = [];

app.get('/', (req, res) => {
    res.send("🚀 Server đang chạy bản KHÔNG dùng MongoDB! Hãy dùng Postman để test nhé.");
});

// ==========================================
// 2. CÁC ROUTE XỬ LÝ (CRUD)
// ==========================================

// --- ROLE ---
app.post('/roles', (req, res) => {
    const newRole = {
        id: crypto.randomUUID(),
        name: req.body.name,
        description: req.body.description || "",
        isDeleted: false,
        createdAt: new Date()
    };
    
    if (roles.find(r => r.name === newRole.name)) {
        return res.status(400).json({ message: "Tên Role đã tồn tại!" });
    }

    roles.push(newRole);
    res.status(201).json(newRole);
});

app.get('/roles', (req, res) => {
    res.json(roles.filter(role => role.isDeleted === false));
});

// --- USER ---
app.post('/users', (req, res) => {
    const { username, password, email, roleId, fullName, avatarUrl } = req.body;

    if (users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ message: "Username hoặc Email đã tồn tại!" });
    }

    const newUser = {
        id: crypto.randomUUID(),
        username, password, email,
        fullName: fullName || "",
        avatarUrl: avatarUrl || "https://i.sstatic.net/l60Hf.png",
        status: false,
        roleId, // Lưu ID của role
        loginCount: 0,
        isDeleted: false,
        createdAt: new Date()
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
    const activeUsers = users
        .filter(user => user.isDeleted === false)
        .map(user => {
            const roleDetail = roles.find(r => r.id === user.roleId);
            return { ...user, role: roleDetail }; // Ghép thông tin Role vào User
        });
        
    res.json(activeUsers);
});

// Xoá mềm User
app.delete('/users/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ message: "Không tìm thấy User!" });

    users[userIndex].isDeleted = true;
    res.json({ message: "Đã xoá tạm thời User", user: users[userIndex] });
});
// Xoá mềm Role (Update isDeleted = true)
app.delete('/roles/:id', (req, res) => {
    // Tìm vị trí của role trong mảng dựa vào ID truyền lên URL
    const roleIndex = roles.findIndex(r => r.id === req.params.id);
    
    // Nếu không tìm thấy
    if (roleIndex === -1) {
        return res.status(404).json({ message: "Không tìm thấy Role!" });
    }

    // Nếu tìm thấy thì chuyển isDeleted thành true
    roles[roleIndex].isDeleted = true; 
    res.json({ message: "Đã xoá tạm thời Role", role: roles[roleIndex] });
});
// ==========================================
// 3. ENABLE / DISABLE
// ==========================================
app.post('/enable', (req, res) => {
    const { email, username } = req.body;
    const user = users.find(u => u.email === email && u.username === username && !u.isDeleted);
    
    if (!user) return res.status(404).json({ message: "Sai thông tin hoặc User không tồn tại!" });

    user.status = true;
    res.json({ message: "Đã kích hoạt tài khoản", user });
});

app.post('/disable', (req, res) => {
    const { email, username } = req.body;
    const user = users.find(u => u.email === email && u.username === username && !u.isDeleted);
    
    if (!user) return res.status(404).json({ message: "Sai thông tin hoặc User không tồn tại!" });

    user.status = false;
    res.json({ message: "Đã vô hiệu hoá tài khoản", user });
});

// Khởi động Server
app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000 (Chế độ Array)"));