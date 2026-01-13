import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    Eye,
    FileText,
    CheckCircle2,
    Clock,
    Filter
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const initialPosts = [
    {
        id: 1,
        title: "The Future of Specialist Care in the UK",
        author: "Sarah Jameson",
        category: "Industry Insights",
        status: "Published",
        date: "2026-01-10",
        views: 1240
    },
    {
        id: 2,
        title: "5 Things to Look for in a Specialist Carer",
        author: "Marcus Thorne",
        category: "Family Guide",
        status: "Published",
        date: "2026-01-08",
        views: 856
    },
    {
        id: 3,
        title: "New Safety Protocols for 2026",
        author: "James Heems",
        category: "Safety",
        status: "Draft",
        date: "2026-01-12",
        views: 0
    }
];

const AdminBlogManagement = () => {
    const [posts, setPosts] = useState(initialPosts);
    const { toast } = useToast();

    const handleDelete = (id: number) => {
        setPosts(posts.filter(p => p.id !== id));
        toast({
            title: "Post Deleted",
            description: "The blog post has been successfully removed.",
            variant: "destructive"
        });
    };

    return (
        <DashboardLayout role="admin">
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-[#111827]">Blog Management</h1>
                        <p className="text-slate-500 font-medium tracking-tight">Manage your platform's thought leadership and insights.</p>
                    </div>
                    <Button className="bg-[#1a9e8c] hover:bg-[#15806c] text-white rounded-xl font-bold h-11 px-6 shadow-xl shadow-[#1a9e8c]/20 flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Post
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Total Posts", value: "24", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
                        { label: "Published", value: "18", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
                        { label: "Drafts", value: "6", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                        { label: "Total Views", value: "12.4K", icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
                    ].map((stat, i) => (
                        <Card key={i} className="border-black/5 rounded-3xl overflow-hidden shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center shrink-0`}>
                                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                                        <p className="text-2xl font-black text-[#111827] leading-none">{stat.value}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Main Content */}
                <Card className="border-black/5 rounded-[2.5rem] shadow-none overflow-hidden">
                    <CardHeader className="border-b border-black/5 p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-xl font-black">Platform Insights</CardTitle>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input placeholder="Search posts..." className="pl-10 h-10 w-full md:w-64 bg-slate-50 border-black/5 rounded-xl text-sm" />
                                </div>
                                <Button variant="outline" className="h-10 border-black/5 rounded-xl font-bold text-xs flex items-center gap-2">
                                    <Filter className="h-3.5 w-3.5" />
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-black/5">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Post Details</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Views</th>
                                        <th className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5">
                                    {posts.map((post) => (
                                        <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-[#111827] flex items-center justify-center shrink-0">
                                                        <FileText className="h-6 w-6 text-[#1a9e8c]" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#111827] group-hover:text-[#1a9e8c] transition-colors line-clamp-1">{post.title}</p>
                                                        <p className="text-xs text-slate-400 font-medium">By {post.author} • {post.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant="outline" className="border-black/5 text-slate-500 font-bold px-3 py-1 rounded-full uppercase text-[9px] tracking-widest">{post.category}</Badge>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`h-1.5 w-1.5 rounded-full ${post.status === "Published" ? "bg-emerald-500" : "bg-amber-500"}`} />
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{post.status}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-3.5 w-3.5 text-slate-300" />
                                                    <span className="text-sm font-bold text-[#111827]">{post.views.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-[#111827] hover:text-white transition-all">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit Post
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View Preview
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="flex items-center gap-2 text-destructive focus:text-destructive"
                                                            onClick={() => handleDelete(post.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete Post
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AdminBlogManagement;
