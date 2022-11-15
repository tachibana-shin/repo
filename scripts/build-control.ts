import chalk from "chalk";
import fs from "fs";
import { join, dirname, basename, resolve } from "path";
import child_process from "child_process";
import md5file from "md5-file";
import sha256file from "sha256-file";
import sha256 from "sha256";
import { pathToSHA512 as sha512file } from "file-to-sha512";
import semver from "semver";
import fg from "fast-glob";

const R_OK = 4;
const W_OK = 2;

const PATH_ROOT = resolve(__dirname, "..");
const PATH_DEBIAN = join(PATH_ROOT, "debian");
const PATH_FILE_PACKAGES = join(PATH_ROOT, "public/Packages");
const HOMEPAGE = "https://tachibana-shin.github.io/repo";
const PATH_TMP_UNPACK_DEBIAN = join(PATH_ROOT, ".tmp");

type PackageControl = {
  [key: string]: string;
} & {
  Package: string;
  Version: string;
  Section?: string;
  Homepage?: string;
  Maintainer?: string;
  Sponsor?: string;
  Depiction?: string;
  Author?: string;
  Name?: string;
};
export type PackageControlFile = {
  filepath: string;
  control: PackageControl;
  MD5sum?: string;
  SHA256sum?: string;
  SHA512sum?: string;
  size?: number;
  ctimeMs?: number;
  uid?: number;
};

type PackageControlInSection = {
  packageID: string;
  name: string;
  lastVersion: string;
  section: string;
  icon?: string;
  ctimeMs: number;
}

export type SectionControlFile = {
  name: string;
  packages: PackageControlInSection[];
};

const PATH_FILE_CONTROL_CACHE = join(PATH_ROOT, "__CONTROL_CACHE__");
const controlCache = new Map<
  /* Package ID */ string,
  {
    control: PackageControl;
    SHA512sum: string;
  }
>(
  fs.existsSync(PATH_FILE_CONTROL_CACHE)
    ? JSON.parse(fs.readFileSync(PATH_FILE_CONTROL_CACHE, "utf8"))
    : undefined
);

async function updateFileControlCache(): Promise<void> {
  await fs.promises.writeFile(
    PATH_FILE_CONTROL_CACHE,
    JSON.stringify(Array.from(controlCache.entries()))
  );
}

async function main() {
  console.clear();
  console.log(chalk.grey("starting build..."));

  const start = performance.now();

  if (
    fs.existsSync(PATH_DEBIAN) === false ||
    fs.lstatSync(PATH_DEBIAN).isDirectory() === false
  ) {
    throw new Error(`${PATH_DEBIAN} is not directory`);
  }

  // auto fix packages
  const controlPackages = await autoFixDebian(await getListPackages());

  const packagesUnique = uniqueListPackages(controlPackages);
  // get list packages merged version
  await createDepictionPackages(packagesUnique);

  // save info package to sections
  await updateSections(packagesUnique);

  // create basic info
  await createPagesControl(packagesUnique);

  // scan compatible
  await scanCompatible(packagesUnique);

  // clean depiction old
  await cleanDepictionPackageOld(packagesUnique);

  // remove .tmp unpack debian
  await fs.promises
    .rm(PATH_TMP_UNPACK_DEBIAN, {
      recursive: true,
    })
    .catch(() => {});

  // all package ready, create Packages, Packages.bz2
  createFilePackages();

  // create Release
  createFileRelease();

  console.log(chalk.green(`Complete ${performance.now() - start}ms`));
}
main();

function scanCompatible(packages: Map<string, PackageControlFile[]>): void {
  for (const pkg of Array.from(packages.keys())) {
    // scan
    const pathYml = join(PATH_ROOT, "pages/package", pkg, "compatible.yml");
    if (fs.existsSync(pathYml) === false) {
      console.log(
        chalk.yellow(
          `${pkg} required compatible at: pages/package/${pkg}/compatible.yml`
        )
      );
    }
  }
}
// load split file or chunks

function parseControl(control: string): PackageControl {
  const obj = {} as any;

  let propLast: string;
  control
    .split("\n")
    .filter((item) => !!item.replace(/\s/g, ""))
    .forEach((line) => {
      if (propLast && line.match(/^\s/)) {
        obj[propLast] += `\n${line}`;
        return;
      }
      const split = line.split(": ");

      obj[(propLast = split[0].trim())] = split.slice(1).join(": ").trim();
    });

  return obj;
}

function stringifyControl(obj: PackageControl): string {
  return Object.entries(obj).reduce((prev, [key, val]) => {
    return `${prev}${key.trim()}: ${val.trim()}\n`;
  }, "");
}

