import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";
import { CmsImage } from "@/components/admin/cms-image";
import { DashCard } from "@/components/admin/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { compressImageFile } from "@/lib/compress-image";
import {
  DEFAULT_HOME,
  getHomeContent,
  saveHomeContent,
  type CmsImageInput,
  type HomeContent,
} from "@/lib/home";

export const Route = createFileRoute("/admin/home")({
  component: HomeCmsPage,
});

function HomeCmsPage() {
  const q = useQuery({
    queryKey: ["home"],
    queryFn: () => getHomeContent(),
  });
  if (q.isPending) {
    return <p className="py-16 text-center text-sm text-quiet">Loading homepage…</p>;
  }
  return <HomeForm initial={q.data ?? DEFAULT_HOME} />;
}

function HomeForm({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [hero, setHero] = useState(initial.hero);
  const [featured, setFeatured] = useState(initial.featured);
  const [locations, setLocations] = useState(initial.locations);
  const [categories, setCategories] = useState(initial.categories);
  const [difference, setDifference] = useState(initial.difference);
  const [howItWorks, setHow] = useState(initial.howItWorks);
  const [cta, setCta] = useState(initial.cta);
  const [footer, setFooter] = useState(initial.footer);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [locationFiles, setLocationFiles] = useState<Record<string, File>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const next = await saveHomeContent({
        data: {
          hero: {
            eyebrow: hero.eyebrow,
            headline: hero.headline,
            subhead: hero.subhead,
            searchLabel: hero.searchLabel,
            imageAlt: hero.imageAlt,
            image: await encodeImage(hero.imageSrc, heroFile ?? undefined),
          },
          featured,
          locations: {
            heading: locations.heading,
            subhead: locations.subhead,
            items: await Promise.all(
              locations.items.map(async (item) => ({
                slug: item.slug,
                name: item.name,
                match: item.match,
                image: await encodeImage(item.imageSrc, locationFiles[item.slug]),
              })),
            ),
          },
          categories,
          difference: {
            ...difference,
            problems: difference.problems.map((p) => p.trim()).filter(Boolean),
          },
          howItWorks,
          cta,
          footer,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["home"] });
      await router.invalidate();
      setHero(next.hero);
      setFeatured(next.featured);
      setLocations(next.locations);
      setCategories(next.categories);
      setDifference(next.difference);
      setHow(next.howItWorks);
      setCta(next.cta);
      setFooter(next.footer);
      setHeroFile(null);
      setLocationFiles({});
      toast.success("Homepage updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save homepage");
    } finally {
      setBusy(false);
    }
  }

  function restore() {
    setHero(DEFAULT_HOME.hero);
    setFeatured(DEFAULT_HOME.featured);
    setLocations(DEFAULT_HOME.locations);
    setCategories(DEFAULT_HOME.categories);
    setDifference(DEFAULT_HOME.difference);
    setHow(DEFAULT_HOME.howItWorks);
    setCta(DEFAULT_HOME.cta);
    setFooter(DEFAULT_HOME.footer);
    setHeroFile(null);
    setLocationFiles({});
    toast.message("Original copy restored — save to publish it.");
  }

  return (
    <form onSubmit={submit} className="space-y-6 pb-24">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Homepage
          </h1>
          <p className="mt-1 text-sm text-quiet">
            Change the words and photos on the public landing page. Save, then
            they’re live.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" asChild>
            <Link to="/">View site</Link>
          </Button>
          <Button type="submit" variant="terracotta" disabled={busy}>
            {busy ? "Saving…" : "Save homepage"}
          </Button>
        </div>
      </div>

      <DashCard className="space-y-4">
        <SectionTitle>Hero</SectionTitle>
        <CmsImage
          label="Main photo"
          hint="The large picture at the top of the site."
          src={hero.imageSrc}
          onFile={(file) => {
            setHeroFile(file);
            setHero((h) => ({ ...h, imageSrc: URL.createObjectURL(file) }));
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Eyebrow" htmlFor="hero-eyebrow">
            <Input
              id="hero-eyebrow"
              value={hero.eyebrow}
              onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })}
            />
          </Field>
          <Field label="Search button" htmlFor="hero-search">
            <Input
              id="hero-search"
              value={hero.searchLabel}
              onChange={(e) => setHero({ ...hero, searchLabel: e.target.value })}
            />
          </Field>
        </div>
        <Field label="Headline" htmlFor="hero-headline">
          <Input
            id="hero-headline"
            value={hero.headline}
            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
          />
        </Field>
        <Field label="Supporting line" htmlFor="hero-sub">
          <Textarea
            id="hero-sub"
            value={hero.subhead}
            onChange={(e) => setHero({ ...hero, subhead: e.target.value })}
          />
        </Field>
        <Field label="Photo description" htmlFor="hero-alt">
          <Input
            id="hero-alt"
            value={hero.imageAlt}
            onChange={(e) => setHero({ ...hero, imageAlt: e.target.value })}
          />
        </Field>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>Featured listings</SectionTitle>
        <Field label="Heading" htmlFor="feat-h">
          <Input
            id="feat-h"
            value={featured.heading}
            onChange={(e) => setFeatured({ ...featured, heading: e.target.value })}
          />
        </Field>
        <Field label="Supporting line" htmlFor="feat-s">
          <Textarea
            id="feat-s"
            value={featured.subhead}
            onChange={(e) => setFeatured({ ...featured, subhead: e.target.value })}
          />
        </Field>
        <Field label="Link label" htmlFor="feat-l">
          <Input
            id="feat-l"
            value={featured.linkLabel}
            onChange={(e) => setFeatured({ ...featured, linkLabel: e.target.value })}
          />
        </Field>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>Neighborhoods</SectionTitle>
        <Field label="Heading" htmlFor="loc-h">
          <Input
            id="loc-h"
            value={locations.heading}
            onChange={(e) => setLocations({ ...locations, heading: e.target.value })}
          />
        </Field>
        <Field label="Supporting line" htmlFor="loc-s">
          <Textarea
            id="loc-s"
            value={locations.subhead}
            onChange={(e) => setLocations({ ...locations, subhead: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {locations.items.map((item, i) => (
            <div key={item.slug} className="space-y-3 rounded-xl border border-border p-3">
              <CmsImage
                label={item.name || "Photo"}
                src={item.imageSrc}
                onFile={(file) => {
                  setLocationFiles((prev) => ({ ...prev, [item.slug]: file }));
                  setLocations((prev) => ({
                    ...prev,
                    items: prev.items.map((row, idx) =>
                      idx === i
                        ? { ...row, imageSrc: URL.createObjectURL(file) }
                        : row,
                    ),
                  }));
                }}
              />
              <Field label="Name" htmlFor={`loc-name-${item.slug}`}>
                <Input
                  id={`loc-name-${item.slug}`}
                  value={item.name}
                  onChange={(e) =>
                    setLocations((prev) => ({
                      ...prev,
                      items: prev.items.map((row, idx) =>
                        idx === i ? { ...row, name: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Matches listings in" htmlFor={`loc-match-${item.slug}`}>
                <Input
                  id={`loc-match-${item.slug}`}
                  value={item.match}
                  onChange={(e) =>
                    setLocations((prev) => ({
                      ...prev,
                      items: prev.items.map((row, idx) =>
                        idx === i ? { ...row, match: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>What people look for</SectionTitle>
        <Field label="Heading" htmlFor="cat-h">
          <Input
            id="cat-h"
            value={categories.heading}
            onChange={(e) => setCategories({ ...categories, heading: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.items.map((item, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border p-3">
              <Field label="Title" htmlFor={`cat-t-${i}`}>
                <Input
                  id={`cat-t-${i}`}
                  value={item.title}
                  onChange={(e) =>
                    setCategories((prev) => ({
                      ...prev,
                      items: prev.items.map((row, idx) =>
                        idx === i ? { ...row, title: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Line" htmlFor={`cat-c-${i}`}>
                <Input
                  id={`cat-c-${i}`}
                  value={item.copy}
                  onChange={(e) =>
                    setCategories((prev) => ({
                      ...prev,
                      items: prev.items.map((row, idx) =>
                        idx === i ? { ...row, copy: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>Why Damien</SectionTitle>
        <Field label="Heading" htmlFor="diff-h">
          <Input
            id="diff-h"
            value={difference.heading}
            onChange={(e) => setDifference({ ...difference, heading: e.target.value })}
          />
        </Field>
        <Field label="Body" htmlFor="diff-b">
          <Textarea
            id="diff-b"
            value={difference.body}
            onChange={(e) => setDifference({ ...difference, body: e.target.value })}
          />
        </Field>
        <Field label="The old way (one per line)" htmlFor="diff-p">
          <Textarea
            id="diff-p"
            value={difference.problems.join("\n")}
            onChange={(e) =>
              setDifference({ ...difference, problems: e.target.value.split("\n") })
            }
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          {difference.benefits.map((item, i) => (
            <div key={i} className="space-y-3 rounded-xl border border-border p-3">
              <Field label="Benefit" htmlFor={`ben-t-${i}`}>
                <Input
                  id={`ben-t-${i}`}
                  value={item.title}
                  onChange={(e) =>
                    setDifference((prev) => ({
                      ...prev,
                      benefits: prev.benefits.map((row, idx) =>
                        idx === i ? { ...row, title: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
              <Field label="Line" htmlFor={`ben-c-${i}`}>
                <Textarea
                  id={`ben-c-${i}`}
                  className="min-h-20"
                  value={item.copy}
                  onChange={(e) =>
                    setDifference((prev) => ({
                      ...prev,
                      benefits: prev.benefits.map((row, idx) =>
                        idx === i ? { ...row, copy: e.target.value } : row,
                      ),
                    }))
                  }
                />
              </Field>
            </div>
          ))}
        </div>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>How it works</SectionTitle>
        <Field label="Heading" htmlFor="hiw-h">
          <Input
            id="hiw-h"
            value={howItWorks.heading}
            onChange={(e) => setHow({ ...howItWorks, heading: e.target.value })}
          />
        </Field>
        {howItWorks.steps.map((step, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[140px_1fr]">
            <Field label={`Step ${i + 1} title`} htmlFor={`step-t-${i}`}>
              <Input
                id={`step-t-${i}`}
                value={step.title}
                onChange={(e) =>
                  setHow((prev) => ({
                    ...prev,
                    steps: prev.steps.map((row, idx) =>
                      idx === i ? { ...row, title: e.target.value } : row,
                    ),
                  }))
                }
              />
            </Field>
            <Field label="Line" htmlFor={`step-c-${i}`}>
              <Input
                id={`step-c-${i}`}
                value={step.copy}
                onChange={(e) =>
                  setHow((prev) => ({
                    ...prev,
                    steps: prev.steps.map((row, idx) =>
                      idx === i ? { ...row, copy: e.target.value } : row,
                    ),
                  }))
                }
              />
            </Field>
          </div>
        ))}
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>Closing banner</SectionTitle>
        <Field label="Heading" htmlFor="cta-h">
          <Input
            id="cta-h"
            value={cta.heading}
            onChange={(e) => setCta({ ...cta, heading: e.target.value })}
          />
        </Field>
        <Field label="Body" htmlFor="cta-b">
          <Textarea
            id="cta-b"
            value={cta.body}
            onChange={(e) => setCta({ ...cta, body: e.target.value })}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Primary button" htmlFor="cta-p">
            <Input
              id="cta-p"
              value={cta.primaryLabel}
              onChange={(e) => setCta({ ...cta, primaryLabel: e.target.value })}
            />
          </Field>
          <Field label="WhatsApp button" htmlFor="cta-s">
            <Input
              id="cta-s"
              value={cta.secondaryLabel}
              onChange={(e) => setCta({ ...cta, secondaryLabel: e.target.value })}
            />
          </Field>
        </div>
      </DashCard>

      <DashCard className="space-y-4">
        <SectionTitle>Footer</SectionTitle>
        <Field label="Short blurb" htmlFor="foot-b">
          <Textarea
            id="foot-b"
            value={footer.blurb}
            onChange={(e) => setFooter({ ...footer, blurb: e.target.value })}
          />
        </Field>
      </DashCard>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={restore}>
          Restore original copy
        </Button>
        <Button type="submit" variant="terracotta" disabled={busy}>
          {busy ? "Saving…" : "Save homepage"}
        </Button>
      </div>
    </form>
  );
}

async function encodeImage(src: string, file?: File): Promise<CmsImageInput> {
  if (file) {
    const compressed = await compressImageFile(file);
    return { kind: "upload", dataUrl: compressed.dataUrl, mime: compressed.mime };
  }
  const match = /^\/api\/media\/([^/?#]+)$/.exec(src);
  if (match) return { kind: "keep", id: match[1] };
  return { kind: "url", url: src || DEFAULT_HOME.hero.imageSrc };
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="font-display text-lg font-semibold tracking-tight">{children}</h2>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
