import Link from "next/link";
import type { Article } from "@/lib/articles";
import { ArticleImage } from "@/components/ArticleImage";

export function FeaturedArticle({ story }: { story: Article }) {
  const href = `/article/${story.id}`;

  return (
    <article>
      {story.label && (
        <Link href={href}>
          <span className="inline-block bg-[#c41230] px-2 py-1 font-sans text-[10px] font-bold uppercase tracking-wider text-white hover:bg-[#a30f28]">
            {story.label}
          </span>
        </Link>
      )}

      <h2 className="mt-4 font-serif text-3xl font-bold leading-[1.12] tracking-tight text-neutral-900 sm:text-4xl md:text-[2.75rem]">
        <Link href={href} className="hover:text-[#c41230]">
          {story.title}
        </Link>
      </h2>

      {story.subheadline && (
        <p className="mt-3 font-sans text-lg font-medium leading-snug text-neutral-700 sm:text-xl">
          <Link href={href} className="hover:text-neutral-900">
            {story.subheadline}
          </Link>
        </p>
      )}

      <p className="mt-2 font-sans text-xs uppercase tracking-wide text-neutral-500">
        {story.category} · {story.timeAgo}
      </p>

      <Link href={href} className="mt-5 block">
        <ArticleImage
          src={story.image}
          alt={story.imageAlt}
          aspect="video"
          priority
          className="transition-opacity hover:opacity-95"
        />
      </Link>

      <p className="mt-5 font-sans text-base leading-[1.7] text-neutral-700 sm:text-[1.0625rem]">
        <Link href={href} className="hover:text-neutral-900">
          {story.excerpt}
        </Link>
      </p>
    </article>
  );
}
