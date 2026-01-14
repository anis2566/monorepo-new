"use client";

import { use, useState, useMemo } from "react";
import { useTRPC } from "@/trpc/react";
import {
  Trophy,
  Search,
  Users,
  BarChart,
  GraduationCap,
  Building2,
  ChevronLeft,
  Loader2,
  Medal,
  TrendingUp,
  ArrowBigUp,
  Smartphone,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface PublicMeritListPageProps {
  params: Promise<{ id: string }>;
}

export default function PublicMeritListPage({
  params,
}: PublicMeritListPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const trpc = useTRPC();
  const [search, setSearch] = useState("");

  const { data, isLoading, error } = useQuery(
    trpc.public.exam.getPublicMeritList.queryOptions({ examId: id })
  );

  const filteredMeritList = useMemo(() => {
    if (!data?.meritList) return [];
    return data.meritList.filter(
      (item: any) =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.college.toLowerCase().includes(search.toLowerCase()) ||
        item.class.toLowerCase().includes(search.toLowerCase())
    );
  }, [data?.meritList, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">
            Generating Merit List...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full border-none shadow-xl">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <BarChart className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold">Merit List Unavailable</h2>
            <p className="text-muted-foreground">
              The merit list for this exam might still be processing or is not
              available for public view.
            </p>
            <Button
              onClick={() => router.push(`/public/exams/${id}`)}
              className="w-full"
            >
              Back to Exam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { exam, meritList } = data;
  const topThree = meritList.slice(0, 3);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header Section */}
      <div className="bg-primary text-primary-foreground pt-12 pb-24 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Button
            variant="ghost"
            className="text-primary-foreground hover:bg-white/10 -ml-2"
            onClick={() => router.push(`/public/exams/${id}`)}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Exam
          </Button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm mb-3">
                <Medal className="w-3 h-3" />
                Live Standings
              </div>
              <h1 className="text-3xl md:text-5xl font-black">{exam.title}</h1>
              <p className="text-primary-foreground/70 text-lg md:text-xl font-medium mt-2">
                Official Merit List - Public Access
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full md:w-auto">
              <HeaderStat
                icon={<Users className="w-4 h-4" />}
                label="Participants"
                value={exam.totalParticipants.toString()}
              />
              <HeaderStat
                icon={<TrendingUp className="w-4 h-4" />}
                label="Avg Score"
                value={`${exam.avgScore}%`}
              />
              <HeaderStat
                icon={<Trophy className="w-4 h-4" />}
                label="Max Marks"
                value={exam.total.toString()}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 space-y-8">
        {/* Podium for Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((item: any, index: number) => (
            <PodiumCard key={item.id} item={item} rank={index + 1} />
          ))}
        </div>

        {/* Search and Main List */}
        <Card className="border-none shadow-xl overflow-hidden">
          <CardHeader className="bg-white border-b p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-bold">
                  Public Standings
                </CardTitle>
                <CardDescription>
                  Search and filter through all participants
                </CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name, college, or class..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 text-muted-foreground font-bold">
                  <tr>
                    <th className="px-6 py-4">Rank</th>
                    <th className="px-6 py-4">Participant</th>
                    <th className="px-6 py-4 hidden md:table-cell">
                      Institution
                    </th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4 text-right">Percentile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-muted">
                  {filteredMeritList.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      <td className="px-6 py-4 font-black text-lg text-muted-foreground">
                        {item.rank}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" /> {item.class}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 opacity-50" />
                          {item.college}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-primary">
                            {item.score} / {item.total}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                            {item.percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full font-bold text-xs">
                          <ArrowBigUp className="w-3 h-3" />
                          {item.percentile}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMeritList.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  No participants found matching your search.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HeaderStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 text-white/60 mb-1">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function PodiumCard({
  item,
  rank,
}: {
  item: {
    name: string;
    college: string;
    phone: string;
    score: number;
    total: number;
  };
  rank: number;
}) {
  const isFirst = rank === 1;
  return (
    <Card
      className={cn(
        "border-none shadow-lg overflow-hidden relative transition-transform hover:scale-[1.02]",
        isFirst
          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
          : "bg-white"
      )}
    >
      <div
        className={cn(
          "absolute top-4 right-4 text-6xl font-black opacity-10",
          isFirst ? "text-white" : "text-primary"
        )}
      >
        #{rank}
      </div>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Medal
              className={cn(
                "w-5 h-5",
                isFirst ? "text-white" : "text-yellow-500"
              )}
            />
            <span
              className={cn(
                "text-xs font-bold uppercase tracking-widest opacity-80",
                isFirst ? "text-white" : "text-muted-foreground"
              )}
            >
              {rank === 1
                ? "Champion"
                : rank === 2
                  ? "First Runner-up"
                  : "Second Runner-up"}
            </span>
          </div>
          <h3 className="text-2xl font-black truncate">{item.name}</h3>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 opacity-80">
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium truncate">{item.college}</span>
          </div>
          <div className="flex items-center gap-2 opacity-80">
            <Smartphone className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">{item.phone}</span>
          </div>
        </div>

        <div
          className={cn(
            "inline-block px-4 py-2 rounded-xl text-2xl font-black shadow-inner",
            isFirst ? "bg-white/20" : "bg-primary/10 text-primary"
          )}
        >
          {item.score}{" "}
          <span className="text-sm opacity-60">/ {item.total}</span>
        </div>
      </CardContent>
    </Card>
  );
}
