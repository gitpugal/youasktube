import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function MarkdownViewer({ content }: { content: string }) {
  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-lg md:text-3xl font-bold mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-2xl font-semibold mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-xl font-semibold mb-2" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-sm md:text-base mb-2 leading-relaxed" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-blue-500 underline hover:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc ml-6 mb-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal ml-6 mb-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-400 pl-4 italic text-gray-300 mb-3"
            {...props}
          />
        ),
        code: ({ node, className, children, ...props }) => (
          <pre className="bg-gray-900 text-green-400 p-3 rounded mb-3 overflow-auto">
            <code {...props}>{children}</code>
          </pre>
        ),
        table: ({ node, ...props }) => (
          <table
            className="table-auto border-collapse w-full mb-4 border border-white/20"
            {...props}
          />
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-white/10" {...props} />
        ),
        tbody: ({ node, ...props }) => <tbody {...props} />,
        tr: ({ node, ...props }) => (
          <tr className="border-b border-white/10" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="p-2 text-left font-medium border-r border-white/10"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="p-2 border-r border-white/10" {...props} />
        ),
        del: ({ node, ...props }) => (
          <del className="text-gray-500" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
        input: ({ node, ...props }) => (
          <input
            type="checkbox"
            className="mr-2 accent-green-500"
            disabled
            checked={(props as any).checked}
          />
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
