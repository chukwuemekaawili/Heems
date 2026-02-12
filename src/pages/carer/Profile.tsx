// Enhanced Carer Profile with Rate Validation (PRD v2.3.2 Compliant)
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Info,
  Moon,
  Home,
  Loader2
} from "lucide-react";
import { MINIMUM_HOURLY_RATE, validateMinimumRate, calculateFees, formatCurrency } from "@/lib/fees";
import type { PricingPhase } from "@/types/database";

export default function CarerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Profile Data
  const [profileData, setProfileData] = useState<any>(null);

  // Rate States
  const [hourlyRate, setHourlyRate] = useState(25);
  const [liveInWeekly, setLiveInWeekly] = useState(1200);
  const [liveInDaily, setLiveInDaily] = useState(180);
  const [overnightSleeping, setOvernightSleeping] = useState(150);
  const [overnightWaking, setOvernightWaking] = useState(20);
  const [rateError, setRateError] = useState("");

  const currentPhase: PricingPhase = '1'; // TODO: Fetch from system_config

  useEffect(() => {
    fetchCarerData();
  }, []);

  const fetchCarerData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // Fetch Profile and Carer Details
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
                    *,
                    carer_details(*)
                `)
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      if (profile) {
        setProfileData(profile);
        if (profile.carer_details) {
          // Load rates from DB
          setHourlyRate(profile.carer_details.hourly_rate || 25);
          setLiveInWeekly(profile.carer_details.live_in_rate_weekly || 1200);
          setLiveInDaily(profile.carer_details.live_in_rate_daily || 180);
          setOvernightSleeping(profile.carer_details.overnight_sleeping_rate || 150);
          setOvernightWaking(profile.carer_details.overnight_waking_rate || 20);
        }
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: "Could not load your profile data. Please try refresh.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateMinimumRate(hourlyRate)) {
      setRateError(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour`);
      return;
    }

    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Update Carer Details
      const { error } = await supabase
        .from('carer_details')
        .update({
          hourly_rate: hourlyRate,
          live_in_rate_weekly: liveInWeekly,
          live_in_rate_daily: liveInDaily,
          overnight_sleeping_rate: overnightSleeping,
          overnight_waking_rate: overnightWaking
        })
        .eq('id', user.id);

      if (error) throw error;

      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your rates have been successfully saved.",
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Save Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRateChange = (value: string) => {
    const rate = parseFloat(value);
    setHourlyRate(rate);

    if (isNaN(rate)) {
      setRateError("Please enter a valid number");
      return;
    }

    if (!validateMinimumRate(rate)) {
      setRateError(`Rate must be at least £${MINIMUM_HOURLY_RATE}/hour (PRD v2.3.2 requirement)`);
    } else {
      setRateError("");
    }
  };

  const getFeePreview = () => {
    if (!hourlyRate || hourlyRate < MINIMUM_HOURLY_RATE) return null;

    try {
      const fees = calculateFees(hourlyRate, 1, currentPhase);
      return fees;
    } catch {
      return null;
    }
  };

  const feePreview = getFeePreview();
  const isRateValid = validateMinimumRate(hourlyRate);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your carer profile and rate settings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Profile
          </Button>
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!isRateValid || saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profileData?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profileData?.full_name?.substring(0, 2).toUpperCase() || 'CH'}
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
                <h2 className="text-2xl font-bold">{profileData?.full_name || 'Carer Profile'}</h2>
                <Badge className="bg-emerald-500">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profileData?.address || 'Location not set'}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-500" />
                  4.9 (127 reviews)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {profileData?.carer_details?.years_experience || 0} years experience
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate Configuration Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Hourly Rate Configuration
          </CardTitle>
          <CardDescription>Set your hourly rate (minimum £{MINIMUM_HOURLY_RATE}/hour required)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rate Input */}
          <div className="space-y-2">
            <Label htmlFor="hourly-rate">Hourly Rate (£)</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">£</span>
              <Input
                id="hourly-rate"
                type="number"
                min={MINIMUM_HOURLY_RATE}
                step="0.50"
                value={hourlyRate}
                onChange={(e) => handleRateChange(e.target.value)}
                disabled={!isEditing}
                className={`pl-8 text-lg font-bold ${rateError ? 'border-red-500' : isRateValid ? 'border-green-500' : ''}`}
              />
              {isRateValid && (
                <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-green-500" />
              )}
            </div>
            {rateError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {rateError}
              </p>
            )}
          </div>

          {/* Minimum Rate Alert */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>PRD v2.3.2 Requirement:</strong> All carers must set a minimum rate of £{MINIMUM_HOURLY_RATE}/hour. This ensures fair compensation and platform compliance.
            </AlertDescription>
          </Alert>

          {/* Fee Preview */}
          {feePreview && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1a9e8c] text-white space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Earnings Preview (Phase {currentPhase})
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Your Rate</span>
                  <span className="font-bold">{formatCurrency(feePreview.baseRate)}/hour</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/70">Platform Fee ({(feePreview.carerFeePercentage * 100).toFixed(0)}%)</span>
                  <span className="font-bold">-{formatCurrency(feePreview.carerFee)}</span>
                </div>

                <div className="h-px bg-white/10" />

                <div className="flex justify-between items-center">
                  <span className="font-semibold">You Receive (per hour)</span>
                  <span className="text-xl font-black">{formatCurrency(feePreview.carerEarnings)}</span>
                </div>
              </div>

              <div className="text-xs text-white/60 mt-3 p-3 bg-white/5 rounded-lg">
                <strong>Example:</strong> For a 2-hour booking, client pays {formatCurrency(feePreview.clientTotal * 2)}, you receive {formatCurrency(feePreview.carerEarnings * 2)}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Specialized Rates Card */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Specialized Care Rates
          </CardTitle>
          <CardDescription>Set your rates for live-in and overnight care</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Home className="h-4 w-4" /> Live-in Care
              </h3>
              <div className="space-y-2">
                <Label>Weekly Rate (£)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">£</span>
                  <Input
                    type="number"
                    value={liveInWeekly}
                    onChange={(e) => setLiveInWeekly(Number(e.target.value))}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Daily Rate (£)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">£</span>
                  <Input
                    type="number"
                    value={liveInDaily}
                    onChange={(e) => setLiveInDaily(Number(e.target.value))}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Moon className="h-4 w-4" /> Overnight Care
              </h3>
              <div className="space-y-2">
                <Label>Sleeping Night (Flat Rate £)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">£</span>
                  <Input
                    type="number"
                    value={overnightSleeping}
                    onChange={(e) => setOvernightSleeping(Number(e.target.value))}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Waking Night (Hourly Rate £)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">£</span>
                  <Input
                    type="number"
                    value={overnightWaking}
                    onChange={(e) => setOvernightWaking(Number(e.target.value))}
                    disabled={!isEditing}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Details Card */}
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
              <Input type="number" defaultValue={profileData?.carer_details?.years_experience || 0} disabled={!isEditing} />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input defaultValue={profileData?.full_name || ''} disabled={!isEditing} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Professional Bio</Label>
            <Textarea
              className="min-h-[150px]"
              disabled={!isEditing}
              defaultValue={profileData?.carer_details?.bio || ''}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </Label>
            <Input type="email" defaultValue={profileData?.email || 'email@example.com'} disabled={!isEditing} readOnly />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number
            </Label>
            <Input type="tel" defaultValue={profileData?.phone || ''} disabled={!isEditing} />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input defaultValue={profileData?.address || ''} disabled={!isEditing} />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Notice */}
      <Alert className="border-amber-500 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-900">
          <strong>Important:</strong> Your profile will only appear in marketplace search results if your rate is at least £{MINIMUM_HOURLY_RATE}/hour and your verification status is "verified". This ensures compliance with PRD v2.3.2 requirements.
        </AlertDescription>
      </Alert>
    </div>
  );
}
