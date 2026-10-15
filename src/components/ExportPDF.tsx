"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface ExportPDFProps {
  targetId: string;
  nomeEmpresa: string;
  periodo?: string;
}

export function ExportPDF({ targetId, nomeEmpresa, periodo }: ExportPDFProps) {
  const [loading, setLoading] = useState(false);

  async function exportar() {
    setLoading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const el = document.getElementById(targetId);
      if (!el) return;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f9fafb",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgW = pageW - 20;
      const imgH = imgW * ratio;

      let y = 10;
      if (imgH <= pageH - 20) {
        pdf.addImage(imgData, "PNG", 10, y, imgW, imgH);
      } else {
        // Multi-página
        let remainingH = imgH;
        let srcY = 0;
        while (remainingH > 0) {
          const sliceH = Math.min(pageH - 20, remainingH);
          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = canvas.width;
          sliceCanvas.height = (sliceH / imgH) * canvas.height;
          const ctx = sliceCanvas.getContext("2d")!;
          ctx.drawImage(canvas, 0, srcY * (canvas.height / imgH), canvas.width, sliceCanvas.height, 0, 0, sliceCanvas.width, sliceCanvas.height);
          if (srcY > 0) pdf.addPage();
          pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", 10, 10, imgW, sliceH);
          srcY += sliceH;
          remainingH -= sliceH;
        }
      }

      const nome = `DRE_${nomeEmpresa.replace(/\s+/g, "_")}${periodo ? `_${periodo}` : ""}.pdf`;
      pdf.save(nome);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={exportar}
      disabled={loading}
      className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
      Exportar PDF
    </button>
  );
}
