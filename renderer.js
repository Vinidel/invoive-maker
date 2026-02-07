const itemsContainer = document.getElementById('items');
const itemTemplate = document.getElementById('itemTemplate');
const servicesContainer = document.getElementById('services');
const serviceTemplate = document.getElementById('serviceTemplate');
const invoiceView = document.getElementById('invoiceView');
const configView = document.getElementById('configView');

const invoiceNumber = document.getElementById('invoiceNumber');
const invoiceDate = document.getElementById('invoiceDate');
const dueDate = document.getElementById('dueDate');
const currency = document.getElementById('currency');
const clientName = document.getElementById('clientName');
const clientAddress = document.getElementById('clientAddress');
const clientEmail = document.getElementById('clientEmail');
const clientContact = document.getElementById('clientContact');
const taxRate = document.getElementById('taxRate');
const discount = document.getElementById('discount');
const shipping = document.getElementById('shipping');
const notes = document.getElementById('notes');
const tabInvoice = document.getElementById('tabInvoice');
const tabConfig = document.getElementById('tabConfig');

const companyName = document.getElementById('companyName');
const companyCnpj = document.getElementById('companyCnpj');
const companyPhone = document.getElementById('companyPhone');
const companyWhatsapp = document.getElementById('companyWhatsapp');
const companyInstagram = document.getElementById('companyInstagram');
const companyLogoFile = document.getElementById('companyLogoFile');
const companyLogoPreview = document.getElementById('companyLogoPreview');
const logoReset = document.getElementById('logoReset');

const prevInvoiceNumber = document.getElementById('prevInvoiceNumber');
const prevInvoiceDate = document.getElementById('prevInvoiceDate');
const prevDueDate = document.getElementById('prevDueDate');
const prevFrom = document.getElementById('prevFrom');
const prevTo = document.getElementById('prevTo');
const prevItems = document.getElementById('prevItems');
const prevSubtotal = document.getElementById('prevSubtotal');
const prevTax = document.getElementById('prevTax');
const prevDiscount = document.getElementById('prevDiscount');
const prevShipping = document.getElementById('prevShipping');
const prevTotal = document.getElementById('prevTotal');
const prevNotes = document.getElementById('prevNotes');
const prevWhatsapp = document.getElementById('prevWhatsapp');
const prevInstagram = document.getElementById('prevInstagram');

const addItemBtn = document.getElementById('addItem');
const addServiceBtn = document.getElementById('addService');
const clearBtn = document.getElementById('clearBtn');
const printBtn = document.getElementById('printBtn');

const defaultLocale = 'pt-BR';
const defaultConfig = {
  name: 'ANDERSON JARDINAGEM',
  cnpj: '48.862.953/0001-95',
  phone: '(48) 98483-1799',
  whatsapp: '(48) 98483-1799',
  instagram: 'Andersonjardins',
  logoSrc: 'assets/logo.png'
};

let serviceCounter = 0;
let companyConfig = { ...defaultConfig };

function loadConfig() {
  const raw = localStorage.getItem('companyConfig');
  if (raw) {
    try {
      companyConfig = { ...defaultConfig, ...JSON.parse(raw) };
    } catch (err) {
      companyConfig = { ...defaultConfig };
    }
  }
}

function saveConfig() {
  localStorage.setItem('companyConfig', JSON.stringify(companyConfig));
}

function applyConfigToForm() {
  companyName.value = companyConfig.name;
  companyCnpj.value = companyConfig.cnpj;
  companyPhone.value = companyConfig.phone;
  companyWhatsapp.value = companyConfig.whatsapp;
  companyInstagram.value = companyConfig.instagram;
  companyLogoPreview.src = companyConfig.logoSrc || defaultConfig.logoSrc;
  const logoImg = document.getElementById('companyLogo');
  logoImg.src = companyConfig.logoSrc || defaultConfig.logoSrc;
}

function buildCompanyText() {
  const lines = [];
  if (companyConfig.name) lines.push(companyConfig.name);
  if (companyConfig.cnpj) lines.push(`CNPJ: ${companyConfig.cnpj}`);
  if (companyConfig.phone) lines.push(`Fone: ${companyConfig.phone}`);
  return lines.join('\n');
}

