// AutoCatálogo - JavaScript Principal
let allVehicles = [];
let filteredVehicles = [];
let currentCategory = 'todos';

// Carregar veículos ao iniciar
document.addEventListener('DOMContentLoaded', () => {
  carregarMarcas();
  carregarVeiculos();
  setupEventListeners();
});

// Setup de event listeners
function setupEventListeners() {
  // Tabs de categorias
  document.querySelectorAll('.category-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      filtrarPorCategoria();
    });
  });

  // Busca global
  const globalSearch = document.getElementById('globalSearch');
  if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
      debounce(() => filtrarVeiculos(), 300)();
    });
  }

  // Ordenação
  const ordenacao = document.getElementById('ordenacao');
  if (ordenacao) {
    ordenacao.addEventListener('change', () => ordenarVeiculos());
  }
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Carregar marcas para o filtro
async function carregarMarcas() {
  try {
    const response = await fetch('/api/vehicles/marcas');
    const marcas = await response.json();

    const select = document.getElementById('filtroMarca');
    marcas.forEach(marca => {
      const option = document.createElement('option');
      option.value = marca;
      option.textContent = marca;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Erro ao carregar marcas:', error);
  }
}

// Carregar todos os veículos
async function carregarVeiculos() {
  const loading = document.getElementById('loading');
  const grid = document.getElementById('vehiclesGrid');

  loading.style.display = 'block';
  grid.innerHTML = '';

  try {
    const response = await fetch('/api/vehicles');
    allVehicles = await response.json();
    filteredVehicles = [...allVehicles];

    exibirVeiculos();
    atualizarContadores();
  } catch (error) {
    console.error('Erro ao carregar veículos:', error);
    grid.innerHTML = '<p style="text-align: center; color: var(--gray-500);">Erro ao carregar veículos. Tente novamente.</p>';
  } finally {
    loading.style.display = 'none';
  }
}

// Determinar tipo de veículo
function getVehicleType(modelo) {
  const sedans = ['Corolla', 'Civic', 'Versa', 'HB20S', 'Virtus', 'Onix Plus', 'Camry', 'Accord', 'Jetta'];
  const suvs = ['HR-V', 'Kicks', 'Creta', 'T-Cross', 'Renegade', '2008', 'Pulse', 'Compass', 'Taos', 'Tiggo', 'Nivus', 'Tracker', 'SW4', 'Grand Cherokee', 'Cooper'];
  const pickups = ['Hilux', 'Ranger', 'S10', 'L200'];
  const hatches = ['HB20', 'Argo', 'Polo', 'Kwid', 'Mobi', 'Gol', 'Onix 1.0'];

  for (const sedan of sedans) {
    if (modelo.includes(sedan)) return 'sedan';
  }
  for (const suv of suvs) {
    if (modelo.includes(suv)) return 'suv';
  }
  for (const pickup of pickups) {
    if (modelo.includes(pickup)) return 'pickup';
  }
  for (const hatch of hatches) {
    if (modelo.includes(hatch)) return 'hatch';
  }

  return 'sedan';
}

// Filtrar por categoria
function filtrarPorCategoria() {
  if (currentCategory === 'todos') {
    filteredVehicles = [...allVehicles];
  } else {
    filteredVehicles = allVehicles.filter(v => getVehicleType(v.modelo) === currentCategory);
  }

  exibirVeiculos();
  atualizarContadores();
}

// Aplicar filtros
function aplicarFiltros() {
  filteredVehicles = [...allVehicles];

  // Filtro de marca
  const marca = document.getElementById('filtroMarca').value;
  if (marca) {
    filteredVehicles = filteredVehicles.filter(v => v.marca === marca);
  }

  // Filtro de ano
  const anoMin = document.getElementById('anoMin').value;
  const anoMax = document.getElementById('anoMax').value;
  if (anoMin) {
    filteredVehicles = filteredVehicles.filter(v => v.ano >= parseInt(anoMin));
  }
  if (anoMax) {
    filteredVehicles = filteredVehicles.filter(v => v.ano <= parseInt(anoMax));
  }

  // Filtro de preço
  const precoMin = document.getElementById('precoMin').value;
  const precoMax = document.getElementById('precoMax').value;
  if (precoMin) {
    filteredVehicles = filteredVehicles.filter(v => v.preco >= parseFloat(precoMin));
  }
  if (precoMax) {
    filteredVehicles = filteredVehicles.filter(v => v.preco <= parseFloat(precoMax));
  }

  // Filtro de km
  const kmMax = document.getElementById('filtroKm').value;
  if (kmMax) {
    filteredVehicles = filteredVehicles.filter(v => v.km <= parseInt(kmMax));
  }

  // Filtro de combustível
  const combustivel = document.getElementById('filtroCombustivel').value;
  if (combustivel) {
    filteredVehicles = filteredVehicles.filter(v => v.combustivel === combustivel);
  }

  // Filtro de câmbio
  const cambio = document.getElementById('filtroCambio').value;
  if (cambio) {
    filteredVehicles = filteredVehicles.filter(v => v.cambio === cambio);
  }

  // Busca global
  const search = document.getElementById('globalSearch').value.toLowerCase();
  if (search) {
    filteredVehicles = filteredVehicles.filter(v =>
      v.marca.toLowerCase().includes(search) ||
      v.modelo.toLowerCase().includes(search) ||
      v.ano.toString().includes(search)
    );
  }

  // Aplicar filtro de categoria
  if (currentCategory !== 'todos') {
    filteredVehicles = filteredVehicles.filter(v => getVehicleType(v.modelo) === currentCategory);
  }

  exibirVeiculos();
  atualizarContadores();
}

// Limpar filtros
function limparFiltros() {
  document.getElementById('filtroMarca').value = '';
  document.getElementById('anoMin').value = '';
  document.getElementById('anoMax').value = '';
  document.getElementById('precoMin').value = '';
  document.getElementById('precoMax').value = '';
  document.getElementById('filtroKm').value = '';
  document.getElementById('filtroCombustivel').value = '';
  document.getElementById('filtroCambio').value = '';
  document.getElementById('globalSearch').value = '';

  currentCategory = 'todos';
  document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.category-tab[data-category="todos"]').classList.add('active');

  filteredVehicles = [...allVehicles];
  exibirVeiculos();
  atualizarContadores();
}

// Filtrar veículos em tempo real
function filtrarVeiculos() {
  aplicarFiltros();
}

// Ordenar veículos
function ordenarVeiculos() {
  const ordenacao = document.getElementById('ordenacao').value;

  switch (ordenacao) {
    case 'preco_asc':
      filteredVehicles.sort((a, b) => a.preco - b.preco);
      break;
    case 'preco_desc':
      filteredVehicles.sort((a, b) => b.preco - a.preco);
      break;
    case 'ano_desc':
      filteredVehicles.sort((a, b) => b.ano - a.ano);
      break;
    case 'km_asc':
      filteredVehicles.sort((a, b) => a.km - b.km);
      break;
    case 'destaque':
    default:
      filteredVehicles.sort((a, b) => b.destaque - a.destaque);
      break;
  }

  exibirVeiculos();
}

// Exibir veículos
function exibirVeiculos() {
  const grid = document.getElementById('vehiclesGrid');
  const noResults = document.getElementById('noResults');

  grid.innerHTML = '';

  if (filteredVehicles.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';

  filteredVehicles.forEach(vehicle => {
    const card = criarCardVeiculo(vehicle);
    grid.appendChild(card);
  });
}

// Criar card de veículo
function criarCardVeiculo(vehicle) {
  const card = document.createElement('div');
  card.className = 'vehicle-card';
  card.onclick = () => window.location.href = `vehicle.html?id=${vehicle.id}`;

  const imagemPrincipal = vehicle.images && vehicle.images.length > 0
    ? vehicle.images[0].image_path
    : '/placeholder.png';

  const ano = vehicle.ano || 'N/D';
  const isNovo = ano >= new Date().getFullYear() - 1;

  card.innerHTML = `
        <div class="vehicle-image-container">
            <img src="${imagemPrincipal}" alt="${vehicle.marca} ${vehicle.modelo}" class="vehicle-image">
            <div class="vehicle-badges">
                ${isNovo ? '<span class="badge badge-new">Novo</span>' : ''}
                ${vehicle.destaque ? '<span class="badge badge-featured">Destaque</span>' : ''}
            </div>
            <button class="favorite-btn" onclick="event.stopPropagation(); toggleFavorite(${vehicle.id})">
                ♡
            </button>
        </div>
        
        <div class="vehicle-info">
            <h3 class="vehicle-title">${vehicle.marca} ${vehicle.modelo}</h3>
            <p class="vehicle-subtitle">${ano}/${ano}</p>
            
            <div class="vehicle-specs">
                <div class="spec-item">
                    <span class="spec-icon">📏</span>
                    <span class="spec-label">KM</span>
                    <span class="spec-value">${(vehicle.km || 0).toLocaleString('pt-BR')}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-icon">⚙️</span>
                    <span class="spec-label">Câmbio</span>
                    <span class="spec-value">${vehicle.cambio || 'N/D'}</span>
                </div>
                <div class="spec-item">
                    <span class="spec-icon">⛽</span>
                    <span class="spec-label">Combustível</span>
                    <span class="spec-value">${vehicle.combustivel || 'N/D'}</span>
                </div>
            </div>
            
            <div class="vehicle-footer">
                <div>
                    <div class="vehicle-price-label">Valor à vista</div>
                    <div class="vehicle-price">R$ ${(vehicle.preco || 0).toLocaleString('pt-BR')}</div>
                </div>
                <button class="btn-details">
                    Detalhes →
                </button>
            </div>
        </div>
    `;

  return card;
}

// Toggle favorito
function toggleFavorite(id) {
  // Implementar lógica de favoritos (localStorage ou backend)
  console.log('Toggle favorite:', id);
}

// Atualizar contadores
function atualizarContadores() {
  const totalCount = document.getElementById('totalCount');
  const showingCount = document.getElementById('showingCount');
  const vehicleCount = document.getElementById('vehicleCount');

  totalCount.textContent = allVehicles.length;
  showingCount.textContent = filteredVehicles.length;

  const plural = filteredVehicles.length !== 1 ? 's' : '';
  vehicleCount.textContent = `Veículos Disponíveis`;
}
