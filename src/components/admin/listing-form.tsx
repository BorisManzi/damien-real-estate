import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { type FormEvent, type ReactNode, useState } from "react";
import { toast } from "sonner";
import { ListingPhotos, type PhotoItem } from "@/components/admin/listing-photos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/select-native";
import { Textarea } from "@/components/ui/textarea";
import type { PropertyKind, TransactionType } from "@/data/properties";
import {
  saveListing,
  type ListingLifecycle,
  type ManagedListing,
} from "@/lib/catalog";
import { compressImageFile } from "@/lib/compress-image";

export function ListingForm({ listing }: { listing?: ManagedListing }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [featured, setFeatured] = useState(listing?.featured ?? false);
  const [photos, setPhotos] = useState<PhotoItem[]>(() =>
    (listing?.media ?? []).map((m) => ({
      key: m.id,
      src: m.src,
      existingId: m.id,
    })),
  );
  const [coverKey, setCoverKey] = useState<string | null>(photos[0]?.key ?? null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!photos.length) {
      toast.error("Add at least one photo of the place.");
      return;
    }
    setBusy(true);
    try {
      const data = new FormData(e.currentTarget);
      const title = String(data.get("title") ?? "").trim();
      const transactionType = String(data.get("transactionType")) as TransactionType;
      const propertyType = String(data.get("propertyType")) as PropertyKind;
      const bedroomsRaw = String(data.get("bedrooms") ?? "");
      const bathroomsRaw = String(data.get("bathrooms") ?? "");
      const ordered = orderPhotos(photos, coverKey);
      const payloadPhotos = [];
      for (const photo of ordered) {
        if (photo.existingId && !photo.file) {
          payloadPhotos.push({ kind: "keep" as const, id: photo.existingId });
          continue;
        }
        if (!photo.file) continue;
        const compressed = await compressImageFile(photo.file);
        payloadPhotos.push({
          kind: "upload" as const,
          dataUrl: compressed.dataUrl,
          mime: compressed.mime,
        });
      }
      if (!payloadPhotos.length) {
        toast.error("Add at least one photo of the place.");
        setBusy(false);
        return;
      }
      await saveListing({
        data: {
          id: listing?.id,
          title,
          neighborhood: String(data.get("neighborhood") ?? ""),
          city: String(data.get("city") ?? "Kigali"),
          district: String(data.get("district") ?? ""),
          transactionType,
          propertyType,
          price: Number(data.get("price")),
          size: Number(data.get("size") ?? 0),
          bedrooms: bedroomsRaw ? Number(bedroomsRaw) : null,
          bathrooms: bathroomsRaw ? Number(bathroomsRaw) : null,
          furnished:
            String(data.get("furnished")) === "yes"
              ? true
              : String(data.get("furnished")) === "partial"
                ? "partial"
                : false,
          parking: data.get("parking") === "on",
          garden: data.get("garden") === "on",
          featured,
          description: String(data.get("description") ?? ""),
          amenities: String(data.get("amenities") ?? "")
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean),
          lifecycle: String(data.get("lifecycle")) as ListingLifecycle,
          photos: payloadPhotos,
          coverIndex: 0,
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success(listing ? "Listing saved" : "Listing is on the site");
      void navigate({ to: "/admin/listings" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save listing");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl space-y-6">
      <ListingPhotos
        photos={photos}
        coverKey={coverKey}
        onChange={(next, cover) => {
          setPhotos(next);
          setCoverKey(cover);
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={listing?.title} />
        </Field>
        <Field label="Neighborhood" htmlFor="neighborhood">
          <Input
            id="neighborhood"
            name="neighborhood"
            required
            defaultValue={listing?.neighborhood}
          />
        </Field>
        <Field label="City" htmlFor="city">
          <Input id="city" name="city" defaultValue={listing?.city ?? "Kigali"} />
        </Field>
        <Field label="District" htmlFor="district">
          <Input id="district" name="district" defaultValue={listing?.district} />
        </Field>
        <Field label="Intent" htmlFor="transactionType">
          <NativeSelect
            id="transactionType"
            name="transactionType"
            defaultValue={listing?.transactionType ?? "rent"}
          >
            <option value="rent">Rent</option>
            <option value="buy">Buy</option>
            <option value="land">Land</option>
          </NativeSelect>
        </Field>
        <Field label="Type" htmlFor="propertyType">
          <NativeSelect
            id="propertyType"
            name="propertyType"
            defaultValue={listing?.propertyType ?? "house"}
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="studio">Studio</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </NativeSelect>
        </Field>
        <Field label="Price (RWF)" htmlFor="price">
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            required
            defaultValue={listing?.price}
          />
        </Field>
        <Field label="Size (m²)" htmlFor="size">
          <Input
            id="size"
            name="size"
            type="number"
            min={0}
            required
            defaultValue={listing?.size}
          />
        </Field>
        <Field label="Bedrooms" htmlFor="bedrooms">
          <Input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={listing?.bedrooms ?? ""}
          />
        </Field>
        <Field label="Bathrooms" htmlFor="bathrooms">
          <Input
            id="bathrooms"
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={listing?.bathrooms ?? ""}
          />
        </Field>
        <Field label="Furnished" htmlFor="furnished">
          <NativeSelect
            id="furnished"
            name="furnished"
            defaultValue={
              listing?.furnished === true
                ? "yes"
                : listing?.furnished === "partial"
                  ? "partial"
                  : "no"
            }
          >
            <option value="no">Unfurnished</option>
            <option value="partial">Partial</option>
            <option value="yes">Furnished</option>
          </NativeSelect>
        </Field>
        <Field label="On the public site" htmlFor="lifecycle">
          <NativeSelect
            id="lifecycle"
            name="lifecycle"
            defaultValue={listing?.lifecycle ?? "live"}
          >
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="paused">Paused</option>
            <option value="let">Let (rented)</option>
            <option value="sold">Sold</option>
          </NativeSelect>
        </Field>
      </div>

      <div className="flex flex-wrap gap-5">
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="parking"
            defaultChecked={listing?.parking}
            className="size-4 accent-green"
          />
          Parking
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="garden"
            defaultChecked={listing?.garden}
            className="size-4 accent-green"
          />
          Garden
        </label>
        <label className="inline-flex min-h-11 items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="size-4 accent-green"
          />
          Featured on homepage
        </label>
      </div>

      <Field label="Description" htmlFor="description">
        <Textarea
          id="description"
          name="description"
          required
          defaultValue={listing?.description}
        />
      </Field>
      <Field label="Amenities (comma separated)" htmlFor="amenities">
        <Input
          id="amenities"
          name="amenities"
          defaultValue={listing?.amenities.join(", ")}
        />
      </Field>

      <div className="flex gap-3">
        <Button type="submit" variant="terracotta" disabled={busy}>
          {busy ? "Saving…" : listing ? "Save listing" : "Create listing"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate({ to: "/admin/listings" })}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function orderPhotos(photos: PhotoItem[], coverKey: string | null) {
  const cover = photos.find((p) => p.key === coverKey);
  const rest = photos.filter((p) => p.key !== cover?.key);
  return cover ? [cover, ...rest] : photos;
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
