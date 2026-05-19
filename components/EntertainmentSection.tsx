import Link from "next/link";
import type { Article } from "@/lib/articles";
import { ArticleImage } from "@/components/ArticleImage";

export function EntertainmentSection({ stories }: { stories: Article[] }) {
  const [lead, ...rest] = stories;

  if (!lead) return null;

  const leadHref = `/article/${lead.id}`;

  return (
    <section className="mt-10 border-t border-neutral-200 pt-8">
      <h2 className="border-b-2 border-neutral-900 pb-2 font-sans text-sm font-bold uppercase tracking-[0.15em] text-neutral-900">
        Entertainment &amp; Arts
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-5">
        <article className="group lg:col-span-3">
          <Link href={leadHref}>
            <ArticleImage src={lead.image} alt={lead.imageAlt} aspect="video" />
          </Link>
          <p className="mt-3 font-sans text-[10px] font-bold uppercase tracking-wider text-[#c41230]">
            {lead.category}
          </p>
          <h3 className="mt-1 font-serif text-2xl font-bold leading-snug text-neutral-900 group-hover:text-[#c41230] sm:text-3xl">
            <Link href={leadHref}>{lead.title}</Link>
          </h3>
          <p className="mt-3 font-sans text-base leading-[1.65] text-neutral-700">
            <Link href={leadHref} className="hover:text-neutral-900">
              {lead.excerpt}
            </Link>
          </p>
          <p className="mt-2 font-sans text-xs text-neutral-500">{lead.timeAgo}</p>
        </article>

        {rest.length > 0 && (
          <div className="flex flex-col gap-6 border-t border-neutral-200 pt-6 lg:col-span-2 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-sans text-xs font-bold uppercase tracking-wide text-neutral-500">
              Also in Entertainment
            </p>
            {rest.map((story) => {
              const href = `/article/${story.id}`;
              return (
                <article
                  key={story.id}
                  className="group border-b border-neutral-100 pb-6 last:border-0 last:pb-0"
                >
                  <h4 className="font-serif text-lg font-bold leading-snug text-neutral-900 group-hover:text-[#c41230]">
                    <Link href={href}>{story.title}</Link>
                  </h4>
                  <p className="mt-1 font-sans text-sm leading-relaxed text-neutral-600 line-clamp-2">
                    <Link href={href} className="hover:text-neutral-800">
                      {story.excerpt}
                    </Link>
                  </p>
                  <p className="mt-1 font-sans text-xs text-neutral-500">{story.timeAgo}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
