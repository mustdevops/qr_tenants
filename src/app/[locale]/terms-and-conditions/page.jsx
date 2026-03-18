import LegalPageViewer from "@/containers/public/legal-page-viewer";

export default function TermsAndConditionsPage() {
  return (
    <LegalPageViewer
      type="terms-and-conditions"
      fallbackTitle="Terms and Conditions"
      fallbackDescription="Terms and conditions content is not published yet."
    />
  );
}
