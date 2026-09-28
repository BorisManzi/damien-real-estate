import { ImagePlus } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export function CmsImage({
  label,
  hint,
  src,
  onFile,
  className,
}: {
  label: string;
  hint?: string;
  src: string;
  onFile: (file: File) => void;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  function take(files: FileList | File[] | null) {
    const file = files ? Array.from(files).find((f) => f.type.startsWith("image/")) : null;
    if (file) onFile(file);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setOver(false);
    take(e.dataTransfer.files);
  }

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{label}</p>
      {hint ? <p className="text-xs text-quiet">{hint}</p> : null}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "relative block w-full overflow-hidden rounded-xl border border-dashed text-left",
          over ? "border-green bg-sage/20" : "border-border bg-cream/50",
          className,
        )}
      >
        {src ? (
          <img src={src} alt="" className="media aspect-[16/10] w-full object-cover" />
        ) : (
          <div className="flex aspect-[16/10] flex-col items-center justify-center gap-2 px-4 py-8">
            <ImagePlus className="size-7 text-green" strokeWidth={1.5} />
            <span className="text-sm text-charcoal">Drop a photo, or browse</span>
          </div>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-green-ink/70 px-3 py-2 text-xs font-medium text-cream">
          {src ? "Replace photo" : "Add photo"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          take(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
