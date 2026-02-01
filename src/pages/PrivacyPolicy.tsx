import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl border border-green-100 rounded-2xl p-10 shadow-2xl">
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500 mb-10">
            Last updated: January 2026
          </p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              Sehat Saathi Guide respects your privacy and is committed to
              protecting your personal information. This Privacy Policy
              explains how we collect, use, store, and protect information
              when you use our website and services.
            </p>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                1. Information We Collect
              </h2>
              <p>
                We may collect limited personal and non-personal information
                when you interact with our platform. This includes:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Basic contact information (if you choose to provide it)</li>
                <li>Health-related queries entered into the website</li>
                <li>Device, browser, and usage data</li>
              </ul>
              <p className="mt-2">
                We do not require users to create accounts or provide sensitive
                personal details to use Sehat Saathi Guide.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                2. How Your Data Is Used
              </h2>
              <p>
                Collected information is used solely to:
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Provide health guidance and responses</li>
                <li>Improve system accuracy and performance</li>
                <li>Maintain security and prevent misuse</li>
              </ul>
              <p className="mt-2">
                We do not sell, rent, or trade your personal data to any third
                party.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                3. Data Security
              </h2>
              <p>
                We use standard security practices to protect your information.
                However, no digital platform can guarantee absolute security,
                and you use the website at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                4. Third-Party Services
              </h2>
              <p>
                Our website may use third-party APIs and hosting services to
                function properly. These services may process limited technical
                data as required to provide their functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                5. Your Rights
              </h2>
              <p>
                You have the right to request access, correction, or deletion of
                any personal data you have provided. You may stop using the
                website at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                6. Policy Updates
              </h2>
              <p>
                This policy may be updated to reflect improvements or legal
                requirements. Continued use of the website indicates acceptance
                of the updated policy.
              </p>
            </section>

            <p className="text-sm text-gray-500 mt-10">
              If you have any privacy concerns, please contact the Sehat Saathi
              Guide development team.
            </p>

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
