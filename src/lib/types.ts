export interface Empresa {
  id: string;
  user_id: string;
  nome: string;
  cnpj?: string;
  setor: string;
  created_at: string;
}

export interface AnaliseRecord {
  id: string;
  empresa_id: string;
  user_id: string;
  periodo?: string;
  mes?: number;
  ano?: number;
  arquivo_nome?: string;
  dre_data: DREData;
  analise_ia: AnaliseIA;
  score: number;
  created_at: string;
}

export interface DRELine {
  descricao: string;
  valor: number;
  percentual?: number;
}

export interface DREData {
  empresa?: string;
  periodo?: string;
  receitaBruta: number;
  deducoes: number;
  receitaLiquida: number;
  custosServicos: number;
  lucroBruto: number;
  despesasOperacionais: number;
  ebitda: number;
  depreciacaoAmortizacao: number;
  resultadoOperacional: number;
  resultadoFinanceiro: number;
  lucroAntesIR: number;
  ir: number;
  lucroLiquido: number;
  linhasExtras?: DRELine[];
}

export interface MetricaTrimestral {
  periodo: string;
  receitaLiquida: number;
  lucroBruto: number;
  ebitda: number;
  lucroLiquido: number;
  margemBruta: number;
  margemEbitda: number;
  margemLiquida: number;
}

export interface IndicadorSaude {
  nome: string;
  valor: number;
  unidade: string;
  status: "excelente" | "bom" | "atencao" | "critico";
  descricao: string;
}

export interface AnaliseIA {
  scoreGeral: number;
  classificacao: "Excelente" | "Boa" | "Regular" | "Crítica";
  resumoExecutivo: string;
  pontosFortes: string[];
  pontosAtencao: string[];
  recomendacoes: string[];
  analiseSetorial: string;
  indicadores: IndicadorSaude[];
  historico?: MetricaTrimestral[];
  dreData: DREData;
}
