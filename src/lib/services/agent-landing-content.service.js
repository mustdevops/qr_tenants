import axiosInstance from "@/lib/axios";

/**
 * Service for managing agent landing page content
 * Handles all API communication with the backend
 */
class AgentLandingContentService {
  #baseURL = "/agent-landing-content";

  /**
   * Get all content for current agent (including draft & published)
   */
  async getMineContent() {
    try {
      const response = await axiosInstance.get(`${this.#baseURL}/mine`);
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch landing content:", error);
      throw error;
    }
  }

  /**
   * Get organized content structure for editing
   */
  async getOrganizedStructure() {
    try {
      const response = await axiosInstance.get(
        `${this.#baseURL}/mine/organized`
      );
      return response.data.data || null;
    } catch (error) {
      console.error("Failed to fetch organized structure:", error);
      throw error;
    }
  }

  /**
   * Get published content for specific admin (public)
   */
  async getPublicContent(adminId) {
    try {
      const response = await axiosInstance.get(
        `${this.#baseURL}/admin/${adminId}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error("Failed to fetch public content:", error);
      throw error;
    }
  }

  /**
   * Initialize default landing page structure
   */
  async initializeDefaults() {
    try {
      const response = await axiosInstance.post(
        `${this.#baseURL}/initialize`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to initialize defaults:", error);
      throw error;
    }
  }

  /**
   * Get content by section key
   */
  async getBySectionKey(sectionKey) {
    try {
      const response = await axiosInstance.get(
        `${this.#baseURL}/section/${sectionKey}`
      );
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch section ${sectionKey}:`, error);
      throw error;
    }
  }

  /**
   * Get single content by id
   */
  async getById(id) {
    try {
      const response = await axiosInstance.get(`${this.#baseURL}/${id}`);
      return response.data.data || null;
    } catch (error) {
      console.error(`Failed to fetch content ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create new content
   */
  async create(createData) {
    try {
      const response = await axiosInstance.post(this.#baseURL, createData);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Failed to create content:", error);
      throw error;
    }
  }

  /**
   * Update content
   */
  async update(id, updateData) {
    try {
      const response = await axiosInstance.patch(
        `${this.#baseURL}/${id}`,
        updateData
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to update content ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete content
   */
  async delete(id) {
    try {
      const response = await axiosInstance.delete(`${this.#baseURL}/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Failed to delete content ${id}:`, error);
      throw error;
    }
  }

  /**
   * Bulk update (publish/unpublish multiple items)
   */
  async bulkUpdate(updates) {
    try {
      const response = await axiosInstance.patch(
        `${this.#baseURL}/bulk/update`,
        updates
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Failed to bulk update content:", error);
      throw error;
    }
  }

  /**
   * Publish all content for the agent
   */
  async publishAll(contentIds) {
    const updates = contentIds.map((id) => ({
      id,
      is_published: true,
    }));
    return this.bulkUpdate(updates);
  }

  /**
   * Unpublish all content for the agent
   */
  async unpublishAll(contentIds) {
    const updates = contentIds.map((id) => ({
      id,
      is_published: false,
    }));
    return this.bulkUpdate(updates);
  }
}

export const agentLandingContentService = new AgentLandingContentService();