function stringify(obj: any): string {
  if (process.env.NODE_ENV !== "production") {
    return JSON.stringify(obj, (k, v) => v, 2);
  }

  return JSON.stringify(obj);
}

async function createPagesControl(
  packages: Map<string, PackageControlFile[]>
): Promise<void> {
  const allPackages: PackageControlFile[] = [];
  let countFileDebian = 0;

  packages.forEach((pkg) => {
    allPackages.push(pkg[0]);
    countFileDebian += pkg.length;
  });

  allPackages.sort((a, b) => b.ctimeMs! - a.ctimeMs!);

  const pkgLastUpdate: PackageControlInSection[] = [];

  allPackages.slice(0, 10).forEach((pkg) => {
    pkgLastUpdate.push({
      packageID: pkg.control.Package,
      name: pkg.control.Name || pkg.control.Package,
      lastVersion: pkg.control.Version,
      icon: pkg.control.Icon,
      section: pkg.control.Section || "Unknown",
      ctimeMs: pkg.ctimeMs || 0,
    });
  });

  await fs.writeFileSync(
    join(PATH_ROOT, "pages/control.json"),
    stringify({
      pkgLastUpdate,
      lastUpdateAt: pkgLastUpdate[0].ctimeMs,
      countPackage: Array.from(packages.keys()).length,
      countFileDebian,
    })
  );
}
async function updateSections(
  packages: Map<string, PackageControlFile[]>
): Promise<void> {
  const sections = new Map<string, Set<PackageControlInSection>>();

  packages.forEach((controls) => {
    const section = controls[0].control.Section || "Unknown";

    if (sections.has(section) === false) {
      sections.set(section, new Set());
    }

    sections.get(section)!.add({
      packageID: controls[0].control.Package,
      name: controls[0].control.Name || controls[0].control.Package,
      lastVersion: controls[0].control.Version,
      icon: controls[0].control.Icon,
      section: controls[0].control.Section || "Unknown",
      ctimeMs: controls[0].ctimeMs || 0
    });
  });

  await Promise.all(
    Array.from(sections.keys()).map(async (sectionName) => {
      const pkgs = sections.get(sectionName)!;

      const path = join(
        PATH_ROOT,
        "pages/section",
        encodeURIComponent(sectionName).replace(/%20/g, "+")
      );

      await fs.promises.mkdir(path, {
        recursive: true,
      });

      await Promise.all([
        fixPageNotFound(path, `Description for section ${sectionName}`),
        fs.promises.writeFile(
          join(path, `control.json`),
          stringify({
            name: sectionName,
            packages: Array.from(pkgs),
          })
        ),
      ]);
    })
  );

  const list = Array.from(sections.keys()).map((sectionName) => {
    return {
      name: sectionName,
      to: `/section/${encodeURIComponent(sectionName).toLowerCase().replace(/%20/g, "+")}`,
      packages: Array.from(sections.get(sectionName)!.values()).slice(0, 5),
      countPackage: Array.from(sections.get(sectionName)!.values()).length,
    };
  });
  fs.writeFileSync(
    join(PATH_ROOT, "pages/section-list.json"),
    stringify(
      list.map((item) => ({
        name: item.name,
        to: item.to,
        countPackage: item.countPackage,
      }))
    )
  );
  fs.writeFileSync(
    join(PATH_ROOT, "pages/section-list-pkgs.json"),
    stringify(list)
  );
}
async function fixPageNotFound(
  path: string,
  contentDefault: string
): Promise<void> {
  if (
    !fs.existsSync(join(path, "index.md")) ||
    !fs.existsSync(join(path, "index.vue"))
  ) {
    fs.writeFileSync(
      join(path, "index.md"),
      contentDefault?.replace(/</g, "&gt;").replace(/>/g, "&lt;") || ""
    );
  }
}
async function createDepictionPackages(
  packages: Map<string, PackageControlFile[]>
): Promise<void> {
  await Promise.all(
    Array.from(packages.values()).map(async (versions) => {
      const pathToDirDepiction = join(
        PATH_ROOT,
        "pages/package",
        versions[0].control.Package
      );

      fs.mkdirSync(pathToDirDepiction, {
        recursive: true,
      });

      await Promise.all([
        fixPageNotFound(
          pathToDirDepiction,
          versions[0].control.Description ||
            `Description for package ${versions[0].control.Package}`
        ),
        // write JSON to depiction
        fs.promises.writeFile(
          join(pathToDirDepiction, "control.json"),
          stringify(
            await Promise.all(
              versions.map(async (item) => {
                const [
                  { size, ctimeMs, uid },
                  MD5sum,
                  SHA256sum,
                  SHA512sum,
                ] = await Promise.all([
                  fs.promises.lstat(item.filepath),
                  md5file(item.filepath),
                  sha256file(item.filepath),
                  sha512file(item.filepath),
                ]);

                Object.assign(item, {
                  MD5sum,
                  SHA256sum,
                  SHA512sum,
                  size,
                  ctimeMs,
                  uid,
                });

                return {
                  control: item.control,
                  MD5sum,
                  SHA256sum,
                  SHA512sum,
                  size,
                  ctimeMs,
                  uid,
                };
              })
            )
          )
        ),
      ]);
    })
  );
}

