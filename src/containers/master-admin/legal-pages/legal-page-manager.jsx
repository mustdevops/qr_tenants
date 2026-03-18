"use client";

import { useEffect, useMemo, useState } from "react";
import axiosInstance from "@/lib/axios";
import { toast } from "@/lib/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/common/rich-text-editor";
import { Save, Trash2, Eye, FileText, RotateCcw } from "lucide-react";

export default function LegalPageManager({ type, heading, subtitle }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isActive, setIsActive] = useState(true);

  const endpointType = type;

  const activeItem = useMemo(
    () => items.find((item) => item.id === editingId) || null,
    [items, editingId],
  );

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/legal-pages", {
        params: { type: endpointType },
      });
      const list = res?.data?.data || [];
      setItems(list);

      if (list.length > 0) {
        const latest = list[0];
        setEditingId(latest.id);
        setTitle(latest.title || "");
        setContent(latest.content || "");
        setIsActive(Boolean(latest.is_active));
      } else {
        setEditingId(null);
        setTitle("");
        setContent("");
        setIsActive(true);
      }
    } catch (error) {
      console.error("Failed to fetch legal pages", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [endpointType]);

  const handleSelectRevision = (item) => {
    setEditingId(item.id);
    setTitle(item.title || "");
    setContent(item.content || "");
    setIsActive(Boolean(item.is_active));
  };

  const handleReset = () => {
    if (activeItem) {
      handleSelectRevision(activeItem);
      return;
    }
    setTitle("");
    setContent("");
    setIsActive(true);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      toast.error("Please add page content");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        type: endpointType,
        title: title.trim(),
        content,
        is_active: isActive,
      };

      if (editingId) {
        await axiosInstance.patch(`/legal-pages/${editingId}`, payload);
        toast.success("Content updated successfully");
      } else {
        await axiosInstance.post("/legal-pages", payload);
        toast.success("Content created successfully");
      }

      await loadItems();
    } catch (error) {
      console.error("Failed to save legal page", error);
      toast.error(error?.response?.data?.message || "Unable to save content");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingId) return;

    const confirmed = window.confirm("Delete this content? This cannot be undone.");
    if (!confirmed) return;

    setSaving(true);
    try {
      await axiosInstance.delete(`/legal-pages/${editingId}`);
      toast.success("Content deleted");
      await loadItems();
    } catch (error) {
      console.error("Failed to delete legal page", error);
      toast.error(error?.response?.data?.message || "Unable to delete content");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {heading}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} disabled={saving || loading}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="h-4 w-4 mr-2" />
              {editingId ? "Update" : "Create"}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2 shadow-sm">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="legal-title">Page Title</Label>
              <Input
                id="legal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`Write ${heading} title`}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border px-3 py-2 bg-muted/30">
              <div>
                <p className="text-sm font-medium">Show on Landing Page</p>
                <p className="text-xs text-muted-foreground">
                  Toggle to publish or hide this legal page publicly.
                </p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder={`Write ${heading} details here...`}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Revisions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[440px] overflow-y-auto">
              {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
              {!loading && items.length === 0 && (
                <p className="text-sm text-muted-foreground">No content created yet.</p>
              )}
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectRevision(item)}
                  className={`w-full text-left rounded-lg border p-3 transition ${
                    editingId === item.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/40"
                  }`}
                >
                  <p className="font-medium text-sm line-clamp-1">{item.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{new Date(item.updated_at).toLocaleString()}</span>
                    <Badge variant={item.is_active ? "default" : "secondary"}>
                      {item.is_active ? "Published" : "Hidden"}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
                disabled={!editingId || saving || loading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Current Version
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
