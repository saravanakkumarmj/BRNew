"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UserMetadata, UploadedReport } from "@/components/blood-report-analyzer"
import {
  Activity,
  User,
  Calendar,
  Mail,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  RotateCcw,
} from "lucide-react"

type ReportAnalysisProps = {
  userMetadata: UserMetadata
  report: UploadedReport
  onReset: () => void
}

// Mock blood test results
const bloodTestResults = [
  {
    name: "Hemoglobin",
    value: 14.2,
    unit: "g/dL",
    normalRange: "13.5-17.5",
    status: "normal",
  },
  {
    name: "White Blood Cells",
    value: 8.5,
    unit: "10³/µL",
    normalRange: "4.5-11.0",
    status: "normal",
  },
  {
    name: "Platelets",
    value: 245,
    unit: "10³/µL",
    normalRange: "150-400",
    status: "normal",
  },
  {
    name: "Glucose (Fasting)",
    value: 118,
    unit: "mg/dL",
    normalRange: "70-100",
    status: "high",
  },
  {
    name: "Total Cholesterol",
    value: 215,
    unit: "mg/dL",
    normalRange: "<200",
    status: "high",
  },
  {
    name: "HDL Cholesterol",
    value: 45,
    unit: "mg/dL",
    normalRange: ">40",
    status: "normal",
  },
  {
    name: "LDL Cholesterol",
    value: 145,
    unit: "mg/dL",
    normalRange: "<100",
    status: "high",
  },
  {
    name: "Triglycerides",
    value: 165,
    unit: "mg/dL",
    normalRange: "<150",
    status: "high",
  },
  {
    name: "Creatinine",
    value: 0.9,
    unit: "mg/dL",
    normalRange: "0.7-1.3",
    status: "normal",
  },
  {
    name: "ALT (SGPT)",
    value: 28,
    unit: "U/L",
    normalRange: "7-56",
    status: "normal",
  },
]

export function ReportAnalysis({ userMetadata, report, onReset }: ReportAnalysisProps) {
  const normalCount = bloodTestResults.filter((r) => r.status === "normal").length
  const abnormalCount = bloodTestResults.filter((r) => r.status !== "normal").length

  const getStatusIcon = (status: string) => {
    if (status === "normal") return <CheckCircle2 className="h-5 w-5 text-accent" />
    if (status === "high") return <TrendingUp className="h-5 w-5 text-destructive" />
    if (status === "low") return <TrendingDown className="h-5 w-5 text-destructive" />
    return <Minus className="h-5 w-5 text-muted-foreground" />
  }

  const getStatusBadge = (status: string) => {
    if (status === "normal")
      return (
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          Normal
        </Badge>
      )
    if (status === "high")
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive">
          High
        </Badge>
      )
    if (status === "low")
      return (
        <Badge variant="destructive" className="bg-destructive/10 text-destructive">
          Low
        </Badge>
      )
    return <Badge variant="outline">Unknown</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
        <p className="mt-1 text-sm text-muted-foreground">Comprehensive analysis of your blood test report</p>
      </div>

      {/* Patient Summary */}
      <Card className="border-border bg-muted/30 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
          <User className="h-5 w-5" />
          Patient Information
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{userMetadata.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-medium text-foreground">{userMetadata.age} years</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Gender</p>
              <p className="font-medium capitalize text-foreground">{userMetadata.gender}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{userMetadata.email}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-3xl font-bold text-foreground">{bloodTestResults.length}</p>
            </div>
            <FileText className="h-10 w-10 text-primary" />
          </div>
        </Card>
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Normal</p>
              <p className="text-3xl font-bold text-accent">{normalCount}</p>
            </div>
            <CheckCircle2 className="h-10 w-10 text-accent" />
          </div>
        </Card>
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Needs Attention</p>
              <p className="text-3xl font-bold text-destructive">{abnormalCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
        </Card>
      </div>

      {/* Test Results */}
      <Card className="border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Detailed Results</h3>
        <div className="space-y-3">
          {bloodTestResults.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <p className="font-medium text-foreground">{test.name}</p>
                  <p className="text-sm text-muted-foreground">Normal: {test.normalRange}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {test.value} {test.unit}
                  </p>
                </div>
                {getStatusBadge(test.status)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recommendations */}
      {abnormalCount > 0 && (
        <Card className="border-destructive/20 bg-destructive/5 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Recommendations
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 text-destructive">•</span>
              <span>
                Your glucose and cholesterol levels are elevated. Consider consulting with a healthcare provider about
                dietary modifications and lifestyle changes.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-destructive">•</span>
              <span>Increase physical activity to at least 150 minutes of moderate exercise per week.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-destructive">•</span>
              <span>Follow up with your doctor to discuss potential medication or treatment options.</span>
            </li>
          </ul>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        <Button variant="outline" onClick={onReset} className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Analyze Another Report
        </Button>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>
    </div>
  )
}
