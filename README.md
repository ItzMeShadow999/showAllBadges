<p align="center">
  <img src="https://i.ibb.co/9SKBq2d/c1340b93-51a2-4987-a088-4ab00ff3d18e.png" width="260" alt="ShowAllBadges icon">
</p>

<h1 align="center">ShowAllBadges</h1>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/ItzMeShadow999/showAllBadges?style=flat-square&color=5865F2" alt="License"></a>
  <a href="https://github.com/ItzMeShadow999/showAllBadges/stargazers"><img src="https://img.shields.io/github/stars/ItzMeShadow999/showAllBadges?style=flat-square&color=5865F2" alt="Stars"></a>
  <a href="https://github.com/ItzMeShadow999/showAllBadges/commits/main"><img src="https://img.shields.io/github/last-commit/ItzMeShadow999/showAllBadges?style=flat-square&color=5865F2" alt="Last commit"></a>
  <a href="https://github.com/ItzMeShadow999/showAllBadges/issues"><img src="https://img.shields.io/github/issues/ItzMeShadow999/showAllBadges?style=flat-square&color=5865F2" alt="Issues"></a>
  <a href="https://github.com/Vencord/Vencord"><img src="https://img.shields.io/badge/Vencord-supported-5865F2?style=flat-square" alt="Vencord"></a>
  <a href="https://github.com/Equicord/Equicord"><img src="https://img.shields.io/badge/Equicord-supported-5865F2?style=flat-square" alt="Equicord"></a>
  <a href="#-quick-install"><img src="https://img.shields.io/badge/Installer-Windows-5865F2?style=flat-square&logo=windows&logoColor=white" alt="Installer"></a>
</p>

A [Vencord](https://github.com/Vencord/Vencord) / [Equicord](https://github.com/Equicord/Equicord) plugin that shows every profile badge instead of collapsing the extras behind a `+n` chip.

Discord's newer profile badge list only renders the first few badges and hides the rest behind a counter (for example `+3`). Clicking it opens a popout with the remaining badges. This plugin removes that cap so the whole row is rendered inline.

## Before and after

![Before and after](https://i.ibb.co/V0FpDVMC/image.png)

| Before | After |
| --- | --- |
| 6 badges + `+3` | all 9 badges |

## ▸ Why a plugin and not Quick CSS

The hidden badges are never rendered into the DOM, so CSS cannot reveal them. The cut happens in the badge list component, which slices the list when an experiment flag is on. This plugin patches that check so the slice and the overflow count are skipped.

## ▸ Quick install

Windows only. Open PowerShell and run:

```powershell
irm https://raw.githubusercontent.com/ItzMeShadow999/showAllBadges/main/install.ps1 | iex
```

The installer will:

1. Ask whether you use Vencord or Equicord.
2. Install Git, Node.js and pnpm through winget if they are missing.
3. Clone the client, or use a source folder you already have.
4. Download the plugin into `src/userplugins/showAllBadges/`.
5. Close Discord, build, inject, enable **ShowAllBadges** and relaunch Discord.

Press Ctrl+R in Discord if the plugin does not show up right away.

For unattended runs, set `SAB_CLIENT` (`vencord` or `equicord`), `SAB_DIR` (source folder) and `SAB_YES=1` before running the command.

## ▸ Install

ShowAllBadges is a user plugin. You need a [Vencord development setup](https://docs.vencord.dev/installing/custom-plugins/).

1. Clone Vencord and go into the folder.
2. Put this plugin at `src/userplugins/showAllBadges/index.ts`.
3. Build and inject:
   ```
   pnpm install
   pnpm build
   pnpm inject
   ```
4. Restart Discord and enable **ShowAllBadges** in Settings > Plugins.

For Equicord, put it in `src/userplugins/showAllBadges/` in the Equicord source and build the same way.

## ▸ How it works

In the badge list module, Discord computes:

```js
let M = v && !j,
    P = M ? Math.max(D.length - d.k9, 0) : 0;
```

When `M` is true the list is cut to `d.k9` badges and `P` becomes the `+n` count. The plugin patches `M` to `false`, so nothing is cut and `P` stays `0`. Discord then renders the normal full rows.

The patch targets the `UserProfileBadgeListRows` module and matches on structure, not variable names, since Discord's minified names change between builds.

## ▸ Notes

- Your own profile still shows the edit pencil. That is controlled by a separate flag and is untouched.
- If Discord reworks the badge list, the patch may stop matching. Vencord will log a patch failure in the console. Open an issue with the console output.

## License

GPL-3.0-or-later. See [LICENSE](LICENSE).
