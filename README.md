# Know Yellowknife

An educational website about Yellowknife’s peoples, histories, languages and civic life, designed to support learning and belonging.

**HTML · CSS · JavaScript**

[Visit the website](https://samobrienolinger.github.io/know-yellowknife/) · [Getting started](#getting-started) · [Repository guide](#repository-guide) · [Checks](#checks-and-review) · [Credits](#credits-and-reuse)

<img src="assets/images/hero-yellowknife-graphic-novel.webp" alt="Graphic novel illustration of Yellowknife and its surrounding lakes and autumn forest" width="880">

## What you can explore

- Source-linked learning cards and a replayable ten-question quiz.
- Answer explanations and a device-local best score.
- Translation controls and accessibility information.
- About, contact and privacy pages.

## Using the project

1. Browse the Learn page and follow the sources attached to each topic.
2. Answer ten questions in the Quiz and read the explanations.
3. Replay to explore a different selection and compare your device-local best score.

> **Project notes:** Content is independently compiled and has not undergone formal community review. The contact form validates locally without transmitting messages. Consult the cited Indigenous-led and official sources for their own accounts.

## Getting started

Requires Git, a browser and a local HTTP server. Python 3 provides one without installing application packages.

```bash
git clone https://github.com/SamOBrienOlinger/know-yellowknife.git
cd know-yellowknife
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Serve the repository over HTTP so module imports, relative assets and page links resolve correctly.

Alternatively, use Node.js `>=20` and npm: run `npm run dev` from the repository root and open [localhost:4173](http://localhost:4173). The server uses Node's built-in modules; `npm install` is not required.

## Repository guide

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Primary browser entry point |
| [assets/](assets/) | Project styles, scripts, data and imagery |
| [tests/](tests/) | Automated test source |
| [package.json](package.json) | Package dependencies and available commands |

## Checks and review

Use Node.js `>=20` and npm for the command below. The tests use Node's built-in test runner; no dependency installation is needed.

| Command | Purpose |
| --- | --- |
| `npm test` | Run the existing test suite |

For a manual review, follow the main user journey, check keyboard navigation and narrow-screen layouts, and inspect the browser console for missing assets or failed requests.

Supporting notes: [TESTING.md](TESTING.md) · [ally-index/QUIZ-TESTING.md](ally-index/QUIZ-TESTING.md) · [ally-index/TESTING.md](ally-index/TESTING.md).

Generate fresh results from the revision you are working on; historical test reports describe earlier runs.

## Deployment

A GitHub Pages site is configured for this repository. Its published URL is linked at the top of this README.

## Useful resources

- [Exploring Yellowknife — Destination Canada](https://travel.destinationcanada.com/en-us/things-to-do/exploring-yellowknife): an introduction to the city’s culture, museums, food, outdoor activities and seasonal experiences.

## Further reading

- [Documentation for ally-index](ally-index/README.md)

## Credits and reuse

### Hero image inspiration

The landing-page graphic novel artwork (`assets/images/hero-yellowknife-graphic-novel.webp`) is inspired by **Paul Zizka’s photograph of Yellowknife**, featured in [Destination Canada’s “Exploring Yellowknife”](https://travel.destinationcanada.com/en-us/things-to-do/exploring-yellowknife), which credits him as the photographer. [View the original photograph](https://admin.destinationcanada.com/sites/default/files/images/article/paul_zizka_yellowknife_aerial_september_2010.jpg).

The supplied photograph was reinterpreted using OpenAI’s built-in image generation tool, with inked outlines, illustrated colours and no overlaid text. Paul Zizka is credited for the photographic inspiration; the graphic novel adaptation is AI-generated. This credit does not imply endorsement or change the original photograph’s rights.

[Image-generation prompt](assets/images/hero-yellowknife-graphic-novel.prompt.txt)

Developed by Sam O'Brien-Olinger. The learning approach evolved from AllyIndex, created for the Code Institute July 2024 hackathon; the [preserved AllyIndex documentation](ally-index/README.md) records its team, content and media acknowledgements.

Learning content prioritises Indigenous organisations' own accounts, including the Yellowknives Dene First Nation and North Slave Métis Alliance. Civic and environmental context draws on the City of Yellowknife and Government of the Northwest Territories. Exact publisher links are maintained in the [source register](assets/data/content.js) and beside the learning entries and quiz explanations.

Design decisions, original feature notes, historical testing evidence and detailed acknowledgements remain available in the preserved project record:

- [README.md · original project record](https://github.com/SamOBrienOlinger/know-yellowknife/blob/16d19015b5aaa51fec98ad67e302ca7fb47fe772/README.md)
- [ally-index/README.md · original project record](https://github.com/SamOBrienOlinger/know-yellowknife/blob/16d19015b5aaa51fec98ad67e302ca7fb47fe772/ally-index/README.md)

Learning resources and starter material: [Code Institute](https://codeinstitute.net/).

Reuse terms are recorded in [LICENSE](LICENSE). Third-party assets and dependencies retain their own terms.

## Support

Repository maintained in [Sam O’Brien-Olinger’s GitHub account](https://github.com/SamOBrienOlinger). For a problem or suggested improvement, [open an issue](https://github.com/SamOBrienOlinger/know-yellowknife/issues) with the affected page or command, steps to reproduce, and expected behaviour.

[Back to top](#know-yellowknife)
