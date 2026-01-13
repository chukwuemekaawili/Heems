import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
    redirectTo?: string;
}

/**
 * RoleGuard - Protects routes based on user role
 * 
 * Usage:
 * <RoleGuard allowedRoles={['admin']}>
 *   <AdminDashboard />
 * </RoleGuard>
 */
export default function RoleGuard({ children, allowedRoles, redirectTo }: RoleGuardProps) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    useEffect(() => {
        checkAuthorization();
    }, [location.pathname]);

    const checkAuthorization = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate("/login", { state: { from: location.pathname } });
                return;
            }

            // Fetch user's role from profiles
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (error || !profile) {
                toast({
                    title: "Authorization Error",
                    description: "Could not verify your access permissions.",
                    variant: "destructive",
                });
                navigate("/login");
                return;
            }

            const userRole = profile.role;

            if (!allowedRoles.includes(userRole)) {
                toast({
                    title: "Access Denied",
                    description: `This area is restricted to ${allowedRoles.join(', ')} users.`,
                    variant: "destructive",
                });

                // Redirect to appropriate dashboard based on actual role
                const roleRedirects: Record<string, string> = {
                    client: "/client/dashboard",
                    carer: "/carer/dashboard",
                    organisation: "/organisation/dashboard",
                    admin: "/admin/dashboard",
                };

                navigate(redirectTo || roleRedirects[userRole] || "/");
                return;
            }

            setAuthorized(true);
        } catch (error) {
            console.error("Auth check error:", error);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!authorized) {
        return null;
    }

    return <>{children}</>;
}

/**
 * useRoleCheck - Hook to check user role
 */
export function useRoleCheck() {
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkRole = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                setRole(profile?.role || null);
            } catch (error) {
                console.error("Role check error:", error);
            } finally {
                setLoading(false);
            }
        };

        checkRole();
    }, []);

    const redirectToDashboard = () => {
        const roleRedirects: Record<string, string> = {
            client: "/client/dashboard",
            carer: "/carer/dashboard",
            organisation: "/organisation/dashboard",
            admin: "/admin/dashboard",
        };

        if (role) {
            navigate(roleRedirects[role] || "/");
        }
    };

    return { role, loading, redirectToDashboard };
}
