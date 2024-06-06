document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const registerPage = document.getElementById("register-page");
    const loginPage = document.getElementById("login-page");
    const dashboard = document.getElementById("dashboard");
    const addProductBtn = document.getElementById("add-product-btn");
    const addSaleBtn = document.getElementById("add-sale-btn");
    const inventoryList = document.getElementById("inventory-list");
    const salesList = document.getElementById("sales-list");
    const lowInventoryAlerts = document.getElementById("low-inventory-alerts");
    const totalSalesAmount = document.getElementById("total-sales-amount");
    const logoutBtn = document.getElementById("logout-btn");

    const goToRegisterLink = document.getElementById("go-to-register");
    const goToLoginLink = document.getElementById("go-to-login");
    let registeredUsers = JSON.parse(localStorage.getItem("registeredUsers")) || [];
    let inventoryData = [];
    let salesData = [];
    let totalSales = 0;

    function resetData() {
        inventoryData = [];
        salesData = [];
        totalSales = 0;
        displayInventory();
        displaySales();
        updateTotalSales();
        checkLowInventory();
    }
    
    goToRegisterLink.addEventListener("click", function(e) {
        e.preventDefault();
        loginPage.style.display = "none";
        registerPage.style.display = "block";
    });

    goToLoginLink.addEventListener("click", function(e) {
        e.preventDefault();
        registerPage.style.display = "none";
        loginPage.style.display = "block";
    });

    registerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("reg-username").value;
        const password = document.getElementById("reg-password").value;

        const userExists = registeredUsers.find(user => user.username === username);
        if (userExists) {
            alert("Username already exists.");
            return;
        }

        registeredUsers.push({ username, password });
        localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
        alert("Registration successful!! Please log in.");
        registerPage.style.display = "none";
        loginPage.style.display = "block";
    });

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const user = registeredUsers.find(user => user.username === username && user.password === password);
        if (user) {
            resetData();
            loginPage.style.display = "none";
            dashboard.style.display = "block";
        } else {
            alert("Invalid Username/Password\nTry Again");
        }
    });

    logoutBtn.addEventListener("click", function() {
        dashboard.style.display = "none";
        loginPage.style.display = "block";
        document.getElementById("username").value = '';
        document.getElementById("password").value = '';
    });

    function displayInventory() {
        inventoryList.innerHTML = "";
        inventoryData.forEach(function(product) {
            const productItem = document.createElement("div");
            productItem.innerHTML = `
                <p><strong>ID:</strong> ${product.id}</p>
                <p><strong>Name:</strong> ${product.name}</p>
                <p><strong>Quantity:</strong> ${product.quantity}</p>
                <p><strong>Price:</strong> $${product.price}</p>
            `;
            inventoryList.appendChild(productItem);
        });
    }

    function displaySales() {
        salesList.innerHTML = "";
        salesData.forEach(function(sale) {
            const saleItem = document.createElement("div");
            saleItem.innerHTML = `
                <p><strong>ID:</strong> ${sale.id}</p>
                <p><strong>Name:</strong> ${sale.name}</p>
                <p><strong>Quantity:</strong> ${sale.quantity}</p>
                <p><strong>Price:</strong> $${sale.price}</p>
                <p><strong>Total:</strong> $${sale.quantity * sale.price}</p>
            `;
            salesList.appendChild(saleItem);
        });
    }

    function checkLowInventory() {
        lowInventoryAlerts.innerHTML = "";
        inventoryData.forEach(function(product) {
            if (product.quantity < 5) {
                const alertItem = document.createElement("div");
                alertItem.innerHTML = `<p>Low inventory alert for product ID ${product.id} (${product.name})</p>`;
                lowInventoryAlerts.appendChild(alertItem);
            }
        });
    }

    function updateTotalSales() {
        totalSales = salesData.reduce((total, sale) => total + (sale.quantity * sale.price), 0);
        totalSalesAmount.textContent = `$${totalSales.toFixed(2)}`;
    }

    addProductBtn.addEventListener("click", function() {
        const id = prompt("Enter product ID:");
        const name = prompt("Enter product name:");
        const quantity = parseInt(prompt("Enter product quantity:"), 10);
        const price = parseFloat(prompt("Enter product price:"), 10);

        if (!id || !name || isNaN(quantity) || isNaN(price)) {
            alert("Please provide valid product details.");
            return;
        }

        const existingProduct = inventoryData.find(product => product.id === id);
        if (existingProduct) {
            alert("Product ID already exists.");
            return;
        }

        const newProduct = { id, name, quantity, price };
        inventoryData.push(newProduct);
        displayInventory();
        checkLowInventory();
    });

    addSaleBtn.addEventListener("click", function() {
        const id = prompt("Enter product ID:");
        const name = prompt("Enter product name:");
        const quantity = parseInt(prompt("Enter sale quantity:"), 10);
        const price = parseFloat(prompt("Enter sale price:"), 10);

        if (!id || !name || isNaN(quantity) || isNaN(price)) {
            alert("Please provide valid sale details.");
            return;
        }

        const product = inventoryData.find(product => product.id === id);
        if (!product) {
            alert("Product ID not found.");
            return;
        }

        if (product.quantity < quantity) {
            alert("Insufficient quantity in inventory.");
            return;
        }
        
        product.quantity -= quantity;
        const newSale = { id, name, quantity, price };
        salesData.push(newSale);
        displayInventory();
        displaySales();
        updateTotalSales();
        checkLowInventory();
    });

    // Initial display
    displayInventory();
    checkLowInventory();
});
