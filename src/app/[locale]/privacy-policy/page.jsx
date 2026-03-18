import LegalPageViewer from "@/containers/public/legal-page-viewer";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageViewer
      type="privacy-policy"
      fallbackTitle="Privacy Policy"
      fallbackDescription="Privacy policy content is not published yet."
    />
  );
}
