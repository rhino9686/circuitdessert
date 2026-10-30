# media-incoming

Put new images for your pull request in this folder, then reference them from your Markdown as
`![Describe the image](media:your-file-name.webp)`.

When your PR is merged, a GitHub Action uploads the files to the media host (Cloudflare R2) and
removes them from this folder, so the repository stays small. Rules and tips: see
`src/content/docs/contribute/images.md` or the **Contribute → Images** page on the site.
