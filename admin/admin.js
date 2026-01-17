// Verificar autenticação
fetch('/api/auth/check')
    .then(res => res.json())
    .then(data => {
        if (!data.authenticated) {
            window.location.href = '/admin/login.html';
        }
    });

// Variáveis globais
let editMode = false;
let vehicleId = null;
let selectedFiles = [];
let imagesToRemove = [];
let existingImages = [];

// Verificar se é modo de edição
const urlParams = new URLSearchParams(window.location.search);
vehicleId = urlParams.get('id');

if (vehicleId) {
    editMode = true;
    document.getElementById('formTitle').textContent = 'Editar Veículo';
    document.getElementById('submitBtn').textContent = 'Atualizar Veículo';
    loadVehicleData();
}

// Carregar dados do veículo para edição
async function loadVehicleData() {
    try {
        const response = await fetch(`/api/vehicles/${vehicleId}`);
        const vehicle = await response.json();

        // Preencher campos
        document.getElementById('marca').value = vehicle.marca;
        document.getElementById('modelo').value = vehicle.modelo;
        document.getElementById('ano').value = vehicle.ano;
        document.getElementById('km').value = vehicle.km;
        document.getElementById('preco').value = vehicle.preco;
        document.getElementById('cor').value = vehicle.cor || '';
        document.getElementById('combustivel').value = vehicle.combustivel || '';
        document.getElementById('cambio').value = vehicle.cambio || '';
        document.getElementById('descricao').value = vehicle.descricao || '';
        document.getElementById('destaque').checked = vehicle.destaque;

        // Mostrar imagens existentes
        existingImages = vehicle.images || [];
        displayExistingImages();
    } catch (error) {
        console.error('Erro ao carregar veículo:', error);
        alert('Erro ao carregar dados do veículo');
    }
}

// Exibir imagens existentes
function displayExistingImages() {
    const container = document.getElementById('existingImages');

    if (existingImages.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = existingImages.map((image, index) => `
    <div class="existing-item" data-id="${image.id}">
      <img src="${image.image_path}" alt="Imagem ${index + 1}">
      <button type="button" class="remove-image" onclick="removeExistingImage(${image.id})">×</button>
      ${image.is_primary ? '<div style="position: absolute; top: 5px; left: 5px; background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Principal</div>' : ''}
    </div>
  `).join('');
}

// Remover imagem existente
function removeExistingImage(imageId) {
    imagesToRemove.push(imageId);
    existingImages = existingImages.filter(img => img.id !== imageId);
    displayExistingImages();
}

// Preview de novas imagens
document.getElementById('images').addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    displayImagePreviews();
});

function displayImagePreviews() {
    const container = document.getElementById('imagePreview');

    if (selectedFiles.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const div = document.createElement('div');
            div.className = 'preview-item';
            div.innerHTML = `
        <img src="${e.target.result}" alt="Preview ${index + 1}">
        <button type="button" class="remove-image" onclick="removePreviewImage(${index})">×</button>
        ${index === 0 && existingImages.length === 0 ? '<div style="position: absolute; top: 5px; left: 5px; background: #10b981; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">Principal</div>' : ''}
      `;
            container.appendChild(div);
        };

        reader.readAsDataURL(file);
    });
}

function removePreviewImage(index) {
    selectedFiles.splice(index, 1);
    displayImagePreviews();

    // Atualizar input de arquivo
    const dataTransfer = new DataTransfer();
    selectedFiles.forEach(file => dataTransfer.items.add(file));
    document.getElementById('images').files = dataTransfer.files;
}

// Submit do formulário
document.getElementById('vehicleForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Adicionar campos de texto
    formData.append('marca', document.getElementById('marca').value);
    formData.append('modelo', document.getElementById('modelo').value);
    formData.append('ano', document.getElementById('ano').value);
    formData.append('km', document.getElementById('km').value);
    formData.append('preco', document.getElementById('preco').value);
    formData.append('cor', document.getElementById('cor').value);
    formData.append('combustivel', document.getElementById('combustivel').value);
    formData.append('cambio', document.getElementById('cambio').value);
    formData.append('descricao', document.getElementById('descricao').value);
    formData.append('destaque', document.getElementById('destaque').checked);

    // Adicionar imagens
    selectedFiles.forEach(file => {
        formData.append('images', file);
    });

    // Adicionar IDs de imagens a remover (apenas no modo de edição)
    if (editMode && imagesToRemove.length > 0) {
        formData.append('removeImages', JSON.stringify(imagesToRemove));
    }

    try {
        const url = editMode ? `/api/vehicles/${vehicleId}` : '/api/vehicles';
        const method = editMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (response.ok) {
            alert(editMode ? 'Veículo atualizado com sucesso!' : 'Veículo adicionado com sucesso!');
            window.location.href = '/admin/dashboard.html';
        } else {
            const error = await response.json();
            alert('Erro: ' + (error.error || 'Erro ao salvar veículo'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao salvar veículo');
    }
});
