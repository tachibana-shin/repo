import useAssetsIcon from "./assetsIcon";

const assets = import.meta.globEager("/src/assets/icons/Sections/*.png");

export function usePackageIcon(icon: string | void, section: string) {
  const packageIcon = useAssetsIcon("Sections/Unknown.png");

  if (icon?.match(/https?:\/\//)) {
    return icon;
  } else {
    for (const key in assets) {
      if (
        key.endsWith(`/${section.trim()}.png`) ||
        key.endsWith(`/${section.trim().replace(/\s/g, "_")}.png`)
      ) {
        return assets[key].default as unknown as string;
      }
    }
  }

  return packageIcon;
}
