# Catálogo de Carros

Sistema completo de catálogo automotivo com painel administrativo e interface pública para visualização e filtragem de veículos.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor
npm start
```

O servidor estará disponível em:
- **Catálogo Público**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin/login.html

**Credenciais Admin**:
- Username: `admin`
- Password: `admin123`

## ✨ Funcionalidades

### Painel Administrativo
- 🔐 Login seguro com autenticação
- 📊 Dashboard com estatísticas
- ➕ Adicionar veículos com múltiplas fotos
- ✏️ Editar informações e imagens
- 🗑️ Excluir veículos
- 📸 Upload de até 20 fotos por veículo

### Catálogo Público
- 🎨 Design moderno e responsivo
- 🔍 Busca em tempo real
- 🎛️ Filtros avançados:
  - Marca e Modelo
  - Faixa de Ano
  - Quilometragem
  - Faixa de Preço
  - Combustível e Câmbio
- 🖼️ Galeria interativa de fotos
- 📱 Integração com WhatsApp
- 💫 Destaques especiais

## 📦 Tecnologias

- **Backend**: Node.js, Express.js
- **Banco de Dados**: SQLite3
- **Upload**: Multer
- **Autenticação**: Bcrypt + Express Session
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Design**: CSS Grid, Flexbox, Gradientes

## 📁 Estrutura do Projeto

```
catalogo-car/
├── server.js              # Servidor Express
├── database.js            # Configuração do banco
├── package.json
├── database.sqlite        # Banco de dados (auto-criado)
├── uploads/              # Imagens dos veículos
├── admin/                # Painel Admin
│   ├── login.html
│   ├── dashboard.html
│   ├── vehicle-form.html
│   ├── admin.css
│   └── admin.js
└── public/               # Catálogo Público
    ├── index.html
    ├── vehicle.html
    ├── styles.css
    └── script.js
```

## 📖 Documentação

Para instruções detalhadas de uso, consulte o [Guia de Uso](/.gemini/antigravity/brain/0eb2690b-154f-4325-b0c2-6948b4402141/guia_de_uso.md)

## 🔧 Personalização

### Alterar WhatsApp

Edite o arquivo `public/vehicle.html` e altere o número:
```html
<a href="https://wa.me/SEU_NUMERO?text=...">
```

### Personalizar Cores

Edite as variáveis CSS em `public/styles.css`:
```css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  /* ... */
}
```

## 📝 Licença

Este projeto é livre para uso pessoal e comercial.

---

**Desenvolvido para facilitar a gestão de catálogos automotivos 🚗✨**
