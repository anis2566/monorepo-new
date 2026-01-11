export const Header = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          MCQ Bank
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage and organize your question bank
        </p>
      </div>
    </div>
  );
};
