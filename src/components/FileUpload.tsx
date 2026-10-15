"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Loader2 } from "lucide-react";

interface FileUploadProps {
  onAnalise: (data: unknown) => void;
  onError: (msg: string) => void;
  empresaId?: string;
}

export function FileUpload({ onAnalise, onError, empresaId }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setLoading(true);
      setFileName(file.name);
      onError("");

      try {
        const formData = new FormData();
        formData.append("file", file);
        if (empresaId) formData.append("empresa_id", empresaId);

        const res = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao analisar arquivo");

        onAnalise(data);
      } catch (err) {
        onError(err instanceof Error ? err.message : "Erro desconhecido");
        setFileName(null);
      } finally {
        setLoading(false);
      }
    },
    [onAnalise, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && processFile(files[0]),
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
    },
    multiple: false,
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
        ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
        ${loading ? "opacity-70 cursor-not-allowed" : ""}
      `}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center gap-4">
        {loading ? (
          <>
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            <p className="text-gray-600 font-medium">Analisando {fileName}...</p>
            <p className="text-sm text-gray-400">O Claude está lendo seu DRE</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              {isDragActive ? (
                <FileText className="w-8 h-8 text-blue-600" />
              ) : (
                <Upload className="w-8 h-8 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-700">
                {isDragActive ? "Solte o arquivo aqui" : "Envie o DRE da empresa"}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                PDF, Excel (.xlsx/.xls), CSV ou Imagem (JPG/PNG)
              </p>
            </div>
            <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
              Arraste ou clique para selecionar
            </span>
          </>
        )}
      </div>
    </div>
  );
}
