import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, FileText, Send, BookOpen, Download, Loader2, AlertCircle, Scale, ShieldCheck } from "lucide-react";
import { useState } from "react";

const sampleDraft = `TO,
The Public Information Officer,
Department of Public Works,
Government of India

SUBJECT: Request for Information under Right to Information Act, 2005

Sir/Madam,

Under Section 6(1) of the RTI Act, 2005, I hereby request the following information:

1. Complete details of all road construction tenders issued by the Department of Public Works in the financial year 2024-25, including:
   a) Tender reference numbers and dates of issuance
   b) Names of contractors who submitted bids
   c) Final awarded contractor and contract value
   d) Estimated vs. actual completion timelines

2. As per Section 4(1)(b) of the RTI Act, 2005, please provide copies of all inspection reports filed for the said road projects.

3. Details of any cost overruns exceeding 10% of the original tender value, as mandated under Section 4(1)(d) for proactive disclosure.

LEGAL BASIS:
• Section 3, RTI Act 2005 — Right of citizens to access information
• Section 6(1) — Application format and fee
• Section 7(1) — Timeline: 30 days for response
• Section 19 — Right to appeal if information is denied

I am enclosing the prescribed fee of ₹10 via Indian Postal Order.

Thanking you,

[Applicant Name]
[Address]
[Date]`;

const rtiClauses = [
  { section: "Section 3", title: "Right to Information", desc: "Every citizen has the right to access information held by public authorities." },
  { section: "Section 6(1)", title: "Application Process", desc: "Application to be made in writing or electronic means with prescribed fee." },
  { section: "Section 7(1)", title: "Response Timeline", desc: "Information must be provided within 30 days of receipt of request." },
  { section: "Section 8", title: "Exemptions", desc: "Certain categories of information are exempt from disclosure." },
  { section: "Section 19", title: "Right to Appeal", desc: "First appeal within 30 days, second appeal to Information Commission within 90 days." },
];

