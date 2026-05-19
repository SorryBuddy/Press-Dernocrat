import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  aspect?: "video" | "photo" | "square";
  priority?: boolean;
  className?: string;
};

const aspectClasses = {
  video: "aspect-[16/10]",
  photo: "aspect-[4/3]",
  square: "aspect-square",
};

export function ArticleImage({
  src,
  alt,
  aspect = "photo",
  priority = false,
  className = "",
}: Props) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-neutral-200 ${aspectClasses[aspect]} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 700px"
      />
    </div>
  );
}
