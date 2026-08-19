# Know Yellowknife

Know Yellowknife is a mobile-first educational MVP about Yellowknife's peoples, histories, languages and civic life. It combines a source-led learning hub with a replayable, accessible ten-question quiz.

> **Release status:** private-review prototype. Content is independently compiled from public sources and has not undergone formal community review. The contact form validates locally but does not transmit messages.

## MVP features

- Home, Learn, Quiz, About, Contact, Accessibility, Privacy and custom 404 pages
- Structured learning content backed by Indigenous-led and official public sources
- 24 sourced questions; 10 shuffled without replacement per attempt
- Immediate answer explanations and source links
- Device-local best score with graceful storage failure handling
- On-demand translation into Arabic, French, Dutch, German, Italian and Spanish
- Keyboard-operable navigation and quiz with visible focus and live feedback
- Mobile-first responsive design with reduced-motion, increased-contrast and forced-colour support
- Zero runtime dependencies, trackers or external media
- Unit/data/asset tests using Node's built-in test runner

## Run locally

ES modules require a local HTTP server rather than opening the files directly:

```bash
npm run serve
```

Then open `http://localhost:4173`.

## Test

```bash
npm test
```

The test suite checks quiz selection/scoring helpers, all question records, internal HTML links and local asset references.

## Structure

```text
assets/
  css/styles.css
  data/content.js
  data/questions.js
  js/main.js
  js/translation.js
  js/learn.js
  js/quiz-engine.js
  js/quiz.js
  js/contact.js
tests/
  quiz-engine.test.js
  site-integrity.test.js
  translation.test.js
```

## Content policy

An Indigenous organization’s own public material is preferred when describing its identity, history and work. City of Yellowknife and Government of the Northwest Territories pages provide civic and public-service context. Each published learning entry and quiz explanation links to its source. Yellowknife-local and wider regional material are distinguished.

Source access/review date for this MVP: **9 August 2026**.

## Contact integration

`contact.html` is intentionally a transparent demonstration. Before a public release, configure a real endpoint and recipient, update the button/success text, add error handling and replace the provisional privacy wording.

## Deployment

The static site is compatible with GitHub Pages. Production URL, analytics and final public-launch decisions are intentionally deferred. The repository currently includes the existing Apache 2.0 licence.

## Project origin

The learning-through-play concept evolved from [AllyIndex](https://declan444.github.io/24-7-hackathon-team9/), created by Allies in Action for the Code Institute July 2024 hackathon.
