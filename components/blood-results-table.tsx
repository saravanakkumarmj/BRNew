"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react"

interface BloodTestResult {
  parameter: string
  value: string
  unit: string
  normalRange: string
  status: "normal" | "high" | "low"
}

interface BloodResultsTableProps {
  results: BloodTestResult[]
}

export function BloodResultsTable({ results }: BloodResultsTableProps) {
  const getStatusIcon = (status: "normal" | "high" | "low") => {
    switch (status) {
      case "normal":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "low":
        return <XCircle className="h-4 w-4 text-orange-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: "normal" | "high" | "low") => {
    switch (status) {
      case "normal":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Normal
          </Badge>
        )
      case "high":
        return <Badge variant="destructive">High</Badge>
      case "low":
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-700">
            Low
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const normalCount = results.filter((r) => r.status === "normal").length
  const abnormalCount = results.filter((r) => r.status !== "normal").length

  if (results.length === 0) {
    return (
      <Card className="border-border bg-card p-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">No blood test results found in the analysis.</p>
          <p className="text-sm text-muted-foreground mt-2">
            The AI analysis may not have detected structured blood test data.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Tests</p>
              <p className="text-3xl font-bold text-foreground">{results.length}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold">{results.length}</span>
            </div>
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Normal</p>
              <p className="text-3xl font-bold text-green-600">{normalCount}</p>
            </div>
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
        </Card>

        <Card className="border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Abnormal</p>
              <p className="text-3xl font-bold text-red-600">{abnormalCount}</p>
            </div>
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Results Table */}
      <Card className="border-border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Blood Test Results</h3>
          <p className="text-sm text-muted-foreground">Detailed analysis of your blood test parameters</p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Parameter</TableHead>
                <TableHead className="w-[100px]">Value</TableHead>
                <TableHead className="w-[80px]">Unit</TableHead>
                <TableHead className="w-[150px]">Normal Range</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={`${result.parameter}-${index}`}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {result.parameter}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{result.value}</TableCell>
                  <TableCell className="text-muted-foreground">{result.unit || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{result.normalRange}</TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
