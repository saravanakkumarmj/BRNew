"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserMetadata } from "@/components/blood-report-analyzer"
import { User, Mail, Phone, Calendar, Pill, AlertCircle } from "lucide-react"

type UserMetadataFormProps = {
  onSubmit: (data: UserMetadata) => void
}

export function UserMetadataForm({ onSubmit }: UserMetadataFormProps) {
  const [formData, setFormData] = useState<UserMetadata>({
    fullName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const updateField = (field: keyof UserMetadata, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Patient Information</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Please provide your personal and medical information for accurate analysis
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-2 text-foreground">
            <User className="h-4 w-4" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="John Doe"
            className="bg-background"
          />
        </div>

        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4" />
            Age *
          </Label>
          <Input
            id="age"
            type="number"
            required
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
            placeholder="35"
            min="1"
            max="120"
            className="bg-background"
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-foreground">
            Gender *
          </Label>
          <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
            <SelectTrigger id="gender" className="bg-background">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-2 text-foreground">
            <Mail className="h-4 w-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            placeholder="john@example.com"
            className="bg-background"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="phone" className="flex items-center gap-2 text-foreground">
            <Phone className="h-4 w-4" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="bg-background"
          />
        </div>

        {/* Medical History */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="medicalHistory" className="flex items-center gap-2 text-foreground">
            <AlertCircle className="h-4 w-4" />
            Medical History
          </Label>
          <Textarea
            id="medicalHistory"
            value={formData.medicalHistory}
            onChange={(e) => updateField("medicalHistory", e.target.value)}
            placeholder="Any chronic conditions, past surgeries, or relevant medical history..."
            rows={3}
            className="bg-background resize-none"
          />
        </div>

        {/* Current Medications */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="currentMedications" className="flex items-center gap-2 text-foreground">
            <Pill className="h-4 w-4" />
            Current Medications
          </Label>
          <Textarea
            id="currentMedications"
            value={formData.currentMedications}
            onChange={(e) => updateField("currentMedications", e.target.value)}
            placeholder="List any medications you are currently taking..."
            rows={3}
            className="bg-background resize-none"
          />
        </div>

        {/* Allergies */}
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="allergies" className="flex items-center gap-2 text-foreground">
            <AlertCircle className="h-4 w-4" />
            Known Allergies
          </Label>
          <Textarea
            id="allergies"
            value={formData.allergies}
            onChange={(e) => updateField("allergies", e.target.value)}
            placeholder="List any known allergies (medications, food, environmental)..."
            rows={2}
            className="bg-background resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" size="lg" className="min-w-[200px]">
          Continue to Upload
        </Button>
      </div>
    </form>
  )
}
