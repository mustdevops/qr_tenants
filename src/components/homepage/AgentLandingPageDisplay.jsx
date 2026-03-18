"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Loader2 } from "lucide-react";

export default function AgentLandingPageDisplay({ adminId }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!adminId) return;

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `/agent-landing-pages/public/${adminId}`
        );
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch landing page content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [adminId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!data || !data.section1_title) {
    return null; // No custom content, show default from page
  }

  return (
    <>
      {/* Section 1 */}
      {data.section1_title && (
        <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{data.section1_title}</h2>
            {data.section1_slogan_title && (
              <p className="text-xl text-center text-gray-600 mb-6">
                {data.section1_slogan_title}
              </p>
            )}
            {data.section1_description && (
              <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
                {data.section1_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Section 2 */}
      {data.section2_coupons_title && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">
              {data.section2_coupons_title}
            </h2>
            {data.section2_coupons_title_description && (
              <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
                {data.section2_coupons_title_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Section 3 */}
      {data.section3_title && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">{data.section3_title}</h2>
            {data.section3_slogan_title && (
              <p className="text-xl text-center text-gray-600 mb-12">
                {data.section3_slogan_title}
              </p>
            )}

            {/* Cards Grid */}
            {(data.section3_card1_title ||
              data.section3_card2_title ||
              data.section3_card3_title) && (
              <div className="grid md:grid-cols-3 gap-8 mt-8">
                {data.section3_card1_title && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">
                      {data.section3_card1_title}
                    </h3>
                    <p className="text-gray-600">{data.section3_card1_description}</p>
                  </div>
                )}

                {data.section3_card2_title && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">
                      {data.section3_card2_title}
                    </h3>
                    <p className="text-gray-600">{data.section3_card2_description}</p>
                  </div>
                )}

                {data.section3_card3_title && (
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-3">
                      {data.section3_card3_title}
                    </h3>
                    <p className="text-gray-600">{data.section3_card3_description}</p>
                  </div>
                )}
              </div>
            )}

            {data.section3_description && (
              <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto mt-8">
                {data.section3_description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Footer */}
      {data.footer_title && (
        <section className="py-8 bg-dark text-white text-center">
          <p className="text-lg">{data.footer_title}</p>
        </section>
      )}
    </>
  );
}
