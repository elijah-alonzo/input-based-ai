type ChatResponse = {
  question: string;
  answer: string;
};

type ArticleResultProps = {
  result: ChatResponse | null;
  imagePreview: string | null;
  projectTitle: string;
  isLoading: boolean;
};

export default function ArticleResult({
  result,
  imagePreview,
  projectTitle,
  isLoading,
}: ArticleResultProps) {
  return (
    <div className="border border-gray-300 rounded-sm text-sm min-h-[460px]">
      {imagePreview && (
        <img
          src={imagePreview}
          alt="Project"
          className="w-full max-h-64 object-cover rounded-t-sm"
        />
      )}
      <div className="p-4 whitespace-pre-wrap">
        {isLoading ? (
          <div className="text-gray-500">Generating article...</div>
        ) : result ? (
          <div className="leading-relaxed">
            {projectTitle && (
              <h1 className="text-2xl font-bold mb-4 text-center">
                {projectTitle}
              </h1>
            )}
            <p className="text-justify">{result.answer}</p>
          </div>
        ) : (
          <div className="text-gray-400">
            Complete the form and click &quot;Generate Article&quot; to create a
            comprehensive article about your community project.
          </div>
        )}
      </div>
    </div>
  );
}
