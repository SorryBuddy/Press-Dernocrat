import Link from "next/link";
import type { Article } from "@/lib/articles";
import { ArticleImage } from "@/components/ArticleImage";

type Props = {
  title: string;
  stories: Article[];
};

export function StoryCardGrid({ title, stories }: Props) {
  return (
    <section className="mt-10 border-t border-neutral-200 pt-8">
      <h2 className="border-b-2 border-neutral-900 pb-2 font-sans text-sm font-bold uppercase tracking-[0.15em] text-neutral-900">
        {title}
      </h2>

      <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {stories.map((story) => {
          const href = `/article/${story.id}`;
          return (
            <article key={story.id} className="group flex flex-col">
              <Link href={href}>
                <ArticleImage src={story.image} alt={story.imageAlt} aspect="photo" />
              </Link>
              <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-wider text-[#c41230]">
                {story.category}
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold leading-snug text-neutral-900 group-hover:text-[#c41230] sm:text-xl">
                <Link href={href}>{story.title}</Link>
              </h3>
              <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-neutral-600 line-clamp-3">
                <Link href={href} className="hover:text-neutral-800">
                  {story.excerpt}
                </Link>
              </p>
              <p className="mt-2 font-sans text-xs text-neutral-500">{story.timeAgo}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
