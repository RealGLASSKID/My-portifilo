import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Instagram, Music2, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "The Story of GLASSKID — Prince Dennis",
  description:
    "Before the name, there was just Prince Dennis. The real story behind GLASSKID — the person, the pain, the music, and the mentor who shaped his voice.",
  openGraph: {
    title: "The Story of GLASSKID",
    description: "Before the name, there was just Prince Dennis. Go deeper into who GLASSKID really is.",
    type: "profile",
    url: "/about/story",
  },
  alternates: { canonical: "/about/story" },
};

export default function GlasskidStoryPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-28 pt-10">
      <Link
        href="/about"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" /> Back to About
      </Link>

      <div className="mt-8 text-center">
        <span className="chip">
          <span className="size-1.5 rounded-full bg-primary" /> The Real Story
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-4xl font-bold leading-tight tracking-tight md:text-5xl">
          The Story of <span className="text-gradient">GLASSKID</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Before the name, there was just Prince Dennis.
        </p>
      </div>

      <div className="relative mx-auto mt-10 w-56 overflow-hidden rounded-2xl border border-white/10 sm:w-64">
        <Image
          src="/images/hero-portrait.png"
          alt="Prince Dennis — GLASSKID"
          width={640}
          height={800}
          className="w-full object-cover"
          priority
        />
      </div>

      <div className="prose-story mx-auto mt-14 max-w-2xl space-y-6 text-[15px] leading-relaxed text-foreground/90 md:text-base">
        <p>
          My name is Prince Lumen Christi Dennis—Prince being a title, and Dennis being a family
          name passed down from my grandfather. I come from Imo State, Nigeria, but my story is
          much bigger than a name or a place.
        </p>

        <p>For a long time, I felt almost invisible.</p>

        <p>
          I could be surrounded by friends and still feel like I wasn&apos;t really there. I would
          arrive, spend time with people, leave—and sometimes it felt as though my presence had
          never happened. I wasn&apos;t the person everyone noticed. I wasn&apos;t the loudest voice
          in the room. I was simply there, trying to understand myself and the world around me. 🌑
        </p>

        <p>Then life started shaping me.</p>

        <p>
          A lot of who I am today came from the experiences I had growing up, especially through
          primary and secondary school. Those years gave me memories, lessons, disappointments,
          friendships, emotions and experiences that slowly built the person I am becoming.
        </p>

        <p>And somewhere along the way, GLASSKID was born. 🪞</p>

        <div className="glass-card space-y-3 p-6 md:p-8">
          <p className="!mt-0">The name isn&apos;t just something I chose because it sounds cool.</p>
          <p>Glass represents a lot of me.</p>
          <p>
            I&apos;m transparent. I don&apos;t like giving people a bad reflection of who I am. What
            you see is supposed to be what you get. But glass is also fragile. It can carry a
            beautiful reflection while still being capable of breaking.
          </p>
          <p className="!mb-0">And honestly, I&apos;ve had my share of heartbreaks. 💔</p>
        </div>

        <p>
          I&apos;ve collected enough emotional scars from love to understand why the name feels so
          personal. I believe in love, even after experiencing the parts of it that hurt. Maybe
          that&apos;s one of the contradictions that makes me who I am: I can be hurt by something
          and still believe in it.
        </p>

        <p>That&apos;s also part of why music means so much to me.</p>
      </div>

      {/* MENTOR CALLOUT */}
      <div className="glass-card neon-ring mx-auto mt-10 max-w-2xl overflow-hidden p-6 md:p-8">
        <div className="chip mb-4">
          <Music2 className="size-3.5" /> My Mentor
        </div>
        <div className="grid gap-6 sm:grid-cols-[160px_1fr] sm:items-start">
          <div className="relative mx-auto aspect-[4/5] w-40 overflow-hidden rounded-xl border border-white/10 sm:mx-0 sm:w-full">
            <Image
              src="/images/omah-lay-mentor.jpg"
              alt="Omah Lay"
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-gradient">Omah Lay</span>
            </h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/90">
              <p>
                There is one artist whose music has stayed particularly close to me: Omah Lay.
                I&apos;m not interested in describing myself simply as a fan. His music has felt
                personal to me for years. I&apos;ve followed his journey for more than eight years,
                studied his music deeply, and know the songs that have been part of his rise. There
                are emotions in his music that I recognize because I&apos;ve felt versions of them
                myself.
              </p>
              <p className="italic text-muted-foreground">
                The pain. The loneliness. The love. The confusion. The vulnerability. The attempt
                to keep moving even when something inside you feels tired.
              </p>
              <p>
                For me, Omah Lay isn&apos;t just someone whose songs I listen to. His artistry has
                become part of my own emotional language. I look up to him as a mentor and feel a
                strong personal connection to the emotions he puts into his music. 🎧🖤
              </p>
            </div>
            <a
              href="https://www.instagram.com/omah_lay/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-glass mt-6 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              <Instagram className="size-4" /> Follow @omah_lay
            </a>
          </div>
        </div>
      </div>

      <div className="prose-story mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-foreground/90 md:text-base">
        <p>But GLASSKID isn&apos;t only about pain.</p>
        <p>It&apos;s about what happens after pain.</p>
        <p>It&apos;s about turning experiences into creativity.</p>
        <p>It&apos;s about finding different ways to express what words sometimes can&apos;t explain.</p>

        <p>
          That&apos;s where technology, music, art and creativity started becoming important parts
          of my identity. I don&apos;t see them as completely separate things. To me, they&apos;re
          different ways of taking something that exists inside my head and turning it into
          something that other people can see, hear or experience.
        </p>

        <p>And that&apos;s what I want to keep doing.</p>

        <ul className="space-y-1.5 !pl-0 marker:content-none">
          <li>I want to build things.</li>
          <li>I want to create.</li>
          <li>I want to make music.</li>
          <li>I want to express myself.</li>
          <li>I want to learn.</li>
        </ul>

        <p>And eventually, I want the world to hear my voice. 🌍🎙️</p>

        <p>
          Not necessarily because I want everyone to know my name, but because I believe there is
          something inside me worth expressing.
        </p>

        <p>There is also someone who sits at the center of that ambition:</p>
      </div>

      {/* MOTHER CALLOUT */}
      <div className="glass-card mx-auto mt-10 max-w-2xl p-6 text-center md:p-8">
        <Heart className="mx-auto size-6 text-primary" />
        <h3 className="mt-3 text-xl font-semibold">My mother.</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
          She is one of the biggest reasons I refuse to give up. When things become difficult, when
          motivation disappears, when I question whether I&apos;m moving fast enough, I think about
          making her proud. That thought has become one of the reasons I keep going.
        </p>
      </div>

      <div className="prose-story mx-auto mt-10 max-w-2xl space-y-6 text-[15px] leading-relaxed text-foreground/90 md:text-base">
        <p>I don&apos;t know exactly what the final version of my life will look like yet.</p>
        <p>I&apos;m still figuring things out.</p>
        <p>I&apos;m still learning who I am.</p>
        <p>I&apos;m still discovering what I&apos;m capable of.</p>
        <p>But maybe that&apos;s the point.</p>
        <p>I don&apos;t want to pretend that I&apos;ve already become everything I&apos;m supposed to be.</p>
        <p className="font-semibold text-foreground">I&apos;m still becoming.</p>

        <p>Prince Dennis is the person behind the name.</p>
        <p>GLASSKID is the identity I built from the pieces of myself I couldn&apos;t always explain.</p>
      </div>

      {/* IDENTITY TAGS */}
      <div className="mx-auto mt-10 flex max-w-2xl flex-wrap justify-center gap-2">
        {[
          "The invisible kid",
          "The dreamer",
          "The person who has been hurt",
          "The person who still believes in love",
          "The creative",
          "The one who wants to be heard",
          "The son who wants to make his mother proud",
        ].map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-foreground/80"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-[15px] leading-relaxed text-foreground/90">
        And the person who is still trying to turn everything he&apos;s experienced into something
        meaningful. 🖤
      </p>

      {/* SIGNATURE CLOSE */}
      <div className="mx-auto mt-14 max-w-2xl text-center">
        <p className="text-2xl font-bold">
          I&apos;m <span className="text-gradient">GLASSKID</span>.
        </p>
        <p className="mt-3 text-muted-foreground">
          Fragile, maybe. Transparent, definitely. Broken sometimes. But still here.
        </p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-primary">
          And this is only the beginning. 👑
        </p>
      </div>

      <div className="mx-auto mt-14 flex max-w-2xl justify-center">
        <Link
          href="/contact"
          className="btn-glow inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold"
        >
          Get in touch
        </Link>
      </div>
    </section>
  );
}
