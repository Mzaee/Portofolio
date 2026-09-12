const demoData = [
  {
    product: 'Espresso Latte',
    category: 'Drinks',
    rawMaterial: 6000,
    packaging: 1200,
    labor: 3500,
    overhead: 2000,
    fixedCost: 5000,
    unitsProduced: 200,
    sellingPrice: 18000,
    salesVolume: 160,
    cashIn: 2880000,
    cashOut: 2100000,
    capex: 5000000,
  },
  {
    product: 'Signature Pancake',
    category: 'Food',
    rawMaterial: 9000,
    packaging: 1500,
    labor: 4300,
    overhead: 2500,
    fixedCost: 6000,
    unitsProduced: 120,
    sellingPrice: 25000,
    salesVolume: 90,
    cashIn: 2250000,
    cashOut: 1750000,
    capex: 3000000,
  },
  {
    product: 'Citrus Tea',
    category: 'Drinks',
    rawMaterial: 3500,
    packaging: 900,
    labor: 2600,
    overhead: 1600,
    fixedCost: 4000,
    unitsProduced: 180,
    sellingPrice: 15000,
    salesVolume: 150,
    cashIn: 2250000,
    cashOut: 1600000,
    capex: 2500000,
  },
];

const state = {
  data: structuredClone(demoData),
};

const tableBody = document.getElementById('productTableBody');
const kpiHpp = document.getElementById('kpiHpp');
const kpiCogs = document.getElementById('kpiCogs');
const kpiBop = document.getElementById('kpiBop');
const kpiRoi = document.getElementById('kpiRoi');
const metricCashFlow = document.getElementById('metricCashFlow');
const metricWorkingCapital = document.getElementById('metricWorkingCapital');
const metricCapex = document.getElementById('metricCapex');
const metricMargin = document.getElementById('metricMargin');
const metricFoodCost = document.getElementById('metricFoodCost');
const profitChart = document.getElementById('profitChart');

const currency = (value) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const percentage = (value) => `${(Number(value || 0)).toFixed(1)}%`;

const round = (value) => Number(value || 0);

const calculateRowMetrics = (row) => {
  const rawCost = Number(row.rawMaterial || 0);
  const packaging = Number(row.packaging || 0);
  const labor = Number(row.labor || 0);
  const overhead = Number(row.overhead || 0);
  const fixedCost = Number(row.fixedCost || 0);
  const unitsProduced = Number(row.unitsProduced || 1);
  const sellingPrice = Number(row.sellingPrice || 0);
  const salesVolume = Number(row.salesVolume || 0);
  const cashIn = Number(row.cashIn || 0);
  const cashOut = Number(row.cashOut || 0);
  const capex = Number(row.capex || 0);

  const totalProductionCost = rawCost + packaging + labor + overhead + fixedCost;
  const hpp = totalProductionCost / unitsProduced;
  const cogs = (rawCost + packaging + labor + overhead) * salesVolume;
  const bop = overhead + fixedCost;
  const revenue = salesVolume * sellingPrice;
  const netProfit = revenue - totalProductionCost;
  const margin = revenue > 0 ? (netProfit / revenue) * 100 : 0;
  const roi = totalProductionCost > 0 ? (netProfit / totalProductionCost) * 100 : 0;
  const foodCost = sellingPrice > 0 ? ((rawCost + packaging) / sellingPrice) * 100 : 0;
  const cashFlow = cashIn - cashOut;

  return {
    hpp,
    cogs,
    bop,
    roi,
    margin,
    foodCost,
    cashFlow,
    capex,
    revenue,
    netProfit,
  };
};