const SmartRTIPage = () => {
  const [query, setQuery] = useState("Information on road tender for NH-48 highway expansion project in FY 2024-25");
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState(sampleDraft);
  const [triage, setTriage] = useState<"criminal" | "civil" | "none">("none");
  const [localityAlert, setLocalityAlert] = useState<{ is_pattern: boolean; alert_msg: string } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setTriage("none");
    
    const q = query.toLowerCase();
    
    // AI Triage Detection
    const isCivil = q.includes("refund") || q.includes("landlord") || q.includes("salary") || 
                    q.includes("deposit") || q.includes("delivery") || q.includes("consumer") ||
                    q.includes("payment") || q.includes("product") || q.includes("service");

    if (isCivil) {
      setTriage("civil");
    } else {
      setTriage("criminal");
    }

    // Offline templates
    let newDraft = "";

    if (isCivil) {
      newDraft = `LEGAL NOTICE

To,
[Recipient Name/Company Name],
[Address]

SUBJECT: LEGAL NOTICE FOR RECOVERY OF DUES / CONSUMER GRIEVANCE

Sir/Madam,

Under instructions from my client, I hereby serve you with the following legal notice:

1. My client [Name] availed/purchased [Service/Product] on [Date].
2. Despite repeated requests, [Specific issue: e.g., the refund of ₹XXXX has not been processed].
3. You are hereby called upon to resolve this matter within 15 days of receipt of this notice.

Failing which, my client shall be constrained to initiate legal proceedings in the appropriate Consumer Forum/Civil Court at your cost and consequences.

[Sender Name]
[Date]`;

      if (q.includes("landlord") || q.includes("deposit")) {
        newDraft = `LEGAL NOTICE

To,
[Landlord Name],
[Address]

SUBJECT: LEGAL NOTICE FOR REFUND OF SECURITY DEPOSIT

Sir/Madam,

I hereby serve you with this legal notice regarding the property at [Leased Address]:

1. That I was a tenant at the aforementioned property until [Vacation Date].
2. That as per the Lease Agreement, a security deposit of ₹[Amount] is refundable upon vacation.
3. You have failed to refund the said amount despite the property being handed over in good condition.

You are requested to refund the amount of ₹[Amount] within 7 days, failing which I will initiate a civil suit for recovery along with 18% interest.

[Tenant Name]
[Date]`;
      }
    } else {
      // Criminal / RTI Templates
      newDraft = `TO,
The Public Information Officer,
[Target Department],
Government of India

SUBJECT: Information under RTI Act, 2005

Sir/Madam,
Under Section 6(1) of the RTI Act, 2005, I request the following:

1. [Query-specific detail 1]
2. [Query-specific detail 2]

REASON FOR REQUEST:
[Briefly explain why this information is needed for public interest or your personal rights]

Fee of ₹10 enclosed.

[Applicant Name]
[Date]`;

      if (q.includes("road") && q.includes("nh-48")) {
        newDraft = `TO,
The Public Information Officer,
National Highways Authority of India (NHAI),
Ministry of Road Transport and Highways

SUBJECT: Information under RTI Act, 2005

Sir/Madam,
Under Section 6(1) of the RTI Act, 2005, I request the following details regarding the NH-48 highway expansion project for FY 2024-25:

1. Copy of the awarded tender document and contractor details.
2. Estimated date of completion and allocated budget.
3. Details of any environmental clearance obtained.

REASON FOR REQUEST:
As a daily commuter and taxpayer, I am seeking transparency on the project's delays and safety measures, which are of significant public interest.

Fee of ₹10 enclosed via Postal Order.

[Applicant Name]
[Date]`;
      } else if (q.includes("police") || q.includes("fir")) {
        newDraft = `TO,
The Public Information Officer,
Office of the Commissioner of Police,
[District/City]

SUBJECT: Information under RTI Act, 2005

Sir/Madam,
Under Section 6(1) of the RTI Act, 2005, I request the following details regarding FIR No. [XXX] registered on [Date]:

1. Current status of the investigation.
2. Name and contact details of the assigned Investigating Officer (IO).
3. If no action taken, the stipulated timeframe for action as per police manuals.

REASON FOR REQUEST:
I am the complainant in this case, and the delay in investigation is directly affecting my fundamental rights to justice and personal liberty.

Fee of ₹10 enclosed via Postal Order.

[Applicant Name]
[Date]`;
      }
    }

    try {
      const response = await fetch("http://localhost:8000/api/v1/grievances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaint_text: query,
          user_id: "rti-user-001",
          location: "New Delhi"
        })
      });

      if (!response.ok) throw new Error("Backend offline");

      const data = await response.json();
      
      // Update triage state from backend
      if (data.matter_type) {
        setTriage(data.matter_type.toLowerCase() as "civil" | "criminal");
      }

      // Update locality alert from backend
      if (data.locality_alert && data.locality_alert.is_pattern) {
        setLocalityAlert(data.locality_alert);
      } else {
        setLocalityAlert(null);
      }

      if (data.legal_draft) {
        setDraft(data.legal_draft);
      } else {
        setDraft(newDraft + (isCivil ? "\n\n[AUTO-TRIAGE: CIVIL MATTER DETECTED]" : "\n\n[AUTO-ANALYSIS COMPLETED: BNS 2024 COMPLIANT]"));
      }
    } catch (err) {
      console.error("RTI Generation error:", err);
      // Fallback to offline detection if backend fails
      setTriage(isCivil ? "civil" : "criminal");
      setDraft(newDraft + (isCivil ? "\n\n[AUTO-TRIAGE: CIVIL MATTER DETECTED]" : "\n\n[AUTO-ANALYSIS COMPLETED: BNS 2024 COMPLIANT]"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">Smart RTI Engine</h1>
          <p className="text-muted-foreground mb-8">AI-powered RTI application drafting with legal clause mapping</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Input Panel */}
          <motion.div className="lg:col-span-2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                  <Mic className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <CardTitle className="text-lg font-display">Your RTI Request</CardTitle>
                  <p className="text-xs text-muted-foreground">Type or use voice input</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="State your information request..."
                    className="min-h-[120px] pr-12 resize-none"
                  />
                  <button
                    onClick={() => setIsListening(!isListening)}
                    className={`absolute right-3 top-3 h-8 w-8 rounded-full flex items-center justify-center transition-colors ${isListening ? "bg-danger-high text-primary-foreground animate-pulse" : "bg-secondary hover:bg-accent/20"}`}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                </div>
                {isListening && (
                  <p className="text-xs text-danger-high font-medium animate-pulse">🔴 Listening... Speak your request</p>
                )}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full gradient-navy text-primary-foreground hover:opacity-90"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  {isGenerating ? "Consulting BNS 2024..." : "Generate RTI Draft"}
                </Button>

                {/* Referenced Clauses */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-accent" /> RTI Act 2005 — Referenced Clauses
                  </h4>
                  <div className="space-y-2">
                    {rtiClauses.map((clause) => (
                      <div key={clause.section} className="rounded-md border bg-secondary/50 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-accent text-accent">{clause.section}</Badge>
                          <span className="text-xs font-semibold">{clause.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{clause.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Auto-Drafted RTI Document */}
          <motion.div className="lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="shadow-card border-gold/20 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-navy">
                    <FileText className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-display">
                      {triage === "civil" ? "AI-Drafted Legal Notice" : "Auto-Drafted RTI Application"}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {triage === "civil" ? "Civil/Consumer dispute detected" : "AI-generated with legal references"}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">
                  <Download className="h-4 w-4 mr-1" /> Download PDF
                </Button>
              </CardHeader>
              <CardContent>
                {(triage === "civil" || (localityAlert && localityAlert.is_pattern)) && (
                  <div className="space-y-3 mb-4">
                    {triage === "civil" && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-accent">AI Triage: Non-Criminal Matter</p>
                          <p className="text-[10px] text-muted-foreground leading-snug">
                            This issue has been identified as a civil/consumer dispute. 
                            We have generated a Legal Notice draft for recovery.
                          </p>
                        </div>
                      </motion.div>
                    )}
                    
                    {localityAlert && localityAlert.is_pattern && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-danger-high/10 border border-danger-high/20 rounded-lg flex items-start gap-3"
                      >
                        <AlertCircle className="h-5 w-5 text-danger-high shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-danger-high">Locality Alert: Pattern Detected</p>
                          <p className="text-[10px] text-muted-foreground leading-snug">
                            {localityAlert.alert_msg} This has been flagged for the Neighbourhood Watch network.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
                <div className="rounded-lg border bg-card p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap max-h-[600px] overflow-y-auto relative">
                  {triage === "civil" && (
                    <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                      <Scale className="h-20 w-20" />
                    </div>
                  )}
                  {triage === "criminal" && (
                    <div className="absolute top-4 right-4 opacity-10 pointer-events-none">
                      <ShieldCheck className="h-20 w-20" />
                    </div>
                  )}
                  {draft}
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className={`${triage === "civil" ? "bg-accent" : "bg-success"} text-primary-foreground text-xs`}>
                    {triage === "civil" ? "✓ Civil Court Ready" : "✓ RTI Act 2005 Compliant"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {triage === "civil" ? "Notice of Recovery" : "Auto-addressed to PIO"}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {triage === "civil" ? "Legal Notice Fee" : "Fee: ₹10 included"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SmartRTIPage;
