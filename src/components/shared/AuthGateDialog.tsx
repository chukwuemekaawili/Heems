import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

interface AuthGateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    actionName?: string;
}

export function AuthGateDialog({ open, onOpenChange, actionName = "continue" }: AuthGateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                        <Lock className="w-10 h-10 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-bold">Register to get started</DialogTitle>
                    <DialogDescription className="text-base mt-2">
                        You must be logged in to {actionName}. Create an account or log in to connect with trusted carers.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 mt-6">
                    <Link to="/signup">
                        <Button className="w-full text-lg h-12">Create an Account</Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="outline" className="w-full text-lg h-12 bg-white">Log In</Button>
                    </Link>
                </div>
            </DialogContent>
        </Dialog>
    );
}
