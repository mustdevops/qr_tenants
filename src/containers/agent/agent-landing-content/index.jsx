"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";
import { agentLandingContentService } from "@/lib/services/agent-landing-content.service";
import { toast } from "@/lib/toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Loader2,
  Save,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AgentLandingPageManagementContainer() {
  const t = useTranslations("agentHomepage");
  const { data: session } = useSession();
  const router = useRouter();
  const adminId = session?.user?.adminId;

  // States
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("section1");
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [formData, setFormData] = useState({
    section_key: "",
    title: "",
    slogan_title: "",
    description: "",
    card_title: "",
    card_description: "",
    is_published: true,
  });

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [initDialogOpen, setInitDialogOpen] = useState(false);

  // Load content on mount
  useEffect(() => {
    if (!adminId) {
      router.push("/agent/dashboard");
      return;
    }

    fetchContent();
  }, [adminId, router]);

  /**
   * Fetch all content
   */
  const fetchContent = async () => {
    try {
      setLoading(true);
      const data = await agentLandingContentService.getMineContent();
      setContent(data);
      setInitialized(data.length > 0);
    } catch (error) {
      console.error("Failed to load content:", error);
      toast.error("Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Initialize default structure
   */
  const handleInitialize = async () => {
    try {
      setSaving(true);
      const data = await agentLandingContentService.initializeDefaults();
      setContent(data);
      setInitialized(true);
      setInitDialogOpen(false);
      toast.success("Default structure initialized successfully");
    } catch (error) {
      if (error.response?.data?.message?.includes("already initialized")) {
        setInitialized(true);
      }
      toast.error(error.response?.data?.message || "Failed to initialize");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle edit click
   */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      section_key: item.section_key,
      title: item.title || "",
      slogan_title: item.slogan_title || "",
      description: item.description || "",
      card_title: item.card_title || "",
      card_description: item.card_description || "",
      is_published: item.is_published,
    });
    setEditDialogOpen(true);
  };

  /**
   * Handle form input change
   */
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  /**
   * Save/Update content
   */
  const handleSave = async () => {
    try {
      if (!formData.section_key) {
        toast.error("Section key is required");
        return;
      }

      setSaving(true);
      let saved;

      if (editingId) {
        // Update existing
        saved = await agentLandingContentService.update(
          editingId,
          formData
        );
        setContent((prev) =>
          prev.map((item) => (item.id === editingId ? saved : item))
        );
        toast.success("Content updated successfully");
      } else {
        // Create new
        saved = await agentLandingContentService.create(formData);
        setContent((prev) => [...prev, saved]);
        toast.success("Content created successfully");
      }

      setEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to save content:", error);
      toast.error(error.response?.data?.message || "Failed to save content");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Toggle publish status
   */
  const handleTogglePublish = async (id, currentStatus) => {
    try {
      setSaving(true);
      await agentLandingContentService.update(id, {
        is_published: !currentStatus,
      });
      setContent((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_published: !currentStatus } : item
        )
      );
      toast.success(
        !currentStatus ? "Content published" : "Content unpublished"
      );
    } catch (error) {
      toast.error("Failed to update publish status");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Delete content
   */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      setSaving(true);
      await agentLandingContentService.delete(id);
      setContent((prev) => prev.filter((item) => item.id !== id));
      toast.success("Content deleted successfully");
    } catch (error) {
      toast.error("Failed to delete content");
    } finally {
      setSaving(false);
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      section_key: "",
      title: "",
      slogan_title: "",
      description: "",
      card_title: "",
      card_description: "",
      is_published: true,
    });
  };

  /**
   * Get items for current tab
   */
  const getTabItems = () => {
    return content.filter((item) => item.section_key.startsWith(selectedTab));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Not initialized state
  if (!initialized) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Initialize Landing Page Content</CardTitle>
          <CardDescription>
            Set up default landing page structure to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Click the button below to create the default landing page
              structure with all sections and cards.
            </AlertDescription>
          </Alert>

          <Dialog open={initDialogOpen} onOpenChange={setInitDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Initialize Default Structure
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Initialize Landing Page</DialogTitle>
                <DialogDescription>
                  This will create default sections and cards for your landing
                  page. You can customize each section after initialization.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setInitDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleInitialize} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Proceed
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    );
  }

  // Content editor state
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Landing Page Content Manager</CardTitle>
              <CardDescription>
                Manage and customize your public landing page sections
              </CardDescription>
            </div>
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingId ? "Edit" : "Add"} Content
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the details for this section
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="section_key">Section Key *</Label>
                    <Input
                      id="section_key"
                      placeholder="e.g., section1_title"
                      value={formData.section_key}
                      onChange={(e) =>
                        handleFormChange("section_key", e.target.value)
                      }
                      disabled={editingId !== null}
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Section title"
                      value={formData.title}
                      onChange={(e) =>
                        handleFormChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="slogan_title">Slogan/Subtitle</Label>
                    <Input
                      id="slogan_title"
                      placeholder="Short slogan or subtitle"
                      value={formData.slogan_title}
                      onChange={(e) =>
                        handleFormChange("slogan_title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Detailed description"
                      value={formData.description}
                      onChange={(e) =>
                        handleFormChange("description", e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="card_title">Card Title</Label>
                    <Input
                      id="card_title"
                      placeholder="Card title (for card items)"
                      value={formData.card_title}
                      onChange={(e) =>
                        handleFormChange("card_title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="card_description">Card Description</Label>
                    <Textarea
                      id="card_description"
                      placeholder="Card description"
                      value={formData.card_description}
                      onChange={(e) =>
                        handleFormChange("card_description", e.target.value)
                      }
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) =>
                        handleFormChange("is_published", e.target.checked)
                      }
                      className="rounded"
                    />
                    <Label
                      htmlFor="is_published"
                      className="cursor-pointer font-normal"
                    >
                      Publish immediately
                    </Label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving || !formData.section_key}
                    >
                      {saving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingId ? "Update" : "Create"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="section1">Section 1</TabsTrigger>
          <TabsTrigger value="section2">Section 2</TabsTrigger>
          <TabsTrigger value="section3">Section 3</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
        </TabsList>

        {["section1", "section2", "section3", "footer"].map((tab) => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            {getTabItems().length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">
                    No content for this section
                  </p>
                </CardContent>
              </Card>
            ) : (
              getTabItems().map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          {item.section_key}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {item.title ||
                            item.card_title ||
                            item.slogan_title ||
                            "No title"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleTogglePublish(item.id, item.is_published)
                          }
                          disabled={saving}
                        >
                          {item.is_published ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          disabled={saving}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {item.description && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-muted-foreground">
                          Description:
                        </p>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    )}
                    {item.card_description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Card Description:
                        </p>
                        <p className="text-sm">{item.card_description}</p>
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between border-t pt-3">
                      <span className="text-xs text-muted-foreground">
                        {item.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Updated: {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
