"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  ArrowLeft,
  Trophy,
  Medal,
  Crown,
  Target,
  Download,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

interface PublicMeritViewProps {
  examId: string;
}

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #3b82f6",
    paddingBottom: 10,
  },
  brandingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  logo: {
    width: 50,
    height: 50,
  },
  institutionName: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#dc2626",
    textAlign: "center",
  },
  institutionTagline: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
    textAlign: "center",
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e40af",
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
  },
  // For column headers - ensuring white text
  headerText: {
    color: "#ffffff",
  },
  tableRow: {
    flexDirection: "row",
    padding: 10,
    borderBottom: "1 solid #e5e7eb",
    alignItems: "center",
    minHeight: 35,
  },
  tableRowAlt: {
    backgroundColor: "#f9fafb",
  },
  // Special styles for top 3 - using orange with different opacity
  tableRowRank1: {
    backgroundColor: "rgba(249, 115, 22, 0.25)", // orange-500 at 25% opacity
    borderLeft: "4 solid #f97316",
  },
  tableRowRank2: {
    backgroundColor: "rgba(249, 115, 22, 0.15)", // orange-500 at 15% opacity
    borderLeft: "4 solid #f97316",
  },
  tableRowRank3: {
    backgroundColor: "rgba(249, 115, 22, 0.10)", // orange-500 at 10% opacity
    borderLeft: "4 solid #f97316",
  },
  rankCell: {
    width: "12%",
    fontSize: 10,
    fontWeight: "bold",
  },
  nameCell: {
    width: "38%",
    fontSize: 10,
    color: "#1f2937",
  },
  classCell: {
    width: "25%",
    fontSize: 9,
    color: "#4b5563",
  },
  rollCell: {
    width: "20%",
    fontSize: 9,
    color: "#4b5563",
  },
  scoreCell: {
    width: "13%",
    fontSize: 11,
    fontWeight: "bold",
    color: "#1e40af",
    textAlign: "right",
  },
  // Rank badges - orange theme
  rankBadge: {
    padding: "4 8",
    borderRadius: 4,
    fontSize: 9,
    fontWeight: "bold",
    width: "50%",
  },
  rankBadge1: {
    backgroundColor: "#f97316", // orange-500 - darkest for rank 1
    color: "#ffffff",
  },
  rankBadge2: {
    backgroundColor: "#fb923c", // orange-400 - medium for rank 2
    color: "#ffffff",
  },
  rankBadge3: {
    backgroundColor: "#fdba74", // orange-300 - lightest for rank 3
    color: "#ffffff",
  },
  rankBadgeDefault: {
    color: "#4b5563",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
    borderTop: "1 solid #e5e7eb",
    paddingTop: 10,
  },
  pageNumber: {
    position: "absolute",
    bottom: 15,
    right: 30,
    fontSize: 10,
    color: "#6b7280",
  },
});

// Helper function to get row style based on rank
const getRowStyle = (rank: number, index: number) => {
  if (rank === 1) {
    return [styles.tableRow, styles.tableRowRank1];
  } else if (rank === 2) {
    return [styles.tableRow, styles.tableRowRank2];
  } else if (rank === 3) {
    return [styles.tableRow, styles.tableRowRank3];
  } else if (index % 2 === 1) {
    return [styles.tableRow, styles.tableRowAlt];
  }
  return styles.tableRow;
};

// Helper function to get rank badge style
const getRankBadgeStyle = (rank: number) => {
  if (rank === 1) {
    return [styles.rankBadge, styles.rankBadge1];
  } else if (rank === 2) {
    return [styles.rankBadge, styles.rankBadge2];
  } else if (rank === 3) {
    return [styles.rankBadge, styles.rankBadge3];
  }
  return [styles.rankBadge, styles.rankBadgeDefault];
};

// PDF Document Component with multi-page support
const PublicExamMeritListPDF = ({ exam, meritList }: any) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split merit list into pages (approximately 20 entries per page to be safe)
  const ENTRIES_PER_PAGE = 20;
  const totalPages = Math.ceil(meritList.length / ENTRIES_PER_PAGE);

  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const startIndex = pageIndex * ENTRIES_PER_PAGE;
    const endIndex = Math.min(startIndex + ENTRIES_PER_PAGE, meritList.length);
    return meritList.slice(startIndex, endIndex);
  });

  return (
    <Document>
      {pages.map((pageEntries, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {/* Header - only on first page or repeated on all pages */}
          <View style={styles.header}>
            <View style={styles.brandingContainer}>
              <View style={{ width: "100%" }}>
                <Text style={styles.institutionName}>Mr. Dr.</Text>
                <Text style={styles.institutionTagline}>
                  Academic & Admission Care
                </Text>
              </View>
            </View>
            <Text style={styles.title}>{exam.title}</Text>
            <Text style={styles.subtitle}>Merit List - {currentDate}</Text>
          </View>

          {/* Table Header */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.rankCell,
                  styles.headerText,
                ]}
              >
                Rank
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.nameCell,
                  styles.headerText,
                ]}
              >
                Name
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.classCell,
                  styles.headerText,
                ]}
              >
                Class
              </Text>
              <Text
                style={[
                  styles.tableHeaderText,
                  styles.scoreCell,
                  styles.headerText,
                ]}
              >
                Marks
              </Text>
            </View>

            {/* Table Rows */}
            {pageEntries.map((entry: any, index: number) => {
              const globalIndex = pageIndex * ENTRIES_PER_PAGE + index;
              return (
                <View
                  key={entry.id}
                  style={getRowStyle(entry.rank, globalIndex)}
                >
                  <View style={styles.rankCell}>
                    {entry.rank <= 3 ? (
                      <Text style={getRankBadgeStyle(entry.rank)}>
                        #{entry.rank}
                      </Text>
                    ) : (
                      <Text style={{ fontSize: 10, color: "#4b5563" }}>
                        #{entry.rank}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.nameCell}>{entry.name}</Text>
                  <Text style={styles.classCell}>{entry.className}</Text>
                  <Text style={styles.scoreCell}>{entry.score}</Text>
                </View>
              );
            })}
          </View>

          {/* Page Number */}
          <Text style={styles.pageNumber}>
            Page {pageIndex + 1} of {totalPages}
          </Text>

          {/* Footer - only on last page */}
          {pageIndex === totalPages - 1 && (
            <View style={styles.footer}>
              <Text>
                This is an official document generated by the examination
                system.
              </Text>
              <Text>
                © {new Date().getFullYear()} Mr. Dr. - Academic & Admission
                Care. All rights reserved.
              </Text>
            </View>
          )}
        </Page>
      ))}
    </Document>
  );
};

