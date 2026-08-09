# Know Yellowknife MVP testing

## Automated checks

Run `npm test`. The suite validates:

- a minimum of 20 approved quiz questions;
- unique IDs, valid answers, unique choices and source URLs;
- ten-question selection without repetition or source mutation;
- high-score rules;
- every required page;
- every internal page, stylesheet and script reference;
- removal of legacy subject text from production pages.

## Manual acceptance checklist

- [ ] Use keyboard only to reach the skip link, all navigation, every quiz answer, feedback source and next/retry actions.
- [ ] Confirm visible focus is never hidden by the sticky header.
- [ ] Verify the mobile menu at 320 px and 375 px.
- [ ] Verify page reflow at 200% and 400% browser zoom.
- [ ] Run a complete quiz: exactly ten questions, no repeats, score only increases for correct answers.
- [ ] Refresh and confirm the best score persists; block local storage and confirm the quiz still completes.
- [ ] Confirm feedback is announced by NVDA or VoiceOver.
- [ ] Confirm reduced-motion mode removes non-essential transitions.
- [ ] Submit the empty contact form and confirm native validation; complete it and confirm the page explicitly says nothing was sent.
- [ ] Check external source links and the source register.
- [ ] Run Lighthouse and axe against every page and the quiz intro/question/feedback/results states.
- [ ] Test current Chrome, Firefox, Edge and Safari plus representative iOS/Android viewports.

No Lighthouse score or accessibility claim from AllyIndex is carried forward; this MVP must be tested independently before public release.
