import { ImagePlus, Star, Trash2 } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export type PhotoItem = {
  key: string;
  src: string;
  existingId?: string;
  file?: File;
};

const MAX_PHOTOS = 9;

export function ListingPhotos({
  photos,
  coverKey,
  onChange,
}: {
  photos: PhotoItem[];
  coverKey: string | null;
  onChange: (photos: PhotoItem[], coverKey: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function addFiles(files: FileList | File[]) {
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!incoming.length) return;
    const room = MAX_PHOTOS - photos.length;
    const nextFiles = incoming.slice(0, Math.max(0, room));
    const added: PhotoItem[] = nextFiles.map((file) => ({
      key: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
      src: URL.createObjectURL(file),
      file,
    }));
    const next = [...photos, ...added];
    onChange(next, coverKey ?? next[0]?.key ?? null);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  }

  function remove(key: string) {
    const next = photos.filter((p) => p.key !== key);
    const nextCover =
      coverKey === key ? (next[0]?.key ?? null) : coverKey && next.some((p) => p.key === coverKey)
        ? coverKey
        : (next[0]?.key ?? null);
    onChange(next, nextCover);
  }

  const cover = photos.find((p) => p.key === coverKey) ?? photos[0];
  const rest = photos.filter((p) => p.key !== cover?.key);
  const full = photos.length >= MAX_PHOTOS;

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">Photos</p>
        <p className="mt-0.5 text-xs text-quiet">
          Drop pictures here. Mark one as the main photo — interiors and other
          rooms go in the gallery (up to {MAX_PHOTOS}).
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (full) return;
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border border-dashed text-center transition-colors",
          photos.length ? "px-4 py-5" : "px-4 py-8",
          over ? "border-green bg-sage/20" : "border-border bg-cream/50",
        )}
      >
        <ImagePlus
          className={cn("mx-auto text-green", photos.length ? "size-6" : "size-8")}
          strokeWidth={1.5}
        />
        <p className="mt-3 text-sm text-charcoal">
          {full
            ? `Maximum of ${MAX_PHOTOS} photos`
            : photos.length
              ? "Drop more interiors, or browse"
              : "Drag photos in, or browse"}
        </p>
        <p className="mt-1 text-xs text-quiet">JPEG, PNG or WebP · main + interiors</p>
        {full ? null : (
          <button
            type="button"
            className="mt-4 inline-flex h-11 items-center rounded-full bg-green px-5 text-sm font-medium text-cream hover:bg-green-hover"
            onClick={() => inputRef.current?.click()}
          >
            {photos.length ? "Add photos" : "Choose photos"}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {cover ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-quiet">
            Main photo
          </p>
          <PhotoTile
            photo={cover}
            isCover
            onCover={() => onChange(photos, cover.key)}
            onRemove={() => remove(cover.key)}
          />
        </div>
      ) : null}

      {rest.length ? (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-quiet">
            More photos
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {rest.map((photo) => (
              <PhotoTile
                key={photo.key}
                photo={photo}
                isCover={false}
                onCover={() => onChange(photos, photo.key)}
                onRemove={() => remove(photo.key)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function PhotoTile({
  photo,
  isCover,
  onCover,
  onRemove,
}: {
  photo: PhotoItem;
  isCover: boolean;
  onCover: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-cream-dark">
      <img src={photo.src} alt="" className="media aspect-[4/3] w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-green-ink/70 p-2">
        <button
          type="button"
          onClick={onCover}
          className={cn(
            "inline-flex h-11 items-center gap-1 rounded-full px-3 text-xs font-medium",
            isCover ? "bg-terracotta text-paper" : "bg-cream/95 text-charcoal",
          )}
        >
          <Star className="size-3.5" />
          {isCover ? "Main" : "Set as main"}
        </button>
        <button
          type="button"
          aria-label="Remove photo"
          onClick={onRemove}
          className="inline-flex size-11 items-center justify-center rounded-full bg-cream/95 text-charcoal"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
