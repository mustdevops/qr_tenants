"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axios";
import { toast } from "@/lib/toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/routing";

export default function AgentLandingPageForm() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [formData, setFormData] = useState({
    section1_title: "",
    section1_slogan_title: "",
    section1_description: "",
    section2_coupons_title: "",
    section2_coupons_title_description: "",
    section3_title: "",
    section3_slogan_title: "",
    section3_description: "",
    section3_card1_title: "",
    section3_card1_description: "",
    section3_card2_title: "",
    section3_card2_description: "",
    section3_card3_title: "",
    section3_card3_description: "",
    footer_title: "",
  });

  // Load existing content
  useEffect(() => {
    if (!session?.user?.adminId) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/agent-landing-pages");
        if (response.data.data) {
          setFormData((prev) => ({
            ...prev,
            ...response.data.data,
          }));
          // Check if there's actual content
          const hasAnyContent = Object.values(response.data.data).some(v => v && typeof v === 'string' && v.trim().length > 0);
          setHasData(hasAnyContent);
        }
      } catch (error) {
        console.error("Failed to load content:", error);
        setHasData(false);
        // It's OK if no content exists yet
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.section1_title ||
      !formData.section1_description ||
      !formData.section3_title
    ) {
      toast.error("Please fill in required fields (Section 1 and 3 titles/descriptions)");
      return;
    }

    try {
      setSaving(true);
      
      // Clean the form data - only include fields that are defined and not empty
      const cleanData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          cleanData[key] = formData[key];
        }
      });
      
      console.log("Submitting clean form data:", JSON.stringify(cleanData, null, 2));
      const response = await axiosInstance.post("/agent-landing-pages", cleanData);
      console.log("Response:", response.data);
      
      if (response.data.data) {
        setFormData((prev) => ({
          ...prev,
          ...response.data.data,
        }));
        const hasAnyContent = Object.values(response.data.data).some(v => v && typeof v === 'string' && v.trim().length > 0);
        setHasData(hasAnyContent);
      }
      
      toast.success(hasData ? "Landing page content updated successfully!" : "Landing page content saved successfully!");
    } catch (error) {
      console.error("Failed to save:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      toast.error(
        error.response?.data?.message || error.response?.data?.errors?.toString() || "Failed to save landing page content"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Landing Page Content Manager</CardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Edit your agent landing page content. All changes will be displayed on your public landing page.
              </p>
            </div>
            {/* {hasData && (
              <Button
                variant="outline"
                onClick={() => {
                  const adminId = session?.user?.adminId;
                  window.open(`/homepage/agent?adminId=${adminId}`, "_blank");
                }}
              >
                Preview
              </Button>
            )} */}
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1 */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Section 1 - Official Partner Network</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section1_title">Section Title *</Label>
                  <Input
                    id="section1_title"
                    name="section1_title"
                    value={formData.section1_title}
                    onChange={handleChange}
                    placeholder="e.g., Official Partner Network"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="section1_slogan_title">Slogan/Subtitle</Label>
                  <Input
                    id="section1_slogan_title"
                    name="section1_slogan_title"
                    value={formData.section1_slogan_title}
                    onChange={handleChange}
                    placeholder="e.g., Exclusive Deals Curated For You"
                  />
                </div>

                <div>
                  <Label htmlFor="section1_description">Description *</Label>
                  <Textarea
                    id="section1_description"
                    name="section1_description"
                    value={formData.section1_description}
                    onChange={handleChange}
                    placeholder="Section description..."
                    rows={4}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Section 2 - Ready to Explore</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section2_coupons_title">Section Title</Label>
                  <Input
                    id="section2_coupons_title"
                    name="section2_coupons_title"
                    value={formData.section2_coupons_title}
                    onChange={handleChange}
                    placeholder="e.g., Ready to Explore?"
                  />
                </div>

                <div>
                  <Label htmlFor="section2_coupons_title_description">Description</Label>
                  <Textarea
                    id="section2_coupons_title_description"
                    name="section2_coupons_title_description"
                    value={formData.section2_coupons_title_description}
                    onChange={handleChange}
                    placeholder="Section description..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Section 3 - Why Choose Us</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="section3_title">Section Title *</Label>
                  <Input
                    id="section3_title"
                    name="section3_title"
                    value={formData.section3_title}
                    onChange={handleChange}
                    placeholder="e.g., Why Choose Us"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="section3_slogan_title">Slogan/Subtitle</Label>
                  <Input
                    id="section3_slogan_title"
                    name="section3_slogan_title"
                    value={formData.section3_slogan_title}
                    onChange={handleChange}
                    placeholder="e.g., Everything you need to grow"
                  />
                </div>

                <div>
                  <Label htmlFor="section3_description">Description</Label>
                  <Textarea
                    id="section3_description"
                    name="section3_description"
                    value={formData.section3_description}
                    onChange={handleChange}
                    placeholder="Section description..."
                    rows={4}
                  />
                </div>

                {/* Cards */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold mb-4">Feature Cards (3 cards)</h4>

                  {/* Card 1 */}
                  <div className="mb-6 pb-6 border-b">
                    <p className="font-medium text-sm mb-3 text-gray-700">Card 1</p>
                    <div className="space-y-3">
                      <Input
                        name="section3_card1_title"
                        value={formData.section3_card1_title}
                        onChange={handleChange}
                        placeholder="Card title"
                      />
                      <Textarea
                        name="section3_card1_description"
                        value={formData.section3_card1_description}
                        onChange={handleChange}
                        placeholder="Card description..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="mb-6 pb-6 border-b">
                    <p className="font-medium text-sm mb-3 text-gray-700">Card 2</p>
                    <div className="space-y-3">
                      <Input
                        name="section3_card2_title"
                        value={formData.section3_card2_title}
                        onChange={handleChange}
                        placeholder="Card title"
                      />
                      <Textarea
                        name="section3_card2_description"
                        value={formData.section3_card2_description}
                        onChange={handleChange}
                        placeholder="Card description..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div>
                    <p className="font-medium text-sm mb-3 text-gray-700">Card 3</p>
                    <div className="space-y-3">
                      <Input
                        name="section3_card3_title"
                        value={formData.section3_card3_title}
                        onChange={handleChange}
                        placeholder="Card title"
                      />
                      <Textarea
                        name="section3_card3_description"
                        value={formData.section3_card3_description}
                        onChange={handleChange}
                        placeholder="Card description..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-b pb-6">
              <h3 className="text-lg font-semibold mb-4">Footer</h3>
              <div>
                <Label htmlFor="footer_title">Footer Title</Label>
                <Input
                  id="footer_title"
                  name="footer_title"
                  value={formData.footer_title}
                  onChange={handleChange}
                  placeholder="e.g., Global Merchant Network"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {hasData ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  hasData ? "Update Changes" : "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
