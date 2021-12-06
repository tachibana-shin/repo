import { computed } from "vue";
import { valid, coerce } from "semver";

export default computed<string | null>(() => {
  const ver = typeof navigator !== "undefined" ? navigator.appVersion
    .split("OS ")?.[1]
    ?.split(" ")[0]
    ?.replace("_", ".") : "";

  return valid(ver) ? ver : coerce(ver)?.version || null;
});
