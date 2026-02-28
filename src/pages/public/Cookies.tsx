import LegalPageLayout from "@/components/layouts/LegalPageLayout";

const Cookies = () => {
    return (
        <LegalPageLayout
            title="Cookie Policy"
            subtitle="We use cookies to make our platform work better for you."
            lastUpdated="January 2026"
        >
            <h2>What Are Cookies?</h2>
            <p>
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
            </p>

            <h2>How We Use Cookies</h2>
            <p>Heems uses cookies for several reasons:</p>
            <ul>
                <li><strong>Essential Cookies:</strong> These are necessary for the platform to function properly. They enable core features like secure login, session management, and load balancing. Without these, the site cannot perform as intended.</li>
                <li><strong>Analytical Cookies:</strong> We use these to understand how visitors interact with our platform. They help us track performance, identify issues, and improve the overall user experience. This data is aggregated and anonymous.</li>
                <li><strong>Functional Cookies:</strong> These allow the platform to remember choices you make (such as your language or region) and provide enhanced, more personal features.</li>
            </ul>

            <h2>Managing Your Preferences</h2>
            <p>
                Most web browsers allow you to control cookies through their settings. You can set your browser to block cookies or alert you when a cookie is being sent. However, please note that if you disable essential cookies, some parts of the Heems platform may not function correctly.
            </p>

            <h2>Third-Party Cookies</h2>
            <p>
                We may also use third-party cookies provided by trusted partners (such as Stripe for payments or Google Analytics for performance tracking). These third parties may use cookies to gather information about your activities on our platform for their own purposes.
            </p>

            <h2>Updates to This Policy</h2>
            <p>
                We may update our Cookie Policy from time to time to reflect changes in our practices or for legal and regulatory reasons. We encourage you to review this page periodically for the latest information on our use of cookies.
            </p>
        </LegalPageLayout>
    );
};

export default Cookies;
