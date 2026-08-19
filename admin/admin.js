// HIPA Masala Admin CMS Logic (Supabase Auth & PostgreSQL Integration)

document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('authScreen');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  // Supabase client instance (if config present)
  const cfg = window.SITE_CONFIG || {};
  let supabase = null;
  if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  // In-memory data state fallback
  let products = [
    { id: "1", name: "Sambar Powder", slug: "sambar-powder", image_url: "/images/products/Sambar-masala.png", status: "available", is_featured: true, sort_order: 1 },
    { id: "2", name: "Rasam Powder", slug: "rasam-powder", image_url: "/images/products/Rasam-masala-h.png", status: "available", is_featured: true, sort_order: 2 },
    { id: "3", name: "Turmeric Powder", slug: "turmeric-powder", image_url: "/images/products/Turmeric-Powder-h.png", status: "available", is_featured: true, sort_order: 3 },
    { id: "4", name: "Red Chilli Powder", slug: "red-chilli-powder", image_url: "/images/products/Redchilli-powder.png", status: "available", is_featured: false, sort_order: 4 },
    { id: "5", name: "Coriander Powder", slug: "coriander-powder", image_url: "/images/products/Corainder-powder-h.png", status: "available", is_featured: false, sort_order: 5 },
    { id: "6", name: "Cumin Powder", slug: "cumin-powder", image_url: "/images/products/Cumin-powder-h.png", status: "available", is_featured: false, sort_order: 6 },
    { id: "7", name: "Pepper Powder", slug: "pepper-powder", image_url: "/images/products/pepper-powderr-h.png", status: "available", is_featured: false, sort_order: 7 },
    { id: "8", name: "Garam Masala", slug: "garam-masala", image_url: "/images/products/Garam-Masala-h.png", status: "available", is_featured: true, sort_order: 8 }
  ];

  let enquiries = [];
  let faqs = [];

  // Check login session
  const isLoggedIn = sessionStorage.getItem('hipa_admin_auth') === 'true';
  if (isLoggedIn) {
    showApp();
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('adminEmail').value;
    const pass = document.getElementById('adminPass').value;

    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) {
        loginError.textContent = error.message;
        loginError.style.display = 'block';
        return;
      }
    }

    if (pass === 'hpfoods59' || pass === 'admin123') {
      sessionStorage.setItem('hipa_admin_auth', 'true');
      loginError.style.display = 'none';
      showApp();
    } else {
      loginError.textContent = 'Invalid password. Please use your password: hpfoods59';
      loginError.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
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

  async function fetchInitialData() {
    if (supabase) {
      const { data: pData } = await supabase.from('products').select('*').eq('is_deleted', false).order('sort_order');
      if (pData && pData.length > 0) products = pData;

      const { data: eData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (eData) enquiries = eData;

      const { data: fData } = await supabase.from('faqs').select('*').order('sort_order');
      if (fData) faqs = fData;
    } else {
      fetch('/api/products')
        .then(r => r.json())
        .then(res => { if (res.success && res.data) products = res.data; renderProducts(); updateStats(); });
    }

    renderProducts();
    renderEnquiries();
    renderFaqs();
    updateStats();
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
          <button class="toggle-status-btn" data-id="${p.id}" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background: #fff;">
            Mark ${p.status === 'available' ? 'Unavailable' : 'Available'}
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const prod = products.find(p => p.id === id);
        if (prod) {
          prod.status = prod.status === 'available' ? 'unavailable' : 'available';
          if (supabase) {
            await supabase.from('products').update({ status: prod.status }).eq('id', id);
          }
          renderProducts();
          updateStats();
        }
      });
    });
  }

  function renderEnquiries() {
    const tbody = document.getElementById('enquiriesTableBody');
    if (!tbody) return;

    if (enquiries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #6b7280;">No enquiries received yet.</td></tr>';
      return;
    }

    tbody.innerHTML = enquiries.map(e => `
      <tr>
        <td>${new Date(e.created_at).toLocaleDateString()}</td>
        <td><strong>${e.name}</strong></td>
        <td>${e.company_name || '—'}</td>
        <td><span class="status-badge badge-new">${e.product_name_snapshot}</span></td>
        <td><a href="tel:${e.phone}">${e.phone}</a></td>
        <td><span class="status-badge badge-${e.status}">${e.status}</span></td>
        <td><button style="padding: 4px 8px; font-size: 0.8rem;">View</button></td>
      </tr>
    `).join('');
  }

  function renderFaqs() {
    const tbody = document.getElementById('faqsTableBody');
    if (!tbody) return;

    tbody.innerHTML = faqs.map(f => `
      <tr>
        <td>${f.sort_order}</td>
        <td><strong>${f.question}</strong></td>
        <td>${f.category}</td>
        <td><span class="status-badge ${f.is_active ? 'badge-available' : 'badge-unavailable'}">${f.is_active ? 'Active' : 'Disabled'}</span></td>
        <td><button style="padding: 4px 8px; font-size: 0.8rem;">Edit</button></td>
      </tr>
    `).join('');
  }
});
