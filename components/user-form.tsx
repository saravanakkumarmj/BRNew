"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Loader2, AlertCircle, FileText } from "lucide-react"
import type { AnalysisResult } from "./blood-report-analyzer"

type UserFormProps = {
  onAnalysisComplete: (result: AnalysisResult) => void
}

function parseLangflowResponse(apiResponse: any): any {
  console.log("[v0] Parsing Langflow API response")

  try {
    // Navigate to the text content in the nested structure
    const textContent = apiResponse?.outputs?.[0]?.outputs?.[0]?.results?.text?.text

    if (!textContent) {
      throw new Error("Could not find text content in API response")
    }

    console.log("[v0] Found text content, extracting JSON")

    // Remove markdown code block wrapper (\`\`\`json and \`\`\`)
    let jsonString = textContent.trim()

    // Remove \`\`\`json from the start
    if (jsonString.startsWith("```json")) {
      jsonString = jsonString.substring(7)
    } else if (jsonString.startsWith("```")) {
      jsonString = jsonString.substring(3)
    }

    // Remove \`\`\` from the end
    if (jsonString.endsWith("```")) {
      jsonString = jsonString.substring(0, jsonString.length - 3)
    }

    jsonString = jsonString.trim()

    console.log("[v0] Parsing extracted JSON string")
    const parsedData = JSON.parse(jsonString)

    console.log("[v0] Successfully parsed Langflow response")
    return parsedData
  } catch (error) {
    console.error("[v0] Error parsing Langflow response:", error)
    throw new Error("Failed to parse API response")
  }
}

const MOCK_API_RESPONSE = {
  blood_report_interpretation: {
    summary:
      "The patient's blood report indicates generally stable health, with a few areas of concern related to lipid levels and bilirubin. Monitoring and lifestyle adjustments are recommended.",
    key_findings: [
      {
        test_name: "glucose",
        value: "92 mg/dl",
        status: "normal",
        description: "Glucose level is within the normal range.",
      },
      {
        test_name: "bun",
        value: "12 mg/dl",
        status: "normal",
        description: "Blood urea nitrogen level is within the normal range.",
      },
      {
        test_name: "creatinine",
        value: "0.81 mg/dl",
        status: "normal",
        description: "Creatinine level is within the normal range, indicating good kidney function.",
      },
      {
        test_name: "egfr",
        value: "111 ml/min/1.73",
        status: "normal",
        description:
          "Estimated glomerular filtration rate is above the normal threshold, indicating healthy kidney function.",
      },
      {
        test_name: "bilirubin",
        value: "1.4 mg/dl",
        status: "high",
        description: "Bilirubin level is slightly elevated, which may indicate liver function issues or hemolysis.",
      },
      {
        test_name: "cholesterol",
        value: "223 mg/dl",
        status: "high",
        description: "Total cholesterol level is elevated, which may increase cardiovascular risk.",
      },
      {
        test_name: "ldl",
        value: "154 mg/dl",
        status: "high",
        description: "LDL cholesterol level is significantly elevated, indicating a higher risk for heart disease.",
      },
      {
        test_name: "hemoglobin a1c",
        value: "5.5%",
        status: "normal",
        description: "Hemoglobin A1c level is within the normal range, indicating good blood sugar control.",
      },
    ],
  },
  abnormal_findings: [
    {
      test_name: "bilirubin",
      current_value: "1.4 mg/dl",
      reference_range: "0.0-1.2 mg/dl",
      significance: "Slightly elevated, may indicate liver function issues.",
    },
    {
      test_name: "cholesterol",
      current_value: "223 mg/dl",
      reference_range: "100-199 mg/dl",
      significance: "Elevated, may increase cardiovascular risk.",
    },
    {
      test_name: "ldl",
      current_value: "154 mg/dl",
      reference_range: "0-99 mg/dl",
      significance: "Significantly elevated, indicating higher risk for heart disease.",
    },
  ],
  recommended_supplements: [
    {
      name: "Omega-3 Fish Oil",
      dosage: "1000 mg daily",
      rationale: "May help lower LDL cholesterol and improve heart health.",
    },
    {
      name: "Milk Thistle",
      dosage: "150 mg twice daily",
      rationale: "May support liver health and help manage bilirubin levels.",
    },
  ],
  lifestyle_recommendations: {
    diet: {
      title: "Dietary Suggestions",
      items: [
        "Increase intake of fruits and vegetables.",
        "Limit saturated fats and trans fats.",
        "Incorporate whole grains and lean proteins.",
        "Reduce sugar and refined carbohydrate consumption.",
      ],
    },
    exercise: {
      title: "Exercise Recommendations",
      items: [
        "Aim for at least 150 minutes of moderate aerobic activity per week.",
        "Include strength training exercises at least twice a week.",
        "Consider activities like walking, cycling, or swimming.",
      ],
    },
    stress_management: {
      title: "Stress Management Techniques",
      description: "Practice mindfulness, meditation, or yoga to reduce stress levels.",
    },
    sleep: {
      title: "Sleep Hygiene Tips",
      items: [
        "Aim for 7-9 hours of quality sleep each night.",
        "Establish a regular sleep schedule.",
        "Create a restful environment free from distractions.",
      ],
    },
  },
  important_disclaimer:
    "This report is for informational purposes only and should not be used as a substitute for professional medical advice. Please consult your healthcare provider for personalized recommendations.",
}