function formatMoney(value) {
  const selected = currency.value || 'BRL';
  const formatter = new Intl.NumberFormat(defaultLocale, {
    style: 'currency',
    currency: selected,
    currencyDisplay: 'symbol',
    minimumFractionDigits: selected === 'JPY' ? 0 : 2,
    maximumFractionDigits: selected === 'JPY' ? 0 : 2
  });
  return formatter.format(value || 0);
}

function formatDateInput(value) {
  if (!value) return '—';
  const date = new Date(value + 'T00:00:00');
  return date.toLocaleDateString(defaultLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function createItem(desc = '', qty = 1, rate = 0) {
  const node = itemTemplate.content.cloneNode(true);
  const item = node.querySelector('.item');
  const serviceSelect = node.querySelector('.item-service');
  const descInput = node.querySelector('.item-desc');
  const qtyInput = node.querySelector('.item-qty');
  const rateInput = node.querySelector('.item-rate');
  const removeBtn = node.querySelector('.item-remove');

  descInput.value = desc;
  qtyInput.value = qty;
  rateInput.value = rate;

  [descInput, qtyInput, rateInput].forEach((input) => {
    input.addEventListener('input', updatePreview);
  });

  serviceSelect.addEventListener('change', () => {
    const services = collectServices();
    const selected = services.find((service) => service.id === serviceSelect.value);
    if (selected) {
      descInput.value = selected.desc || selected.name;
      rateInput.value = selected.rate;
    }
    updatePreview();
  });

  removeBtn.addEventListener('click', () => {
    item.remove();
    if (itemsContainer.children.length === 0) {
      addItem();
    }
    updatePreview();
  });

  itemsContainer.appendChild(node);
  refreshServiceOptions();
}

function addItem() {
  createItem('', 1, 0);
  updatePreview();
}

function createService(name = '', desc = '', rate = '') {
  const node = serviceTemplate.content.cloneNode(true);
  const card = node.querySelector('.service-card');
  const nameInput = node.querySelector('.service-name');
  const descInput = node.querySelector('.service-desc');
  const rateInput = node.querySelector('.service-rate');
  const removeBtn = node.querySelector('.service-remove');

  const id = `svc-${serviceCounter += 1}`;
  card.dataset.id = id;

  nameInput.value = name;
  descInput.value = desc;
  rateInput.value = rate;

  const sync = () => {
    refreshServiceOptions();
    const services = collectServices();
    const selected = services.find((service) => service.id === id);
    if (selected) {
      updateItemsFromService(selected);
    }
    updatePreview();
  };

  [nameInput, descInput, rateInput].forEach((input) => input.addEventListener('input', sync));

  removeBtn.addEventListener('click', () => {
    card.remove();
    refreshServiceOptions();
    updatePreview();
  });

  servicesContainer.appendChild(node);
  refreshServiceOptions();
}

function collectServices() {
  const services = [];
  servicesContainer.querySelectorAll('.service-card').forEach((card) => {
    services.push({
      id: card.dataset.id,
      name: card.querySelector('.service-name').value.trim(),
      desc: card.querySelector('.service-desc').value.trim(),
      rate: parseFloat(card.querySelector('.service-rate').value) || 0
    });
  });
  return services;
}

function refreshServiceOptions() {
  const services = collectServices().filter((service) => service.name);
  itemsContainer.querySelectorAll('.item').forEach((row) => {
    const select = row.querySelector('.item-service');
    const previous = select.value;
    select.innerHTML = '<option value=\"\">Personalizado</option>';
    services.forEach((service) => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = service.name;
      select.appendChild(option);
    });
    const hasPrevious = [...select.options].some((opt) => opt.value === previous);
    select.value = hasPrevious ? previous : '';
  });
}

function updateItemsFromService(service) {
  itemsContainer.querySelectorAll('.item').forEach((row) => {
    const select = row.querySelector('.item-service');
    if (select.value === service.id) {
      row.querySelector('.item-desc').value = service.desc || service.name;
      row.querySelector('.item-rate').value = service.rate;
    }
  });
}

function collectItems() {
  const rows = [];
  itemsContainer.querySelectorAll('.item').forEach((row) => {
    const desc = row.querySelector('.item-desc').value.trim();
    const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
    const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
    rows.push({ desc, qty, rate, amount: qty * rate });
  });
  return rows;
}

function updatePreview() {
  const items = collectItems();
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * ((parseFloat(taxRate.value) || 0) / 100);
  const discountValue = parseFloat(discount.value) || 0;
  const shippingValue = parseFloat(shipping.value) || 0;
  const total = subtotal + tax + shippingValue - discountValue;

  prevInvoiceNumber.textContent = invoiceNumber.value || 'ORC-1001';
  prevInvoiceDate.textContent = formatDateInput(invoiceDate.value);
  prevDueDate.textContent = formatDateInput(dueDate.value);
  prevFrom.textContent = buildCompanyText();
  const clientLines = [
    clientName.value.trim(),
    clientAddress.value.trim(),
    clientEmail.value.trim(),
    clientContact.value.trim()
  ].filter(Boolean);
  prevTo.textContent = clientLines.length ? clientLines.join('\n') : 'Dados do cliente';
  prevNotes.textContent = notes.value || '';
  prevWhatsapp.textContent = companyConfig.whatsapp || '—';
  prevInstagram.textContent = companyConfig.instagram || '—';

  prevItems.innerHTML = '';
  items.forEach((item) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.desc || 'Item'}</td>
      <td>${item.qty}</td>
      <td>${formatMoney(item.rate)}</td>
      <td>${formatMoney(item.amount)}</td>
    `;
    prevItems.appendChild(row);
  });

  if (items.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>Item</td>
      <td>0</td>
      <td>${formatMoney(0)}</td>
      <td>${formatMoney(0)}</td>
    `;
    prevItems.appendChild(row);
  }

  prevSubtotal.textContent = formatMoney(subtotal);
  prevTax.textContent = formatMoney(tax);
  prevDiscount.textContent = formatMoney(discountValue);
  prevShipping.textContent = formatMoney(shippingValue);
  prevTotal.textContent = formatMoney(total);
}

