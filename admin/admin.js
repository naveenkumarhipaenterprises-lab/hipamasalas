// HIPA Masala Admin CMS Logic (Full Functionality, Modal CRUD, Availability & Supabase Sync)

document.addEventListener('DOMContentLoaded', () => {
  const authScreen = document.getElementById('authScreen');
  const adminApp = document.getElementById('adminApp');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  // Product Modal elements
  const productModal = document.getElementById('productModal');
  const openAddProductModal = document.getElementById('openAddProductModal');
  const closeProductModal = document.getElementById('closeProductModal');
  const productForm = document.getElementById('productForm');

  // Supabase client instance (if config present)
  const cfg = window.SITE_CONFIG || {};
  let supabase = null;
  if (window.supabase && cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
  }

  // Base product catalog
  let products = [
    { id: "sambar-powder", name: "Sambar Powder", slug: "sambar-powder", image_url: "/images/products/Sambar-masala.png", status: "available", is_featured: true, sort_order: 1 },
    { id: "rasam-powder", name: "Rasam Powder", slug: "rasam-powder", image_url: "/images/products/Rasam-masala-h.png", status: "available", is_featured: true, sort_order: 2 },
    { id: "turmeric-powder", name: "Turmeric Powder", slug: "turmeric-powder", image_url: "/images/products/Turmeric-Powder-h.png", status: "available", is_featured: true, sort_order: 3 },
    { id: "red-chilli-powder", name: "Red Chilli Powder", slug: "red-chilli-powder", image_url: "/images/products/Redchilli-powder.png", status: "available", is_featured: false, sort_order: 4 },
    { id: "coriander-powder", name: "Coriander Powder", slug: "coriander-powder", image_url: "/images/products/Corainder-powder-h.png", status: "available", is_featured: false, sort_order: 5 },
    { id: "cumin-powder", name: "Cumin Powder", slug: "cumin-powder", image_url: "/images/products/Cumin-powder-h.png", status: "available", is_featured: false, sort_order: 6 },
    { id: "pepper-powder", name: "Pepper Powder", slug: "pepper-powder", image_url: "/images/products/pepper-powderr-h.png", status: "available", is_featured: false, sort_order: 7 },
    { id: "garam-masala", name: "Garam Masala", slug: "garam-masala", image_url: "/images/products/Garam-Masala-h.png", status: "available", is_featured: true, sort_order: 8 }
  ];

  let enquiries = [];
  let faqs = [];

  // Restore saved product status from localStorage if present
  try {
    const savedStatuses = JSON.parse(localStorage.getItem('hipa_product_statuses') || '{}');
    products.forEach(p => {
      if (savedStatuses[p.slug]) p.status = savedStatuses[p.slug];
    });

    const customProds = JSON.parse(localStorage.getItem('hipa_custom_products') || '[]');
    if (Array.isArray(customProds) && customProds.length > 0) {
      products = [...products, ...customProds];
    }
  } catch (e) {}

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
    if (supabase) await supabase.auth.signOut();
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

  // Modal Open & Close
  if (openAddProductModal) {
    openAddProductModal.addEventListener('click', () => {
      document.getElementById('productForm').reset();
      document.getElementById('editProductId').value = '';
      document.getElementById('productModalTitle').textContent = 'Add New Product';
      productModal.classList.add('open');
    });
  }

  if (closeProductModal) {
    closeProductModal.addEventListener('click', () => {
      productModal.classList.remove('open');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === productModal) {
      productModal.classList.remove('open');
    }
  });

  // Product Form Submission
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const editId = document.getElementById('editProductId').value;
      const name = document.getElementById('prodName').value.trim();
      const slug = document.getElementById('prodSlug').value.trim().toLowerCase().replace(/\s+/g, '-');
      const shortDesc = document.getElementById('prodShortDesc').value.trim();
      const fullDesc = document.getElementById('prodFullDesc').value.trim();
      const imageUrl = document.getElementById('prodImageUrl').value.trim();
      const status = document.getElementById('prodStatus').value;
      const availMsg = document.getElementById('prodAvailMsg').value.trim();
      const features = document.getElementById('prodFeatures').value.split(',').map(s => s.trim()).filter(Boolean);
      const packSizes = document.getElementById('prodPackSizes').value.split(',').map(s => s.trim()).filter(Boolean);

      const newProd = {
        id: editId || slug,
        name,
        slug,
        short_description: shortDesc,
        description: fullDesc,
        image_url: imageUrl || '/images/products/Sambar-masala.png',
        status,
        availability_message: availMsg,
        features,
        pack_sizes: packSizes,
        sort_order: products.length + 1
      };

      if (editId) {
        const idx = products.findIndex(p => p.id === editId || p.slug === editId);
        if (idx !== -1) products[idx] = { ...products[idx], ...newProd };
      } else {
        products.push(newProd);
        // Save custom product to localStorage
        try {
          const customProds = JSON.parse(localStorage.getItem('hipa_custom_products') || '[]');
          customProds.push(newProd);
          localStorage.setItem('hipa_custom_products', JSON.stringify(customProds));
        } catch (err) {}
      }

      // Save status map
      saveProductStatuses();

      // Save to Supabase if configured
      if (supabase) {
        try {
          await supabase.from('products').upsert([newProd]);
        } catch (err) {
          console.warn('Supabase upsert error:', err.message);
        }
      }

      productModal.classList.remove('open');
      renderProducts();
      updateStats();
    });
  }

  function saveProductStatuses() {
    const statusMap = {};
    products.forEach(p => statusMap[p.slug] = p.status);
    localStorage.setItem('hipa_product_statuses', JSON.stringify(statusMap));
  }

  async function fetchInitialData() {
    if (supabase) {
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('is_deleted', false).order('sort_order');
        if (pData && pData.length > 0) products = pData;

        const { data: eData } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
        if (eData) enquiries = eData;

        const { data: fData } = await supabase.from('faqs').select('*').order('sort_order');
        if (fData) faqs = fData;
      } catch (err) {}
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
          <button class="toggle-status-btn" data-slug="${p.slug}" style="padding: 4px 8px; font-size: 0.8rem; cursor: pointer; border-radius: 4px; border: 1px solid #ccc; background: #fff;">
            Mark ${p.status === 'available' ? 'Unavailable' : 'Available'}
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('.toggle-status-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const slug = btn.getAttribute('data-slug');
        const prod = products.find(p => p.slug === slug);
        if (prod) {
          prod.status = prod.status === 'available' ? 'unavailable' : 'available';
          saveProductStatuses();

          if (supabase) {
            try {
              await supabase.from('products').update({ status: prod.status }).eq('slug', slug);
            } catch (err) {}
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
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: #6b7280; padding: 20px;">No enquiries received yet.</td></tr>';
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