function fixVersion(v: string): string {
  if (semver.valid(v)) {
    return v;
  }

  return semver.coerce(v)?.version || "1.0.0";
}

function uniqueListPackages(
  controls: PackageControlFile[]
): Map<string, PackageControlFile[]> {
  const packages = new Map<string, PackageControlFile[]>();

  controls.forEach((controlFile) => {
    if (packages.has(controlFile.control.Package) === false) {
      packages.set(controlFile.control.Package, []);
    }

    const indexInsert =
      packages
        .get(controlFile.control.Package)!
        .findIndex(({ control: { Version } }) =>
          semver.gt(
            fixVersion(Version),
            fixVersion(controlFile.control.Version)
          )
        ) || packages.get(controlFile.control.Package)!.length;

    packages
      .get(controlFile.control.Package)!
      .splice(indexInsert, 0, controlFile);
  });

  return packages;
}

function unpackDebianToTmp(src: string): void {
  try {
    fs.rmSync(`${PATH_TMP_UNPACK_DEBIAN}`, {
      recursive: true,
    }); // rm .tmp why?
  } catch {}

  child_process.execSync(`dpkg-deb -R "${src}" "${PATH_TMP_UNPACK_DEBIAN}"`);
}

function readFileControlFromTmp(): string {
  const filepath = join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN/control");

  try {
    fs.accessSync(filepath, R_OK);
  } catch {
    child_process.execSync(`chmod +r "${filepath}"`);
  }

  return fs.readFileSync(filepath, "utf8");
}

function writeFileControlToTmp(control: PackageControl): void {
  const filepath = join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN/control");

  try {
    fs.accessSync(filepath, W_OK);
  } catch {
    child_process.execSync(`chmod +w "${filepath}"`);
  }

  fs.writeFileSync(filepath, stringifyControl(control));
}

function getStat(filepath: string): [number, number, number] {
  const newLocal = (fs.statSync(filepath).mode & parseInt("777", 8))
    .toString(8)
    .split("")
    .map(Number);

  return newLocal as any;
}

function isR(p: number): boolean {
  return p <= 7 && p >= 4;
}

function isW(p: number): boolean {
  return p === 2 || p === 3 || p === 7;
}

function isX(p: number): boolean {
  return p % 2 === 1;
}

function addX(p: number): number {
  if (isX(p)) {
    return p;
  }

  if (isR(p)) {
    return 5;
  }
  if (isW(p)) {
    return 3;
  }

  return 7;
}

function packDebianFromTmp(filepath: string): void {
  const pathTmpControl = join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN/control");

  if (getStat(pathTmpControl).join("") !== "755") {
    fs.chmodSync(pathTmpControl, 0o755);
  }

  fs.readdirSync(join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN")).forEach((filename) => {
    if (filename !== "control") {
      const [p, o, w] = getStat(
        join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN", filename)
      );

      fs.chmodSync(
        join(PATH_TMP_UNPACK_DEBIAN, "DEBIAN", filename),
        eval(`0o${addX(p)}${addX(o)}${addX(w)}`)
      );
    }
  });

  child_process.execSync(
    `dpkg-deb --build --root-owner-group "${PATH_TMP_UNPACK_DEBIAN}" "${filepath}"`
  );
}

async function getListPackages(): Promise<string[]> {
  return await fg(`${PATH_DEBIAN}/*.deb`);
}
async function cleanDepictionPackageOld(
  packages: Map<string, PackageControlFile[]>
): Promise<void> {
  const packagesID = Array.from(packages.keys());

  await Promise.all(
    fs.readdirSync(join(PATH_ROOT, "pages/package")).map(async (filename) => {
      if (!packagesID.includes(filename)) {
        fs.promises.rm(join(PATH_ROOT, "pages/package", filename), {
          recursive: true,
        });
      }
    })
  );
}
function fixPackageId(id: string): string {
  const split = id.split(".");

  if (split.length < 3) {
    return id;
  }

  return `git.shin.${split.slice(2).join(".")}`;
}

