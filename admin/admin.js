// HIPA Masala Admin CMS Logic

document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('authScreen');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  // In-memory data state (persists via API or Supabase fallback)
  let products = [
    { id: "1", name: "Sambar Powder", slug: "sambar-powder", image_url: "/images/products/Sambar-masala.png", status: "available", is_featured: true },
    { id: "2", name: "Rasam Powder", slug: "rasam-powder", image_url: "/images/products/Rasam-masala-h.png", status: "available", is_featured: true },
    { id: "3", name: "Turmeric Powder", slug: "turmeric-powder", image_url: "/images/products/Turmeric-Powder-h.png", status: "available", is_featured: true },
    { id: "4", name: "Red Chilli Powder", slug: "red-chilli-powder", image_url: "/images/products/Redchilli-powder.png", status: "available", is_featured: false },
    { id: "5", name: "Coriander Powder", slug: "coriander-powder", image_url: "/images/products/Corainder-powder-h.png", status: "available", is_featured: false },
    { id: "6", name: "Cumin Powder", slug: "cumin-powder", image_url: "/images/products/Cumin-powder-h.png", status: "available", is_featured: false },
    { id: "7", name: "Pepper Powder", slug: "pepper-powder", image_url: "/images/products/pepper-powderr-h.png", status: "available", is_featured: false },
    { id: "8", name: "Garam Masala", slug: "garam-masala", image_url: "/images/products/Garam-Masala-h.png", status: "available", is_featured: true }
  ];

  let enquiries = [];
  let faqs = [];

  // Check login session
  const isLoggedIn = sessionStorage.getItem('hipa_admin_auth') === 'true';
  if (isLoggedIn) {
    showApp();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;

    // Default admin credentials (or server auth)
    if (email && pass) {
      sessionStorage.setItem('hipa_admin_auth', 'true');
      loginError.style.display = 'none';
      showApp();
    } else {
      loginError.textContent = 'Invalid credentials';
      loginError.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('hipa_admin_auth');
    adminApp.style.display = 'none';
    authScreen.style.display = 'flex';
  });

  function showApp() {
    authScreen.style.display = 'none';
    adminApp.style.display = 'flex';
    fetchInitialData();
  }

  // Navigation tabs
  document.querySelectorAll('.admin-nav-btn[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).style.display = 'block';
    });
  });

  function fetchInitialData() {
    // Fetch products
    fetch('/api/products')
      .then(r => r.json())
      .then(res => {
        if (res.success && res.data) {
          products = res.data;
          renderProducts();
          updateStats();
        }
      })
      .catch(() => {
        renderProducts();
        updateStats();
      });
  }

  function updateStats() {
    document.getElementById('statTotalProducts').textContent = products.length;
    document.getElementById('statAvailableProducts').textContent = products.filter(p => p.status === 'available').length;
    document.getElementById('statUnavailableProducts').textContent = products.filter(p => p.status === 'unavailable').length;
    document.getElementById('statNewEnquiries').textContent = enquiries.filter(e => e.status === 'new').length;
  }

  function renderProducts() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image_url}" class="prod-img-thumb" alt="${p.name}"></td>
        <td><strong>${p.name}</strong></td>
        <td><code>/products/${p.slug}</code></td>
        <td>
          <span class="status-badge ${p.status === 'available' ? 'badge-available' : 'badge-unavailable'}">
            ${p.status === 'available' ? 'Available' : 'Unavailable'}
          </span>
        </td>
        <td>${p.is_featured ? '? Yes' : 'No'}</td>
        <td>
          <button class="toggle-status-btn" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer;">
            Toggle ${p.status === 'available' ? 'Unavailable' : 'Available'}
          </button>
        </td>
      </tr>
    `).join('');

    // Attach status toggle handler
    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod) {
          prod.status = prod.status === 'available' ? 'unavailable' : 'available';
          renderProducts();
          updateStats();
        }
      });
    });
  }
});
