# HPP Demo App

This project is a lightweight MVP for a production-cost and operating dashboard. It is designed as a portfolio-friendly demo app for HPP, COGS, BOP, ROI, cash flow, working capital, capex, margin, and food cost analysis.

## Features
- Product input table
- Average HPP and operational KPI summary
- COGS, BOP, ROI, margin, cash flow, and food cost calculations
- CSV import/export for Google Sheet-style workflows
- Demo data loader for quick preview
- Responsive dashboard layout aligned with a warm, premium portfolio aesthetic
- Clean sample sheet template for fast concept demonstration

## CSV format
A ready-to-use sample sheet is available in `template-sheet.csv`.

```csv
Product,Category,RawMaterial,Packaging,Labor,Overhead,FixedCost,UnitsProduced,SellingPrice,SalesVolume,CashIn,CashOut,Capex
Espresso Latte,Drinks,6000,1200,3500,2000,5000,200,18000,160,2880000,2100000,5000000
Signature Pancake,Food,9000,1500,4300,2500,6000,120,25000,90,2250000,1750000,3000000
``` 

This sample sheet is intended as a safe demo template for portfolio presentation. You can keep your real company sheet separate and import this template when showing the app concept.

## Run locally
Open index.html directly in a browser or serve the folder with a small local static server.

Example:
```bash
cd hpp-demo-app
python -m http.server 8000
```

Then visit:
```text
http://localhost:8000
```

## Notes
This is intentionally a demo MVP, not a full ERP or accounting system. It is built to showcase business logic and workflow thinking in a portfolio context.

## Portfolio-ready project description
A portfolio-ready summary is available in `portfolio-project-card.md`.