function clearForm() {
  invoiceNumber.value = '';
  invoiceDate.value = '';
  dueDate.value = '';
  currency.value = 'BRL';
  clientName.value = '';
  clientAddress.value = '';
  clientEmail.value = '';
  clientContact.value = '';
  taxRate.value = '';
  discount.value = '';
  shipping.value = '';
  notes.value = '';

  itemsContainer.innerHTML = '';
  addItem();
  updatePreview();
}

[invoiceNumber, invoiceDate, dueDate, currency, clientName, clientAddress, clientEmail, clientContact, taxRate, discount, shipping, notes].forEach(
  (input) => input.addEventListener('input', updatePreview)
);

addItemBtn.addEventListener('click', addItem);
addServiceBtn.addEventListener('click', () => createService());
clearBtn.addEventListener('click', clearForm);

printBtn.addEventListener('click', async () => {
  const result = await window.invoiceApi.printToPdf();
  if (!result.ok && result.error !== 'Canceled') {
    alert(`Falha ao salvar PDF: ${result.error}`);
  }
});

tabInvoice.addEventListener('click', () => {
  invoiceView.classList.add('active');
  configView.classList.remove('active');
  tabInvoice.classList.add('active');
  tabConfig.classList.remove('active');
});

tabConfig.addEventListener('click', () => {
  configView.classList.add('active');
  invoiceView.classList.remove('active');
  tabConfig.classList.add('active');
  tabInvoice.classList.remove('active');
});

[companyName, companyCnpj, companyPhone, companyWhatsapp, companyInstagram].forEach((input) => {
  input.addEventListener('input', () => {
    companyConfig = {
      ...companyConfig,
      name: companyName.value.trim(),
      cnpj: companyCnpj.value.trim(),
      phone: companyPhone.value.trim(),
      whatsapp: companyWhatsapp.value.trim(),
      instagram: companyInstagram.value.trim()
    };
    saveConfig();
    updatePreview();
  });
});

companyLogoFile.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    companyConfig.logoSrc = reader.result;
    saveConfig();
    applyConfigToForm();
  };
  reader.readAsDataURL(file);
});

logoReset.addEventListener('click', () => {
  companyConfig.logoSrc = defaultConfig.logoSrc;
  saveConfig();
  applyConfigToForm();
});

loadConfig();
applyConfigToForm();
createService('Consultoria', 'Serviços profissionais de consultoria', 150);
addItem();
updatePreview();