const renderChart = () => {
  const aggregated = state.data.reduce(
    (acc, row) => {
      const metrics = calculateRowMetrics(row);
      acc.margin += metrics.margin;
      acc.foodCost += metrics.foodCost;
      acc.roi += metrics.roi;
      return acc;
    },
    { margin: 0, foodCost: 0, roi: 0 }
  );

  const items = [
    { label: 'Margin', value: Math.min(aggregated.margin, 100) },
    { label: 'Food Cost', value: Math.min(aggregated.foodCost, 100) },
    { label: 'ROI', value: Math.min(Math.abs(aggregated.roi), 100) },
  ];

  profitChart.innerHTML = items
    .map(
      (item) => `
        <div class="bar-item">
          <div class="bar-meta">
            <span>${item.label}</span>
            <strong>${percentage(item.value)}</strong>
          </div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${Math.min(item.value, 100)}%"></div>
          </div>
        </div>
      `
    )
    .join('');
};

const renderKpis = () => {
  const rows = state.data.map(calculateRowMetrics);
  const totalHpp = rows.reduce((sum, row) => sum + row.hpp, 0);
  const totalCogs = rows.reduce((sum, row) => sum + row.cogs, 0);
  const totalBop = rows.reduce((sum, row) => sum + row.bop, 0);
  const totalRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const totalNet = rows.reduce((sum, row) => sum + row.netProfit, 0);
  const totalCashFlow = rows.reduce((sum, row) => sum + row.cashFlow, 0);
  const totalCapex = rows.reduce((sum, row) => sum + row.capex, 0);
  const avgMargin = rows.length ? rows.reduce((sum, row) => sum + row.margin, 0) / rows.length : 0;
  const avgFoodCost = rows.length ? rows.reduce((sum, row) => sum + row.foodCost, 0) / rows.length : 0;
  const avgRoi = rows.length ? rows.reduce((sum, row) => sum + row.roi, 0) / rows.length : 0;

  kpiHpp.textContent = currency(totalHpp / Math.max(rows.length, 1));
  kpiCogs.textContent = currency(totalCogs);
  kpiBop.textContent = currency(totalBop);
  kpiRoi.textContent = percentage(avgRoi);
  metricCashFlow.textContent = currency(totalCashFlow);
  metricWorkingCapital.textContent = currency(Math.max(totalCashFlow - totalCapex, 0));
  metricCapex.textContent = currency(totalCapex);
  metricMargin.textContent = percentage(avgMargin);
  metricFoodCost.textContent = percentage(avgFoodCost);

  document.title = `HPP Dashboard • ${currency(totalRevenue)}`;
};

const productRowTemplate = (row, index) => `
  <tr>
    <td><input data-index="${index}" data-field="product" value="${row.product || ''}" /></td>
    <td><input data-index="${index}" data-field="rawMaterial" type="number" value="${row.rawMaterial || 0}" /></td>
    <td><input data-index="${index}" data-field="packaging" type="number" value="${row.packaging || 0}" /></td>
    <td><input data-index="${index}" data-field="labor" type="number" value="${row.labor || 0}" /></td>
    <td><input data-index="${index}" data-field="overhead" type="number" value="${row.overhead || 0}" /></td>
    <td><input data-index="${index}" data-field="fixedCost" type="number" value="${row.fixedCost || 0}" /></td>
    <td><input data-index="${index}" data-field="unitsProduced" type="number" value="${row.unitsProduced || 0}" /></td>
    <td><input data-index="${index}" data-field="sellingPrice" type="number" value="${row.sellingPrice || 0}" /></td>
    <td><input data-index="${index}" data-field="salesVolume" type="number" value="${row.salesVolume || 0}" /></td>
    <td><input data-index="${index}" data-field="cashIn" type="number" value="${row.cashIn || 0}" /></td>
    <td><input data-index="${index}" data-field="cashOut" type="number" value="${row.cashOut || 0}" /></td>
    <td><input data-index="${index}" data-field="capex" type="number" value="${row.capex || 0}" /></td>
    <td><button class="action-btn" type="button" data-remove="${index}">Remove</button></td>
  </tr>
`;

const renderTable = () => {
  tableBody.innerHTML = state.data
    .map((row, index) => productRowTemplate(row, index))
    .join('');
};

