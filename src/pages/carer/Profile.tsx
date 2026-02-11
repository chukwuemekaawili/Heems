import { useState, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Camera,
  MapPin,
  Phone,
  Mail,
  Star,
  Shield,
  GraduationCap,
  Heart,
  Clock,
  Save,
  Eye,
  Loader2,
  Trash2,
  Upload,
  Video,
  Play
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { MINIMUM_HOURLY_RATE, validateMinimumRate, calculateFees, formatCurrency } from "@/lib/fees";
import { PostcodeAddressLookup } from "@/components/shared/PostcodeAddressLookup";
import { CertificationSelect } from "@/components/carer/CertificationSelect";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";

const careSpecialisms = [
  "Personal Care",
  "Dementia Care",
  "Palliative Care",
  "Mental Health Support",
  "Learning Disabilities",
  "Physical Disabilities",
  "Elderly Care",
  "Companionship",
  "Medication Support",
  "Mobility Assistance",
  "Meal Preparation",
  "Light Housekeeping",
];

const languages = [
  "English",
  "Welsh",
  "Polish",
  "Urdu",
  "Hindi",
  "Punjabi",
  "Bengali",
  "Gujarati",
  "Arabic",
  "French",
  "Spanish",
  "Mandarin",
];

export default function CarerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile State
  const [profile, setProfile] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
    postcode: "",
    country: "UK",
    avatar_url: ""
  });

  // Carer Details State
  const [carerDetails, setCarerDetails] = useState<any>({
    experience_years: "1",
    hourly_rate: 25,
    bio: "",
    specializations: [],
    languages: ["English"],
    live_in_rate_weekly: null,
    live_in_rate_daily: null,
    overnight_sleeping_rate: null,
    overnight_waking_rate: null,
    certifications: [],
    travel_radius: 10,
    min_booking_duration: 1,
    instant_booking: true,
    emergency_availability: false,
    night_shifts: false,
    live_in_care: false,
    visiting_care: false,
    show_on_search: true,
    video_url: "",
    hobbies: "",
    has_transportation: false,
    onboarded_at: null // For promo logic
  });

  // Video Upload State
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      if (profileData) setProfile(profileData);

      // Fetch Carer Details
      const { data: carerData, error: carerError } = await supabase
        .from("carer_details")
        .select("*")
        .eq("id", user.id)
        .single();

      if (carerError && carerError.code !== "PGRST116") throw carerError;
      if (carerData) {
        setCarerDetails({
          ...carerData,
          specializations: carerData.specializations || [],
          languages: carerData.languages || ["English"],
          certifications: carerData.certifications || [],
          // Ensure other potentially null value types are handled if needed
        });
      }

    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Validate minimum hourly rate
      if (!validateMinimumRate(carerDetails.hourly_rate)) {
        toast({
          title: "Rate Below Minimum",
          description: `Your hourly rate must be at least £${MINIMUM_HOURLY_RATE}/hour as per platform policy.`,
          variant: "destructive",
        });
        setSaving(false);
        return;
      }

      // Update Profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name} ${profile.last_name}`,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          postcode: profile.postcode,
          country: profile.country,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          avatar_url: profile.avatar_url
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Upsert Carer Details
      const { error: carerError } = await supabase
        .from("carer_details")
        .upsert({
          id: user.id,
          ...carerDetails,
          live_in_rate_weekly: parseFloat(carerDetails.live_in_rate_weekly) || null,
          live_in_rate_daily: parseFloat(carerDetails.live_in_rate_daily) || null,
          overnight_sleeping_rate: parseFloat(carerDetails.overnight_sleeping_rate) || null,
          overnight_waking_rate: parseFloat(carerDetails.overnight_waking_rate) || null,
        });

      if (carerError) throw carerError;

      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      });
      setIsEditing(false);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const toggleSpecialism = (specialism: string) => {
    setCarerDetails((prev: any) => ({
      ...prev,
      specializations: prev.specializations.includes(specialism)
        ? prev.specializations.filter((s: string) => s !== specialism)
        : [...prev.specializations, specialism]
    }));
  };

  const toggleLanguage = (language: string) => {
    setCarerDetails((prev: any) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l: string) => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) { // 50MB
      toast({
        title: "File too large",
        description: "Video must be under 50MB",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingVideo(true);
      setVideoProgress(10); // Start progress

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}_intro.${fileExt}`;

      // Simulate progress
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const { error } = await supabase.storage
        .from('carer-videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(interval);
      setVideoProgress(100);

      if (error) throw error;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('carer-videos')
        .getPublicUrl(fileName);

      setCarerDetails((prev: any) => ({ ...prev, video_url: publicUrl }));

      toast({
        title: "Video Uploaded",
        description: "Your introduction video has been uploaded successfully.",
      });

    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingVideo(false);
      setTimeout(() => setVideoProgress(0), 1000);
    }
  };

  const handleRemoveVideo = () => {
    if (window.confirm("Are you sure you want to remove your video?")) {
      setCarerDetails((prev: any) => ({ ...prev, video_url: "" }));
    }
  };

  console.log("Rendering CarerProfile", { profile, carerDetails });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-[#1a9e8c]" />
      </div>
    );
  }

  // Safety check for carerDetails
  if (!carerDetails) {
    return (
      <div className="p-8 text-center text-red-500">
        Error: Carer details failed to load. Please refresh.
      </div>
    );
  }

  return (
    <ErrorBoundary name="CarerProfile">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your carer profile and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Profile
            </Button>
            <Button onClick={() => isEditing ? handleSave() : setIsEditing(true)} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                "Edit Profile"
              )}
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">
                    {profile.first_name?.[0]}{profile.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                  <Badge className="bg-emerald-500">
                    <Shield className="h-3 w-3 mr-1" />
                    {profile.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.city || 'Location not set'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-amber-500" />
                    4.9 (Demo)
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {carerDetails.experience_years} years experience
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                <p className="text-2xl font-bold text-primary">£{carerDetails.hourly_rate}/hr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="specialties">Experience</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription>Your basic contact and personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={profile.first_name || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((p: any) => ({ ...p, first_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={profile.last_name || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((p: any) => ({ ...p, last_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      value={profile.email || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((p: any) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      value={profile.phone || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((p: any) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={profile.date_of_birth || ""}
                      disabled={!isEditing}
                      onChange={(e) => setProfile((p: any) => ({ ...p, date_of_birth: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      value={profile.gender || ""}
                      disabled={!isEditing}
                      onValueChange={(val) => setProfile((p: any) => ({ ...p, gender: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address
                  </Label>
                  {isEditing ? (
                    <div className="space-y-4">
                      <PostcodeAddressLookup
                        postcode={profile.postcode || ""}
                        onPostcodeChange={(pc) => setProfile((p: any) => ({ ...p, postcode: pc }))}
                        onAddressSelect={(addr) => setProfile((p: any) => ({ ...p, address: addr }))}
                        label="Postcode"
                      />
                      <Input
                        value={profile.address || ""}
                        placeholder="Street Address"
                        onChange={(e) => setProfile((p: any) => ({ ...p, address: e.target.value }))}
                      />
                      <div className="grid md:grid-cols-2 gap-4">
                        <Input
                          value={profile.city || ""}
                          placeholder="City"
                          onChange={(e) => setProfile((p: any) => ({ ...p, city: e.target.value }))}
                        />
                        <Select
                          value={profile.country || "UK"}
                          onValueChange={(val) => setProfile((p: any) => ({ ...p, country: val }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UK">United Kingdom</SelectItem>
                            <SelectItem value="england">England</SelectItem>
                            <SelectItem value="wales">Wales</SelectItem>
                            <SelectItem value="scotland">Scotland</SelectItem>
                            <SelectItem value="ni">Northern Ireland</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Input
                        value={profile.address || ""}
                        disabled
                      />
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        <Input
                          value={profile.city || ""}
                          disabled
                          placeholder="City"
                        />
                        <Input
                          value={profile.postcode || ""}
                          disabled
                          placeholder="Postcode"
                        />
                        <Input
                          value={profile.country || "UK"}
                          disabled
                          placeholder="Country"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Languages Spoken</Label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map(lang => (
                      <Badge
                        key={lang}
                        variant={carerDetails.languages?.includes(lang) ? "default" : "outline"}
                        className={`cursor-pointer ${isEditing ? 'hover:bg-primary/80' : ''}`}
                        onClick={() => isEditing && toggleLanguage(lang)}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Professional Tab */}
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Professional Details
                </CardTitle>
                <CardDescription>Your experience and qualifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Years of Experience</Label>
                    <Select
                      value={carerDetails.experience_years?.toString() || "1"}
                      disabled={!isEditing}
                      onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, experience_years: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">6 Months - 1 Year</SelectItem>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="10">10+ years</SelectItem>
                        <SelectItem value="15">15+ years</SelectItem>
                        <SelectItem value="20">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hourly Rate (£)</Label>
                    <Input
                      type="number"
                      min={MINIMUM_HOURLY_RATE}
                      value={carerDetails.hourly_rate || 25}
                      disabled={!isEditing}
                      onChange={(e) => setCarerDetails((c: any) => ({ ...c, hourly_rate: parseFloat(e.target.value) }))}
                      className={carerDetails.hourly_rate < MINIMUM_HOURLY_RATE ? "border-red-500" : ""}
                    />
                    {carerDetails.hourly_rate < MINIMUM_HOURLY_RATE && (
                      <p className="text-xs text-red-500">Minimum rate is £{MINIMUM_HOURLY_RATE}/hour</p>
                    )}
                    <p className="text-xs text-muted-foreground">Platform minimum: £{MINIMUM_HOURLY_RATE}/hr</p>

                    {/* Fee Preview */}
                    {carerDetails.hourly_rate >= MINIMUM_HOURLY_RATE && (
                      <div className="mt-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm font-semibold">Your Earnings Preview</span>
                        </div>

                        {(() => {
                          try {
                            const fees = calculateFees(carerDetails.hourly_rate, 1, '1', carerDetails.onboarded_at);
                            const isPromo = fees.carerFeePercentage === 0;

                            return (
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Client pays:</span>
                                  <span className="font-medium">{formatCurrency(fees.subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">
                                    Platform Fee {isPromo && <Badge variant="secondary" className="ml-1 h-5 text-[10px] bg-emerald-100 text-emerald-700">PROMO: 0%</Badge>}
                                  </span>
                                  <span className={`font-medium ${isPromo ? 'text-emerald-600' : ''}`}>
                                    -{formatCurrency(fees.carerFee)}
                                  </span>
                                </div>
                                <div className="pt-2 mt-2 border-t flex justify-between">
                                  <span className="font-bold">You receive:</span>
                                  <span className="font-bold text-emerald-700">{formatCurrency(fees.carerEarnings)} / hr</span>
                                </div>
                                {isPromo && (
                                  <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    You are in your 6-month commission-free period!
                                  </p>
                                )}
                              </div>
                            );
                          } catch (e) {
                            return null;
                          }
                        })()}
                      </div>
                    )}
                  </div>

                  {/* Additional Rates */}
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <h3 className="font-semibold text-lg">Specialised Service Rates</h3>

                    {/* Live-in Rates */}
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-primary" />
                        <span className="font-medium">Live-in Care</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Weekly Rate (£)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={carerDetails.live_in_rate_weekly || ""}
                            placeholder="e.g. 1200"
                            disabled={!isEditing}
                            onChange={(e) => setCarerDetails((c: any) => ({ ...c, live_in_rate_weekly: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Daily Rate (£)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={carerDetails.live_in_rate_daily || ""}
                            placeholder="e.g. 180"
                            disabled={!isEditing}
                            onChange={(e) => setCarerDetails((c: any) => ({ ...c, live_in_rate_daily: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Overnight Rates */}
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">Overnight Care</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Sleeping Night (Flat Rate £)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={carerDetails.overnight_sleeping_rate || ""}
                            placeholder="e.g. 150"
                            disabled={!isEditing}
                            onChange={(e) => setCarerDetails((c: any) => ({ ...c, overnight_sleeping_rate: e.target.value }))}
                          />
                          <p className="text-xs text-muted-foreground">Flat rate per night (usually 10pm - 8am)</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Waking Night (Hourly Rate £)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={carerDetails.overnight_waking_rate || ""}
                            placeholder="e.g. 30"
                            disabled={!isEditing}
                            onChange={(e) => setCarerDetails((c: any) => ({ ...c, overnight_waking_rate: e.target.value }))}
                          />
                          <p className="text-xs text-muted-foreground">Hourly rate for active night support</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Professional Bio</Label>
                  <Textarea
                    className="min-h-[150px]"
                    disabled={!isEditing}
                    value={carerDetails.bio || ""}
                    onChange={(e) => setCarerDetails((c: any) => ({ ...c, bio: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Driving Status
                    </Label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{carerDetails.has_transportation ? "I can drive / have a car" : "Non-driver"}</span>
                      <Switch
                        disabled={!isEditing}
                        checked={carerDetails.has_transportation || false}
                        onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, has_transportation: val }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Hobbies & Interests</Label>
                  <Textarea
                    placeholder="E.g., Reading, Gardening, Cooking, Walking..."
                    disabled={!isEditing}
                    value={carerDetails.hobbies || ""}
                    onChange={(e) => setCarerDetails((c: any) => ({ ...c, hobbies: e.target.value }))}
                  />
                </div>

                <Label className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  Introduction Video
                  <Badge variant="outline" className="ml-2 text-xs font-normal">Highly Recommended</Badge>
                </Label>

                <div className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-6 transition-all hover:bg-muted/10">
                  {carerDetails.video_url ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-border">
                        <video
                          src={carerDetails.video_url}
                          controls
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        {isEditing && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRemoveVideo}
                            className="h-8 text-xs"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Remove Video
                          </Button>
                        )}
                        {isEditing && (
                          <div className="relative">
                            <input
                              type="file"
                              accept="video/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleVideoUpload}
                              disabled={uploadingVideo}
                            />
                            <Button variant="outline" size="sm" className="h-8 text-xs">
                              <Upload className="w-3.5 h-3.5 mr-1.5" />
                              Replace Video
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Video className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">Upload an Introduction Video</p>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Introduce yourself to potential clients. Keep it short (1-2 mins), friendly, and professional.
                        </p>
                      </div>

                      {uploadingVideo ? (
                        <div className="w-full max-w-xs space-y-2">
                          <Progress value={videoProgress} className="h-2" />
                          <p className="text-xs text-center text-muted-foreground">Uploading... {videoProgress}%</p>
                        </div>
                      ) : (
                        isEditing && (
                          <div className="relative">
                            <input
                              type="file"
                              accept="video/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleVideoUpload}
                            />
                            <Button>
                              <Upload className="w-4 h-4 mr-2" />
                              Select Video File
                            </Button>
                          </div>
                        )
                      )}
                      <p className="text-xs text-muted-foreground">MP4, WebM up to 50MB</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Qualifications & Training</Label>
                  <CertificationSelect
                    selected={carerDetails.certifications || []}
                    onChange={(certs) => setCarerDetails((c: any) => ({ ...c, certifications: certs }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Specialties Tab */}
          <TabsContent value="specialties">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Experience
                </CardTitle>
                <CardDescription>Select the types of care you can provide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {careSpecialisms.map(specialism => (
                    <div
                      key={specialism}
                      className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${carerDetails.specializations?.includes(specialism)
                        ? "border-primary bg-primary/5"
                        : "hover:bg-accent/50"
                        } ${!isEditing && 'cursor-default'}`}
                      onClick={() => isEditing && toggleSpecialism(specialism)}
                    >
                      <Checkbox
                        checked={carerDetails.specializations?.includes(specialism)}
                        disabled={!isEditing}
                      />
                      <Label className="cursor-pointer">{specialism}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Work Preferences
                </CardTitle>
                <CardDescription>Configure your availability and work preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Instant Booking</p>
                      <p className="text-sm text-muted-foreground">Allow clients to book without approval</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.instant_booking || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, instant_booking: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Emergency Availability</p>
                      <p className="text-sm text-muted-foreground">Accept short-notice bookings (within 24 hours)</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.emergency_availability || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, emergency_availability: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Night Shifts</p>
                      <p className="text-sm text-muted-foreground">Available for overnight care (10pm - 6am)</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.night_shifts || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, night_shifts: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Visiting Care</p>
                      <p className="text-sm text-muted-foreground">Available for home visits (hourly)</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.visiting_care || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, visiting_care: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Live-in Care</p>
                      <p className="text-sm text-muted-foreground">Available for live-in care arrangements</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.live_in_care || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, live_in_care: val }))}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <p className="font-medium">Show on Search</p>
                      <p className="text-sm text-muted-foreground">Appear in carer search results</p>
                    </div>
                    <Switch
                      disabled={!isEditing}
                      checked={carerDetails.show_on_search || false}
                      onCheckedChange={(val) => setCarerDetails((c: any) => ({ ...c, show_on_search: val }))}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Travel Radius</Label>
                    <Select
                      value={carerDetails.travel_radius?.toString() || "10"}
                      disabled={!isEditing}
                      onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, travel_radius: parseInt(val) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 miles</SelectItem>
                        <SelectItem value="10">10 miles</SelectItem>
                        <SelectItem value="15">15 miles</SelectItem>
                        <SelectItem value="20">20 miles</SelectItem>
                        <SelectItem value="30">30 miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Minimum Booking Duration</Label>
                    <Select
                      value={carerDetails.min_booking_duration?.toString() || "2"}
                      disabled={!isEditing}
                      onValueChange={(val) => setCarerDetails((c: any) => ({ ...c, min_booking_duration: parseInt(val) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="2">2 hours</SelectItem>
                        <SelectItem value="3">3 hours</SelectItem>
                        <SelectItem value="4">4 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  );
}
