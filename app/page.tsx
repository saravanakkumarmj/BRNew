import { BloodReportAnalyzer } from "@/components/blood-report-analyzer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-primary/10 animate-gradient" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Floating orbs for depth */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-delayed" />

      {/* Content */}
      <div className="relative z-10">
        <BloodReportAnalyzer />
      </div>
    </main>
  )
}
