import { useState, useEffect, useCallback } from "react";
import { agentLandingContentService } from "@/lib/services/agent-landing-content.service";

/**
 * Hook to fetch and manage dynamic landing page content
 * @param {number} adminId - The admin/agent ID
 * @returns {Object} - Content and loading state
 */
export function useAgentLandingContent(adminId) {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    if (!adminId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await agentLandingContentService.getPublicContent(adminId);
      setContent(data);
    } catch (err) {
      console.error("Failed to fetch landing content:", err);
      setError(err);
      // Return null content on error, will use defaults
      setContent(null);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
}
