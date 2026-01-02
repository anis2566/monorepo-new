import { ResultView } from "@/modules/result/ui/views/result-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Results",
  description: "Results",
};

const Results = () => {
  return <ResultView />;
};

export default Results;
