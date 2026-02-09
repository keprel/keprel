"use client";

import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText, Eye } from "lucide-react";
import type { WorkOrderDocument } from "@/types/work-orders";

interface DocumentUploadCardProps {
  workOrderId: string;
  categoryKey: string;
  label: string;
  acceptedTypes: readonly string[];
  multiple: boolean;
  documents: WorkOrderDocument[];
  disabled?: boolean;
}

export function DocumentUploadCard({
  workOrderId,
  categoryKey,
  label,
  acceptedTypes,
  multiple,
  documents,
  disabled,
}: DocumentUploadCardProps) {
  const [docs, setDocs] = useState<WorkOrderDocument[]>(documents);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = acceptedTypes.join(",");

  const uploadFile = useCallback(
    async (file: File) => {
      if (file.size > 10 * 1024 * 1024) {
        alert("File must be under 10MB");
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.set("file", file);
        formData.set("category", categoryKey);

        const res = await fetch(
          `/api/work-orders/${workOrderId}/documents`,
          { method: "POST", body: formData }
        );

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const doc: WorkOrderDocument = await res.json();

        if (multiple) {
          setDocs((prev) => [...prev, doc]);
        } else {
          setDocs([doc]);
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [workOrderId, categoryKey, multiple]
  );

  async function handleDelete(docId: string) {
    try {
      const res = await fetch(
        `/api/work-orders/${workOrderId}/documents/${docId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        throw new Error("Failed to delete document");
      }

      setDocs((prev) => prev.filter((d) => d.id !== docId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  const canUpload = !disabled && (multiple || docs.length === 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{doc.fileName}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                asChild
              >
                <a
                  href={`/api/work-orders/${workOrderId}/documents/${doc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="h-3.5 w-3.5" />
                </a>
              </Button>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDelete(doc.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}

        {canUpload && (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-4 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground"
            }`}
          >
            <Upload className="h-5 w-5 text-muted-foreground mb-1" />
            <p className="text-xs text-muted-foreground">
              {uploading ? "Uploading..." : "Drop file here or click to upload"}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
