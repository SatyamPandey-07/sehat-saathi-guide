import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-green-100 rounded-2xl p-10 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: January 2026
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              By accessing or using Sehat Saathi Guide, you agree to comply with
              these Terms & Conditions. If you do not agree, please do not use
              this website.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                1. Purpose of the Platform
              </h2>
              <p>
                Sehat Saathi Guide provides general health-related guidance
                powered by technology. It is not a replacement for professional
                medical diagnosis, treatment, or advice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                2. Medical Disclaimer
              </h2>
              <p>
                All content and recommendations are for informational purposes
                only. You should always consult a qualified medical professional
                before making health decisions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                3. User Responsibilities
              </h2>
              <p>
                You agree not to misuse the platform, submit false information,
                attempt to breach security, or use the service for unlawful
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                4. Limitation of Liability
              </h2>
              <p>
                Sehat Saathi Guide and its developers are not responsible for any
                damages, health outcomes, or losses resulting from the use of
                this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                5. Service Availability
              </h2>
              <p>
                We may modify, suspend, or discontinue any part of the platform
                at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                6. Intellectual Property
              </h2>
              <p>
                All website content, design, and code belong to Sehat Saathi
                Guide unless otherwise stated. You may not copy or reuse it
                without permission.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                7. Changes to Terms
              </h2>
              <p>
                These terms may be updated at any time. Continued use of the
                platform indicates acceptance of the latest version.
              </p>
            </section>

            <div className="pt-6">
              <Link
                to="/"
                className="text-green-700 hover:underline font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
