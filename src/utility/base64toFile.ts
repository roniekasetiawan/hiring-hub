export default function base64toFile(
  base64: string,
  filename: string,
  mime = "image/jpeg",
): Blob | File {
  const [header, data] = base64.split(",");
  if (!data) throw new Error("Invalid base64");

  const hasFileCtor =
    typeof globalThis !== "undefined" &&
    typeof (globalThis as any).File !== "undefined";
  const bin =
    typeof window !== "undefined"
      ? Uint8Array.from(atob(data), (c) => c.charCodeAt(0))
      : Uint8Array.from(Buffer.from(data, "base64"));

  if (hasFileCtor) {
    return new File([bin], filename, { type: mime });
  }

  return new Blob([bin], { type: mime });
}
