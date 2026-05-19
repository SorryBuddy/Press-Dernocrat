import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleImage } from "@/components/ArticleImage";
import { SiteHeader } from "@/components/SiteHeader";
import { getAllArticles, getArticleById } from "@/lib/articles";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getAllArticles().map((article) => ({ id: article.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | Press Dernocrat Daily`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = getArticleById(id);
  if (!article) notFound();

  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-sans text-sm font-semibold text-neutral-600 hover:text-[#c41230]"
        >
          <span aria-hidden>←</span> Home
        </Link>

        <article className="mt-8">
          {article.label && (
            <span className="inline-block bg-[#c41230] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white">
              {article.label}
            </span>
          )}

          <p className="mt-4 font-sans text-[10px] font-bold uppercase tracking-wider text-[#c41230]">
            {article.category}
          </p>

          <h1 className="mt-2 font-serif text-3xl font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem]">
            {article.title}
          </h1>

          {article.subheadline && (
            <p className="mt-4 font-sans text-lg font-medium leading-snug text-neutral-700 sm:text-xl">
              {article.subheadline}
            </p>
          )}

          <p className="mt-4 font-sans text-sm text-neutral-600">
            {article.author ?? "Press Dernocrat Daily Staff"} · {article.timeAgo}
          </p>

          <ArticleImage
            src={article.image}
            alt={article.imageAlt}
            aspect="video"
            priority
            className="mt-6"
          />

          <p className="mt-6 font-sans text-lg font-medium leading-relaxed text-neutral-800">
            {article.excerpt}
          </p>

          <div className="mt-8 space-y-5 border-t border-neutral-200 pt-8">
            {article.body.map((paragraph, i) => (
              <p
                key={i}
                className="font-sans text-base leading-[1.75] text-neutral-700 sm:text-[1.0625rem]"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>

      <footer className="mt-14 border-t border-neutral-200 py-8 text-center font-sans text-xs leading-relaxed text-neutral-500">
        <p>
          © {new Date().getFullYear()} Press Dernocrat Daily. All stories are fictional parody
          and for entertainment only.
        </p>
      </footer>
    </div>
  );
}