export function UserForm({ onAnalysisComplete }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    healthGoal: "",
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
      setError(null)
    } else {
      setError("Please select a valid PDF file")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!uploadedFile) {
      setError("Please upload your blood test report")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setAnalysisStep("Preparing analysis...")

    try {
      console.log("[v0] Making real API call to Langflow")

      try {
        // Bypass upload and directly call analysis API with file path
        setAnalysisStep("Running AI analysis...")
        const analysisPayload = {
          output_type: "text",
          input_type: "text",
          input_value: `/Users/saravanakkumar/Downloads/BR1.pdf`, // Direct file path
          session_id: `session-${Date.now()}`,
        }

        console.log("[v0] Running analysis with file content directly")

        const analysisResponse = await fetch(
          "/api/langflow-proxy?action=analyze&flowId=5c1a9317-33be-49de-88b9-f063edefc713",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(analysisPayload),
          },
        )

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json().catch(() => ({ error: "Analysis failed" }))
          console.error("[v0] Analysis error details:", errorData)

          const errorMessage = errorData.error || errorData.message || ""
          console.log("[v0] Error message to check:", errorMessage)

          throw new Error(errorData.error || errorData.message || "Failed to analyze report")
        }

        const result = await analysisResponse.json()
        console.log("[v0] Langflow analysis response:", JSON.stringify(result, null, 2))

        // Parse the Langflow response using the proper extraction method
        setAnalysisStep("Processing results...")
        const analysisData = parseLangflowResponse(result)
        console.log("[v0] Real API analysis completed successfully")

        const analysisResult: AnalysisResult = {
          userMetadata: {
            fullName: formData.name,
            age: formData.age,
            healthGoal: formData.healthGoal,
          },
          summary: analysisData.blood_report_interpretation?.summary || "Analysis completed successfully.",
          keyFindings: (analysisData.blood_report_interpretation?.key_findings || []).map((finding: any) => ({
            test_name: finding.test_name || "Unknown Test",
            value: finding.value || "N/A",
            status: finding.status || "unknown",
            description: finding.description || "No description available",
          })),
          abnormalFindings: (analysisData.abnormal_findings || []).map((finding: any) => ({
            test_name: finding.test_name || "Unknown Test",
            current_value: finding.current_value || "N/A",
            reference_range: finding.reference_range || "N/A",
            significance: finding.significance || "No significance data available",
          })),
          recommendedSupplements: (analysisData.recommended_supplements || []).map((supplement: any) => ({
            name: supplement.name || "Unknown Supplement",
            dosage: supplement.dosage || "Consult healthcare provider",
            rationale: supplement.rationale || "No rationale provided",
          })),
          lifestyleRecommendations: {
            diet: analysisData.lifestyle_recommendations?.diet || {
              items: [],
              description: "No diet recommendations available",
            },
            exercise: analysisData.lifestyle_recommendations?.exercise || {
              items: [],
              description: "No exercise recommendations available",
            },
            stress_management: analysisData.lifestyle_recommendations?.stress_management || {
              items: [],
              description: "No stress management recommendations available",
            },
            sleep: analysisData.lifestyle_recommendations?.sleep || {
              items: [],
              description: "No sleep recommendations available",
            },
          },
          disclaimer:
            analysisData.important_disclaimer ||
            "Please consult with your healthcare provider for personalized medical advice.",
          rawAnalysis: JSON.stringify(analysisData, null, 2),
        }

        onAnalysisComplete(analysisResult)
      } catch (apiError) {
        console.error("[v0] API call failed:", apiError)
        throw apiError
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again."
      console.error("[v0] Error during analysis:", error)

      // Handle encoding errors with proper error message
      if (errorMessage.includes("utf-8 codec can't decode") || errorMessage.includes("invalid continuation byte")) {
        setError(
          "The PDF file contains characters that cannot be processed by the analysis system. Please try with a different PDF file that contains only standard text characters.",
        )
      } else if (errorMessage.includes("Analysis failed")) {
        setError("Analysis failed. Please check your Langflow flow configuration and try again.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="border-border bg-card shadow-2xl p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Blood Report Analysis</h2>
          <p className="text-muted-foreground">Enter your details and upload your report for AI-powered analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="age" className="text-sm font-medium text-foreground">
                Age
              </Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="Enter your age"
                required
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="healthGoal" className="text-sm font-medium text-foreground">
                Health Goal
              </Label>
              <Textarea
                id="healthGoal"
                value={formData.healthGoal}
                onChange={(e) => setFormData({ ...formData, healthGoal: e.target.value })}
                placeholder="Describe your health goals (e.g., improve energy, manage weight, etc.)"
                required
                className="mt-1.5 min-h-[100px]"
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Blood Test Report (PDF)</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3 text-foreground">
                  <FileText className="h-8 w-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-foreground font-medium">Click to upload your blood test report</p>
                  <p className="text-sm text-muted-foreground">PDF format only</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg p-4 bg-destructive/10 border border-destructive/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive/80 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" disabled={isAnalyzing} className="w-full h-12 text-base">
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {analysisStep || "Analyzing Report..."}
              </>
            ) : (
              "Analyze Blood Report"
            )}
          </Button>
        </form>
      </div>
    </Card>
  )
}
