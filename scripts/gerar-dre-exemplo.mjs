import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const dados = [
  ["DEMONSTRAÇÃO DO RESULTADO DO EXERCÍCIO"],
  ["Empresa: Transportadora Brasil Cargas Ltda."],
  ["CNPJ: 12.345.678/0001-90"],
  ["Período: Janeiro a Dezembro de 2024"],
  [],
  ["DESCRIÇÃO", "VALOR (R$)", "% Receita Líquida"],
  [],
  ["RECEITA OPERACIONAL BRUTA", "", ""],
  ["  Receita de Fretes", "2.350.000,00", ""],
  ["  Receita de Armazenagem", "150.000,00", ""],
  ["TOTAL RECEITA BRUTA", "2.500.000,00", "111,11%"],
  [],
  ["DEDUÇÕES DA RECEITA"],
  ["  ISS sobre Serviços", "(125.000,00)", ""],
  ["  PIS/COFINS", "(125.000,00)", ""],
  ["TOTAL DEDUÇÕES", "(250.000,00)", "-11,11%"],
  [],
  ["RECEITA LÍQUIDA DE SERVIÇOS", "2.250.000,00", "100,00%"],
  [],
  ["CUSTOS DOS SERVIÇOS PRESTADOS (CPV)"],
  ["  Combustível", "(630.000,00)", ""],
  ["  Manutenção de Frota", "(270.000,00)", ""],
  ["  Motoristas e Ajudantes (salários + encargos)", "(405.000,00)", ""],
  ["  Pedágios e Taxas", "(135.000,00)", ""],
  ["  Pneus e Peças", "(135.000,00)", ""],
  ["TOTAL CPV", "(1.575.000,00)", "-70,00%"],
  [],
  ["LUCRO BRUTO", "675.000,00", "30,00%"],
  [],
  ["DESPESAS OPERACIONAIS"],
  ["  Despesas Administrativas"],
  ["    Salários Administrativos", "(95.000,00)", ""],
  ["    Aluguel e Condomínio", "(36.000,00)", ""],
  ["    Energia Elétrica e Água", "(12.000,00)", ""],
  ["    Honorários Contábeis", "(18.000,00)", ""],
  ["    Comunicação e Internet", "(6.000,00)", ""],
  ["    Seguros", "(13.000,00)", ""],
  ["  Subtotal Administrativo", "(180.000,00)", ""],
  ["  Despesas Comerciais"],
  ["    Comissões de Venda", "(45.000,00)", ""],
  ["    Marketing e Divulgação", "(25.000,00)", ""],
  ["    Representações", "(20.000,00)", ""],
  ["  Subtotal Comercial", "(90.000,00)", ""],
  ["  Outras Despesas Operacionais", "(67.500,00)", ""],
  ["TOTAL DESPESAS OPERACIONAIS", "(337.500,00)", "-15,00%"],
  [],
  ["EBITDA", "337.500,00", "15,00%"],
  [],
  ["  (-) Depreciação da Frota", "(95.000,00)", ""],
  ["  (-) Amortização", "(30.000,00)", ""],
  ["TOTAL DEPRECIAÇÃO E AMORTIZAÇÃO", "(125.000,00)", "-5,56%"],
  [],
  ["RESULTADO OPERACIONAL (EBIT)", "212.500,00", "9,44%"],
  [],
  ["RESULTADO FINANCEIRO"],
  ["  Receitas Financeiras (aplicações)", "8.500,00", ""],
  ["  Despesas Financeiras (financiamento frota)", "(75.000,00)", ""],
  ["  Juros e Multas", "(18.500,00)", ""],
  ["TOTAL RESULTADO FINANCEIRO", "(85.000,00)", "-3,78%"],
  [],
  ["LUCRO ANTES DO IR E CSLL", "127.500,00", "5,67%"],
  [],
  ["  Imposto de Renda (15%)", "(19.125,00)", ""],
  ["  CSLL (9%)", "(11.475,00)", ""],
  ["  Adicional IR", "(12.750,00)", ""],
  ["TOTAL IR E CSLL", "(43.350,00)", "-1,93%"],
  [],
  ["LUCRO LÍQUIDO DO EXERCÍCIO", "84.150,00", "3,74%"],
  [],
  [],
  ["Nota: Valores em Reais (R$). Demonstrativo elaborado conforme NBC TG 26."],
  ["Setor: Transporte Rodoviário de Cargas (CNAE 4930-2)"],
];

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(dados);

// Largura das colunas
ws["!cols"] = [{ wch: 50 }, { wch: 20 }, { wch: 20 }];

XLSX.utils.book_append_sheet(wb, ws, "DRE 2024");

const outputPath = join(__dirname, "..", "public", "dre-exemplo-transportadora.xlsx");
XLSX.writeFile(wb, outputPath);
console.log("Arquivo criado:", outputPath);
