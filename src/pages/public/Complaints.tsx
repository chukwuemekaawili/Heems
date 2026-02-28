import LegalPageLayout from "@/components/layouts/LegalPageLayout";
import { Link } from "react-router-dom";

const Complaints = () => {
    return (
        <LegalPageLayout
            title="Complaints Policy"
            subtitle="We take all complaints seriously and have established a clear, fair process for resolving concerns."
            lastUpdated="January 2026"
        >
            <p className="lead">
                At Heems, we are committed to providing a safe, transparent, and supportive platform for all users. We take all complaints seriously and have established a clear process for reporting and resolving concerns.
            </p>

            <h2>Step 1: Initial Reporting</h2>
            <ul>
                <li>Any concerns or complaints relating to discrimination, unfair treatment, or exclusion should be raised through Heems' appropriate reporting channels.</li>
                <li>For safeguarding concerns involving immediate risk of harm, users should contact emergency services first.</li>
            </ul>

            <h2>Step 2: Review and Investigation</h2>
            <ul>
                <li>Heems will review all reported concerns promptly and impartially.</li>
                <li>The review will be conducted in accordance with applicable legislation and internal procedures.</li>
            </ul>

            <h2>Step 3: Resolution and Action</h2>
            <ul>
                <li>Where appropriate, Heems will take action to address breaches of policy.</li>
                <li>This may include the restriction or removal of access to the platform for the individuals involved.</li>
            </ul>

            <h2>Step 4: External Escalation (Privacy only)</h2>
            <ul>
                <li>If a complaint relates specifically to personal data handling and remains unresolved, individuals have the right to lodge a complaint with the Information Commissioner's Office (ICO).</li>
            </ul>

            <p>
                You can get in touch with our team directly via <Link to="/contact" className="text-[#1a9e8c] font-bold hover:underline">Contact Support</Link> or use the reporting tools available within the dashboard.
            </p>
        </LegalPageLayout>
    );
};

export default Complaints;
