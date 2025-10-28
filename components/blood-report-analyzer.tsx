"use client"

import { useState } from "react"
import { UserForm } from "@/components/user-form"
import { ReportResults } from "@/components/report-results"
import { Activity } from "lucide-react"

export type KeyFinding = {
  test_name: string
  value: string
  status: "normal" | "high" | "low"
  description: string
}

export type AbnormalFinding = {
  test_name: string
  current_value: string
  reference_range: string
  significance: string
}

export type Supplement = {
  name: string
  dosage: string
  rationale: string
}

export type LifestyleRecommendation = {
  title: string
  items?: string[]
  description?: string
}

export type AnalysisResult = {
  userMetadata: {
    fullName: string
    age: string
    healthGoal: string
  }
  summary: string
  keyFindings: KeyFinding[]
  abnormalFindings: AbnormalFinding[]
  recommendedSupplements: Supplement[]
  lifestyleRecommendations: {
    diet?: LifestyleRecommendation
    exercise?: LifestyleRecommendation
    stress_management?: LifestyleRecommendation
    sleep?: LifestyleRecommendation
  }
  disclaimer: string
  rawAnalysis?: string
}

export type ProductRecommendation = {
  id: string
  name: string
  category: string
  description: string
  price: string
  image: string
  benefits: string[]
}

export function BloodReportAnalyzer() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [products, setProducts] = useState<ProductRecommendation[]>([])
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  const handleAnalysisComplete = async (result: AnalysisResult) => {
    setAnalysisResult(result)

    setIsLoadingProducts(true)
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisResult: result }),
      })

      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error)
    } finally {
      setIsLoadingProducts(false)
    }
  }

  const handleReset = () => {
    setAnalysisResult(null)
    setProducts([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">HealthLab</h1>
              <p className="text-sm text-muted-foreground">Blood Report Analysis Platform</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {!analysisResult ? (
            <UserForm onAnalysisComplete={handleAnalysisComplete} />
          ) : (
            <ReportResults
              analysisResult={analysisResult}
              products={products}
              isLoadingProducts={isLoadingProducts}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  )
}
