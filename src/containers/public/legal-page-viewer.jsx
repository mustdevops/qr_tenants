"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function LegalPageViewer({ type, fallbackTitle, fallbackDescription }) {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const isPublished = Boolean(doc?.is_active);

  useEffect(() => {
    const fetchDoc = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/legal-pages/public/${type}`);
        setDoc(res?.data?.data || null);
      } catch (error) {
        console.error(`Failed to fetch legal page ${type}`, error);
        setDoc(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoc();
  }, [type]);

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-slate-200">
          <CardHeader className="border-b bg-slate-50/80">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </span>
              {doc?.title || fallbackTitle}
            </CardTitle>
            {doc?.published_at && (
              <p className="text-xs text-muted-foreground">
                Last updated: {new Date(doc.published_at).toLocaleString()}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            {loading ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-[90%]" />
                <div className="h-4 bg-muted rounded w-[95%]" />
              </div>
            ) : isPublished && doc?.content ? (
              <article
                className="prose prose-slate max-w-none prose-headings:font-bold prose-a:text-primary"
                dangerouslySetInnerHTML={{ __html: doc.content }}
              />
            ) : (
              <div className="rounded-xl border border-dashed p-6 text-center bg-muted/20">
                <p className="font-medium">{fallbackTitle}</p>
                <p className="text-sm text-muted-foreground mt-2">{fallbackDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
