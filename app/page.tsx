import { EntertainmentSection } from "@/components/EntertainmentSection";
import { FeaturedArticle } from "@/components/FeaturedArticle";
import { LatestHeadlines } from "@/components/LatestHeadlines";
import { SideStories } from "@/components/SideStories";
import { SiteHeader } from "@/components/SiteHeader";
import { siteContainerClass } from "@/lib/site-layout";
import { StoryCardGrid } from "@/components/StoryCardGrid";
import {
  entertainmentStories,
  featuredStory,
  latestHeadlines,
  localNewsStories,
  sideStories,
} from "@/lib/articles";

export default function Home() {
  return (
    <div className="min-h-full bg-white text-neutral-900">
      <SiteHeader />

      <main className={`py-6 sm:py-8 ${siteContainerClass}`}>
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10 xl:gap-12">
          <div className="min-w-0 flex-1">
            <FeaturedArticle story={featuredStory} />
            <SideStories stories={sideStories} />
            <StoryCardGrid title="Around Sonoma County" stories={localNewsStories} />
            <EntertainmentSection stories={entertainmentStories} />
          </div>

          <LatestHeadlines headlines={latestHeadlines} />
        </div>
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
