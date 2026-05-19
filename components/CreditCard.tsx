import Image from "next/image";
import type { CreditPerson } from "@/lib/credits";

export function CreditCard({ person }: { person: CreditPerson }) {
  return (
    <article className="flex flex-col items-center text-center sm:items-start sm:text-left">
      <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-full border-2 border-neutral-200 bg-neutral-100 shadow-sm">
        {person.image ? (
          <Image
            src={person.image}
            alt={person.name}
            fill
            className={
              person.id === "sir-gpt"
                ? "object-contain bg-neutral-50 p-2"
                : "object-cover"
            }
            sizes="144px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-200 to-neutral-300">
            <span className="font-serif text-3xl font-bold text-neutral-600">
              {person.initials}
            </span>
          </div>
        )}
      </div>

      <p className="mt-5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#c41230]">
        {person.role}
      </p>
      <h3 className="mt-1 font-serif text-2xl font-bold text-neutral-900">
        {person.name}
      </h3>
      <p className="mt-3 max-w-sm font-sans text-sm leading-relaxed text-neutral-600">
        {person.description}
      </p>
    </article>
  );
}
