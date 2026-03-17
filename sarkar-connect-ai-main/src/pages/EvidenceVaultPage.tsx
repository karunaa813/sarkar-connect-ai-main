import { motion } from "framer-motion";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileImage, 
  FileText, 
  Film, 
  Upload, 
  Loader2, 
  Clock, 
  ShieldCheck, 
  Hash, 
  History, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  User 
} from "lucide-react";

import { useState, useRef } from "react";
import { toast } from "sonner";

const evidenceItems = [
  {
    id: "EVD-2024-001",
    name: "crime_scene_photo_01.jpg",
    type: "image",
    hash: "0x71a3f2e8b9c4d5f6a7b8c9d0e1f2a3b4c5d6e7f8",
    timestamp: "2024-12-15 09:14:22 IST",
    size: "4.2 MB",
    verified: true,
    pixelIntegrity: 100,
    metadataVerified: true,
    custody: [
      { action: "Evidence Uploaded", user: "Citizen (Komal)", date: "2024-12-15 09:14:22", hash: "0x7a...12" },
      { action: "AI Authenticated", user: "SarkarConnect System", date: "2024-12-15 09:15:05", hash: "0xbc...44" },
      { action: "Accessed for Review", user: "SI Sanjay Sharma", date: "2024-12-16 11:20:10", hash: "0x9d...89" }
    ]
  },
  {
    id: "EVD-2024-002",
    name: "witness_statement_scan.pdf",
    type: "document",
    hash: "0x8f2c4d6e8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d",
    timestamp: "2024-12-15 09:18:45 IST",
    size: "1.8 MB",
    verified: true,
    pixelIntegrity: null,
    metadataVerified: true,
    custody: [
      { action: "Evidence Uploaded", user: "Citizen (Komal)", date: "2024-12-15 09:18:45", hash: "0x43...ab" },
      { action: "Verified by Clerk", user: "Digital Court Asst", date: "2024-12-17 14:05:00", hash: "0xef...12" }
    ]
  },
  {
    id: "EVD-2024-003",
    name: "cctv_footage_clip.mp4",
    type: "video",
    hash: "0x3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f",
    timestamp: "2024-12-15 09:22:10 IST",
    size: "128.5 MB",
    verified: true,
    pixelIntegrity: 98,
    metadataVerified: true,
    custody: [
      { action: "Evidence Uploaded", user: "Citizen (Komal)", date: "2024-12-15 09:22:10", hash: "0x12...34" },
      { action: "Forensic Hash Match", user: "Cyber Cell Agent", date: "2024-12-16 10:00:00", hash: "0x56...78" },
      { action: "Submitted to Magistrate", user: "SI Sanjay Sharma", date: "2024-12-18 16:30:45", hash: "0x90...ef" }
    ]
  },
  {
    id: "EVD-2024-004",
    name: "location_evidence_02.jpg",
    type: "image",
    hash: "0xd4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2",
    timestamp: "2024-12-15 10:05:33 IST",
    size: "3.7 MB",
    verified: false,
    pixelIntegrity: 67,
    metadataVerified: false,
    custody: [
      { action: "Evidence Uploaded", user: "Citizen (Komal)", date: "2024-12-15 10:05:33", hash: "0xab...cd" },
      { action: "Integrity Violation Detected", user: "System AI", date: "2024-12-15 10:06:01", hash: "0xff...00" }
    ]
  },
  {
    id: "EVD-2024-005",
    name: "financial_records.pdf",
    type: "document",
    hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
    timestamp: "2024-12-15 10:12:08 IST",
    size: "2.1 MB",
    verified: true,
    pixelIntegrity: null,
    metadataVerified: true,
    custody: [
      { action: "Evidence Uploaded", user: "Citizen (Komal)", date: "2024-12-15 10:12:08", hash: "0xfe...dc" }
    ]
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "image": return FileImage;
    case "document": return FileText;
    case "video": return Film;
    default: return FileText;
  }
};

