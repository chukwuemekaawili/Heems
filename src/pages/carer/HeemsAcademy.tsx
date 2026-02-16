
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, ExternalLink, BookOpen, Award } from "lucide-react";

export default function HeemsAcademy() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Heems Academy
                </h1>
                <p className="text-muted-foreground">Access world-class training and certification from our trusted partners.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Florence Academy</CardTitle>
                        <CardDescription>CPD-accredited training for social care.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Free online courses covering essential care skills, safeguarding, and more.
                        </p>
                        <Button className="w-full" asChild>
                            <a href="https://www.florence.co.uk/academy" target="_blank" rel="noopener noreferrer">
                                Visit Florence Academy <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills for Care</CardTitle>
                        <CardDescription>Workforce development and qualifications.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Comprehensive resources and standards for adult social care in England.
                        </p>
                        <Button className="w-full" asChild>
                            <a href="https://www.skillsforcare.org.uk" target="_blank" rel="noopener noreferrer">
                                Visit Skills for Care <ExternalLink className="w-4 h-4 ml-2" />
                            </a>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