const updateDataFromInputs = () => {
  tableBody.querySelectorAll('input').forEach((input) => {
    const index = Number(input.dataset.index);
    const field = input.dataset.field;
    const value = input.type === 'number' ? Number(input.value || 0) : input.value;
    state.data[index][field] = value;
  });

  renderKpis();
  renderChart();
};

const addRow = () => {
  state.data.push({
    product: 'New Product',
    category: 'General',
    rawMaterial: 0,
    packaging: 0,
    labor: 0,
    overhead: 0,
    fixedCost: 0,
    unitsProduced: 0,
    sellingPrice: 0,
    salesVolume: 0,
    cashIn: 0,
    cashOut: 0,
    capex: 0,
  });

  renderTable();
  renderKpis();
  renderChart();
};

const removeRow = (index) => {
  if (index > -1) {
    state.data.splice(index, 1);
  }

  renderTable();
  renderKpis();
  renderChart();
};

const exportCsv = () => {
  const headers = [
    'Product',
    'Category',
    'RawMaterial',
    'Packaging',
    'Labor',
    'Overhead',
    'FixedCost',
    'UnitsProduced',
    'SellingPrice',
    'SalesVolume',
    'CashIn',
    'CashOut',
    'Capex',
  ];

  const rows = state.data.map((row) => [
    row.product,
    row.category,
    row.rawMaterial,
    row.packaging,
    row.labor,
    row.overhead,
    row.fixedCost,
    row.unitsProduced,
    row.sellingPrice,
    row.salesVolume,
    row.cashIn,
    row.cashOut,
    row.capex,
  ]);

  const csvContent = [headers, ...rows]
    .map((line) => line.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'hpp-demo-data.csv';
  link.click();
  URL.revokeObjectURL(url);
};

const parseCsv = (text) => {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return;

  const headers = lines[0].split(',').map((header) => header.trim());
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(',');
    const mapped = {};

    headers.forEach((header, index) => {
      mapped[header] = cells[index] ? cells[index].trim() : '';
    });

    return {
      product: mapped.Product || mapped.product || 'New Product',
      category: mapped.Category || mapped.category || 'General',
      rawMaterial: Number(mapped.RawMaterial || mapped.rawMaterial || 0),
      packaging: Number(mapped.Packaging || mapped.packaging || 0),
      labor: Number(mapped.Labor || mapped.labor || 0),
      overhead: Number(mapped.Overhead || mapped.overhead || 0),
      fixedCost: Number(mapped.FixedCost || mapped.fixedCost || 0),
      unitsProduced: Number(mapped.UnitsProduced || mapped.unitsProduced || 0),
      sellingPrice: Number(mapped.SellingPrice || mapped.sellingPrice || 0),
      salesVolume: Number(mapped.SalesVolume || mapped.salesVolume || 0),
      cashIn: Number(mapped.CashIn || mapped.cashIn || 0),
      cashOut: Number(mapped.CashOut || mapped.cashOut || 0),
      capex: Number(mapped.Capex || mapped.capex || 0),
    };
  });

  if (rows.length) {
    state.data = rows;
    renderTable();
    renderKpis();
    renderChart();
  }
};

const importCsv = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => parseCsv(String(loadEvent.target?.result || ''));
  reader.readAsText(file);

  event.target.value = '';
};

const wireEvents = () => {
  tableBody.addEventListener('input', updateDataFromInputs);
  tableBody.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-remove]');
    if (!btn) return;
    const index = Number(btn.dataset.remove);
    removeRow(index);
  });

  document.getElementById('addRow').addEventListener('click', addRow);
  document.getElementById('exportCsv').addEventListener('click', exportCsv);
  document.getElementById('loadDemo').addEventListener('click', () => {
    state.data = structuredClone(demoData);
    renderTable();
    renderKpis();
    renderChart();
  });
  document.getElementById('importCsv').addEventListener('change', importCsv);
};

wireEvents();
renderTable();
renderKpis();
renderChart();