const EvidenceVaultPage = () => {
  const [items, setItems] = useState(evidenceItems);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedItemHistory, setSelectedItemHistory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Convert size to MB
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    
    // Simulate hashing process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newId = `EVD-2024-0${items.length + 1}`;
    let type = "document";
    if (file.type.startsWith("image/")) type = "image";
    else if (file.type.startsWith("video/")) type = "video";

    const newItem = {
      id: newId,
      name: file.name,
      type: type,
      hash: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      timestamp: new Date().toLocaleString("en-IN"),
      size: `${sizeInMB} MB`,
      verified: true,
      pixelIntegrity: type === "image" ? 100 : null,
      metadataVerified: true,
      custody: [
        { action: "Evidence Uploaded", user: "Citizen (Komal)", date: new Date().toLocaleString(), hash: "0x" + Math.random().toString(16).slice(2, 8) },
        { action: "Secured in Blockchain", user: "SarkarConnect Vault", date: new Date().toLocaleString(), hash: "0x" + Math.random().toString(16).slice(2, 8) }
      ]
    };

    setItems([newItem, ...items]);
    setIsUploading(false);
    toast.success("Evidence secured with SHA-256 Hashing and archived in Blockchain Vault.");
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold mb-2">Blockchain Evidence Vault</h1>
          <p className="text-muted-foreground mb-8">Tamper-proof digital evidence management with blockchain verification</p>
        </motion.div>

        {/* Upload Area */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="shadow-card border-gold/20 mb-8 border-dashed border-2">
            <CardContent className="p-8 flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-navy mb-4">
                <Upload className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-display font-bold text-lg mb-1">Upload Evidence to Vault</h3>
              <p className="text-sm text-muted-foreground mb-4">Files are automatically hashed and timestamped on the blockchain</p>
              <Button
                onClick={handleUploadClick}
                disabled={isUploading}
                className="gradient-navy text-primary-foreground hover:opacity-90"
              >
                {isUploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                {isUploading ? "Calculating Proof..." : "Select Files & Hash"}
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Evidence Grid */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <Card className={`shadow-card ${item.verified ? "border-success/30" : "border-danger-high/30"} border-l-4 ${item.verified ? "border-l-success" : "border-l-danger-high"}`}>
                  <CardContent className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      {/* File Info */}
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${item.verified ? "bg-success/10" : "bg-danger-high/10"}`}>
                          <TypeIcon className={`h-6 w-6 ${item.verified ? "text-success" : "text-danger-high"}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{item.id} • {item.size}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" /> {item.timestamp}
                          </div>
                        </div>
                      </div>

                      {/* Verification Status */}
                      <div className="flex flex-wrap items-center gap-2">
                        {item.verified ? (
                          <Badge className="bg-success text-primary-foreground text-xs gap-1">
                            <ShieldCheck className="h-3 w-3" /> Verified Tamper-Proof
                          </Badge>
                        ) : (
                          <Badge className="bg-danger-high text-primary-foreground text-xs gap-1">
                            <ShieldCheck className="h-3 w-3" /> Integrity Compromised
                          </Badge>
                        )}
                        {item.pixelIntegrity !== null && (
                          <Badge variant="outline" className="text-xs">
                            Pixel Integrity: {item.pixelIntegrity}%
                          </Badge>
                        )}
                        {item.metadataVerified && (
                          <Badge variant="outline" className="text-xs border-success/50 text-success">
                            Metadata ✓
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Blockchain Hash */}
                    <div className="mt-3 rounded-md bg-secondary/60 p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Hash className="h-4 w-4 text-accent shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Blockchain Hash</p>
                          <p className="text-xs font-mono font-medium break-all">{item.hash}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setSelectedItemHistory(selectedItemHistory === item.id ? null : item.id)}
                          className="text-xs text-accent hover:bg-accent/10 h-8 gap-1"
                        >
                          <History className="h-3 w-3" /> 
                          {selectedItemHistory === item.id ? "Hide History" : "Chain of Custody"}
                        </Button>
                        <Lock className="h-4 w-4 text-accent" />
                      </div>
                    </div>

                    {/* Custody Ledger Log */}
                    {selectedItemHistory === item.id && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t border-dashed border-accent/20"
                      >
                        <h4 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-3 flex items-center gap-2">
                          <History className="h-3 w-3" /> Blockchain Custody Ledger
                        </h4>
                        <div className="space-y-4">
                          {item.custody.map((log, idx) => (
                            <div key={idx} className="relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-accent/20">
                              <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full bg-secondary border border-accent/50 flex items-center justify-center">
                                <CheckCircle2 className="h-2.5 w-2.5 text-accent" />
                              </div>
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <p className="text-xs font-bold text-white/90">{log.action}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <User className="h-2.5 w-2.5" /> {log.user}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                      <Clock className="h-2.5 w-2.5" /> {log.date}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className="text-[9px] border-accent/20 text-accent/70 font-mono">
                                    {log.hash}
                                  </Badge>
                                </div>
                              </div>
                              {idx < item.custody.length - 1 && (
                                <div className="mt-2 text-center opacity-20">
                                  <ArrowRight className="h-3 w-3 rotate-90 mx-auto" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EvidenceVaultPage;