const SectionsReady = fs.readdirSync(
  join(PATH_ROOT, "src/assets/icons/Sections")
);
async function autoFixDebian(debian: string[]): Promise<PackageControlFile[]> {
  const controlJSONFiles = [];

  for (let i = 0, len = debian.length; i < len; i++) {
    const srcDebian = debian[i];
    const filename = basename(srcDebian);
    const hash = await sha512file(srcDebian);

    if (controlCache.get(filename)?.SHA512sum === hash) {
      // skip fix
      controlJSONFiles.push({
        filepath: srcDebian,
        control: controlCache.get(filename)!.control,
      });
      continue;
    }

    console.log(
      chalk.grey(
        `unpack ${basename(srcDebian)} ${Math.round(
          ((i + 1) / debian.length) * 100
        )}% (${i + 1}/${debian.length})`
      )
    );

    unpackDebianToTmp(srcDebian);

    const control = parseControl(readFileControlFromTmp());

    const uniqueControl = sha256(stringify(control));

    //     control.Package = fixPackageId(control.Package);
    if (control.Package !== fixPackageId(control.Package)) {
      console.info(chalk.blue(`${control.Package} is not my package.`));
    }
    control.Homepage = HOMEPAGE;
    control.Maintainer = "tachibana-shin<tachib.shin@gmail.com>";
    control.Sponsor = "tachibana-shin<https://tachibana-shin.github.io>";
    if (
      SectionsReady.includes(`${control.Section?.trim()}.png`) === false &&
      SectionsReady.includes(
        `${control.Section?.trim().replace(/\s/g, "_")}.png`
      ) === false
    ) {
      console.log(
        chalk.yellow(
          `Warning ${control.Package} of section (${control.Section} no icon.`
        )
      );
    }
    control.Depiction = `${HOMEPAGE}/package/${control.Package}`; // no report old versions package

    for (const prop in control) {
      if (!control[prop].replace(/^\s|\s$/g, "")) {
        delete control[prop];
      }
    }

    if (uniqueControl !== sha256(stringify(control))) {
      writeFileControlToTmp(control);

      packDebianFromTmp(
        join(PATH_DEBIAN, `${control.Package}@${control.Version}.deb`)
      );
      console.log(chalk.green(`pack ${control.Package}`));

      if (isValidFilename(filename, control) === false) {
        fs.unlinkSync(srcDebian);
        console.log(chalk.green(`fix name ${control.Package}`));
      }
    } else {
      if (isValidFilename(filename, control) === false) {
        fs.renameSync(
          srcDebian,
          join(PATH_DEBIAN, `${control.Package}@${control.Version}.deb`)
        );
      }
    }

    controlJSONFiles.push({
      filepath: join(PATH_DEBIAN, `${control.Package}@${control.Version}.deb`),
      control,
    });
    controlCache.set(`${control.Package}@${control.Version}.deb`, {
      control,
      SHA512sum: hash,
    });
    await updateFileControlCache();
  }

  return controlJSONFiles;
}

function isValidFilename(filepath: string, control: PackageControl): boolean {
  return basename(filepath) === `${control.Package}@${control.Version}.deb`;
}

function createFilePackages(): void {
  child_process.execSync(`sh "${join(PATH_ROOT, "ftparchive-build.sh")}"`);
}

async function createFileRelease(): Promise<void> {
  fs.writeFileSync(
    join(PATH_ROOT, "public/Release"),
    `Origin: Tachibana Shin (たちばなしん)
Label: Tachibana Shin (たちばなしん)
Suite: stable
Version: 1.0
Codename: ios
Architecture: iphoneos-arm
Components: main
Description: Repo DEBIAN packages for Cydia / Installer 5 of the Tachibana Shin (たちばなしん)
MD5Sum:
 ${md5file.sync(PATH_FILE_PACKAGES)} ${
      fs.statSync(PATH_FILE_PACKAGES).size
    } Packages
 ${md5file.sync(`${PATH_FILE_PACKAGES}.xz`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.xz`).size
    } Packages.xz
 ${md5file.sync(`${PATH_FILE_PACKAGES}.gz`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.gz`).size
    } Packages.gz
 ${md5file.sync(`${PATH_FILE_PACKAGES}.bz2`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.bz2`).size
    } Packages.bz2
SHA256:
 ${sha256file(PATH_FILE_PACKAGES)} ${
      fs.statSync(PATH_FILE_PACKAGES).size
    } Packages
 ${sha256file(`${PATH_FILE_PACKAGES}.xz`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.xz`).size
    } Packages.xz
 ${sha256file(`${PATH_FILE_PACKAGES}.gz`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.gz`).size
    } Packages.gz
 ${sha256file(`${PATH_FILE_PACKAGES}.bz2`)} ${
      fs.statSync(`${PATH_FILE_PACKAGES}.bz2`).size
    } Packages.bz2`
  );
}
