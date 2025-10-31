# Portfolio Site (Static)

## Preview locally
```bash
cd "/Users/michelleackers/Desktop/portfolio-systems"
python3 -m http.server 8000
# open http://localhost:8000
```

## Structure
- Pages: `index.html`, `projects.html`, `project.html`, `services.html`, `about.html`, `contact.html`
- Content: `content/projects.json`
- Assets: `assets/css/style.css`, `assets/js/site.js`
- SEO: `sitemap.xml`, `robots.txt`

## Add a new project
1. Add your PDF to the project root (e.g., `My New Project.pdf`).
2. Edit `content/projects.json` and append an entry:
```json
{
  "slug": "my-new-project",
  "title": "My New Project",
  "summary": "Short summary.",
  "tags": ["SaaS", "Architecture"],
  "links": [{ "label": "Case Study PDF", "url": "../My New Project.pdf" }]
}
```
3. Open `projects.html` → click your project → PDF will render inline.

## Deploy options (free)
- Netlify Drop: drag-and-drop the folder → instant URL.
- Netlify site (recommended): create site from folder; enables redirects, forms, and custom domain later.
- Vercel static: import as a static project.

After deploying, update:
- `sitemap.xml` and `robots.txt` domain from `https://example.com` to your live domain.
- Optional: add a custom `og:image` for richer sharing.

## Contact email
- Currently set to `ackers.ml@gmail.com` in `contact.html`.

## Notes
- Project detail SEO updates dynamically from `content/projects.json`.
- PDFs are loaded directly from the repo; no external hosting needed.