export const PublicExamMeritView = ({ examId }: PublicMeritViewProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const [isClient, setIsClient] = useState(false);

  // Fetch merit list data
  const { data } = useSuspenseQuery(
    trpc.admin.publicExam.getMeritList.queryOptions({ examId }),
  );

  const { exam, meritList } = data;

  // Ensure we're on client side for PDF generation
  useEffect(() => {
    setIsClient(true);
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return null;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white border-0";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white border-0";
      default:
        return "";
    }
  };

  // Top 3 for podium
  const topThree = meritList.slice(0, 3);

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-foreground">
                Merit List
              </h1>
              <p className="text-sm text-muted-foreground hidden lg:block">
                {exam.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex gap-1">
              <Trophy className="w-3.5 h-3.5" />
              {exam.totalStudents} Students
            </Badge>
            {isClient && (
              <PDFDownloadLink
                document={
                  <PublicExamMeritListPDF exam={exam} meritList={meritList} />
                }
                fileName={`merit-list-${exam.title.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`}
              >
                {({ loading }) => (
                  <Button
                    variant="default"
                    size="sm"
                    disabled={loading}
                    className="gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {loading ? "Generating..." : "Export PDF"}
                    </span>
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </header>

      <div className="px-4 lg:px-8 py-4 lg:py-8 max-w-5xl mx-auto">
        {/* Exam Info Card */}
        <Card className="p-4 lg:p-6 mb-6 gradient-hero">
          <h2 className="font-semibold text-lg lg:text-xl mb-2">
            {exam.title}
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>Total Marks: {exam.total}</span>
            </div>
          </div>
        </Card>

        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Top Performers
            </h3>
            <div className="flex items-end justify-center gap-2 lg:gap-4">
              {/* 2nd Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-14 h-14 lg:w-18 lg:h-18 mb-2 ring-2 ring-gray-400">
                  <AvatarImage src={topThree[1]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg">
                    {topThree[1]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Medal className="w-6 h-6 text-gray-400 mb-1" />
                <p className="font-medium text-sm text-center line-clamp-1">
                  {topThree[1]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[1]?.score}
                </p>
                <div className="w-full h-20 lg:h-24 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg mt-2" />
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-16 h-16 lg:w-20 lg:h-20 mb-2 ring-4 ring-yellow-400">
                  <AvatarImage src={topThree[0]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-yellow-100 text-yellow-600 text-xl">
                    {topThree[0]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Crown className="w-7 h-7 text-yellow-500 mb-1" />
                <p className="font-semibold text-sm text-center line-clamp-1">
                  {topThree[0]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[0]?.score}
                </p>
                <div className="w-full h-28 lg:h-32 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg mt-2" />
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center w-[30%] max-w-[140px]">
                <Avatar className="w-14 h-14 lg:w-18 lg:h-18 mb-2 ring-2 ring-amber-600">
                  <AvatarImage src={topThree[2]?.imageUrl || undefined} />
                  <AvatarFallback className="bg-amber-100 text-amber-600 text-lg">
                    {topThree[2]?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <Medal className="w-6 h-6 text-amber-600 mb-1" />
                <p className="font-medium text-sm text-center line-clamp-1">
                  {topThree[2]?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {topThree[2]?.score}
                </p>
                <div className="w-full h-16 lg:h-20 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-lg mt-2" />
              </div>
            </div>
          </div>
        )}

        {/* Full Merit List */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Complete Rankings</h3>
          <div className="space-y-2">
            {meritList.map((entry) => (
              <Card
                key={entry.id}
                className={cn(
                  "p-3 lg:p-4 transition-all hover:shadow-md",
                  entry.rank <= 3 && "border-l-4",
                  entry.rank === 1 && "border-l-yellow-400",
                  entry.rank === 2 && "border-l-gray-400",
                  entry.rank === 3 && "border-l-amber-600",
                )}
              >
                <div className="flex items-center gap-3 lg:gap-4">
                  {/* Rank */}
                  <div
                    className={cn(
                      "w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center font-bold text-sm lg:text-base",
                      entry.rank <= 3
                        ? getRankBadgeColor(entry.rank)
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {getRankIcon(entry.rank) || `#${entry.rank}`}
                  </div>

                  {/* Avatar & Name */}
                  <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                    <AvatarImage src={entry.imageUrl || undefined} />
                    <AvatarFallback className="bg-muted">
                      {entry.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground truncate">
                        {entry.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {entry.className}
                      {entry.roll && ` • Roll: ${entry.roll}`}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p
                      className={cn(
                        "text-lg lg:text-xl font-bold text-primary",
                      )}
                    >
                      {entry.score}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
