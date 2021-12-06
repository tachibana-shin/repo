const assets = import.meta.globEager("/src/assets/icons/**/*.png");

export default function useAssetsIcon(src: string): string {
  for (const key in assets) {
    if (key.endsWith(`/${src}`)) {
      return assets[key].default as unknown as string;
    }
  }

  return src;
}
