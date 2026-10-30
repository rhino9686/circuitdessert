---
title: Add images
description: "How to add pictures, scope captures and diagrams."
sidebar:
  order: 4
---

Images don't live in the repository. They're hosted on a separate media server, so the repository stays small and the site stays fast. You still add them through your pull request; a GitHub Action moves them after merge.

## Steps

1. Put your image in the `media-incoming/` folder.
2. Reference it in your Markdown with the `media:` prefix:

   ```md
   ![Switch node waveform at full load](media:my-design-switch-node.webp)
   ```

3. Run `npm run validate`. It checks the format, the size, the file name and the reference.
4. Open your pull request. The images are part of it, so reviewers can see them in the diff.
5. When the PR is merged, the image is uploaded and removed from the repository automatically.

## Rules

- **Format:** WebP or AVIF for photos and captures, SVG for diagrams. Convert PNG or JPEG files first.
- **Size:** at most 500 KB for photos, 100 KB for SVG. Resize large images; screens rarely need more than about 1600 pixels across.
- **Names:** lowercase letters, numbers and hyphens only, with no spaces. Start the name with your design's name to avoid clashes. **A file name is permanent**: once uploaded, it can't be replaced under the same name.
- **Alt text:** every image needs a short description inside the square brackets, for people using screen readers. Empty alt text fails the check.
- **Your own images only,** or ones you have permission to use. Don't upload datasheet pages or manufacturer documents. Images you add are published under CC BY 4.0 like the rest of the content.

## Good to know

- **Previews:** until the PR is merged, images from your PR won't show on a preview site, because they're not on the media server yet. Check them in the PR diff.
- **Small SVG illustrations** for a recipe's header go in `src/assets/recipes/` instead, and are named in the recipe's `hero` field.
