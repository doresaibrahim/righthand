# AI Silent Partner for Coaches — Landing Page

One-page marketing site for AI Silent Partner, an automation service that handles lead follow-up, discovery-call booking, and nurture sequences for coaches.

## Live

- **Production site:** https://aisilentpartner.vercel.app
- **Booking widget:** https://clients.profitautomationacademy.com/widget/booking/IDV7xsrq3kfXBUBADJRC

## Files

- `index.html` — the entire site (single self-contained file: inline CSS/JS, Google Fonts as the only external resource, hero photo embedded as a base64 data URI).
- `n8n-lead-capture-workflow.ts` — reference copy of the n8n Workflow SDK code that powers the lead-capture form. The live, editable version runs at https://aisilentpartner.app.n8n.cloud/workflow/3ku7XydwKcr7qZAo.

## How the lead form works

Submitting the form at the bottom of the page:
1. POSTs to the n8n webhook `https://aisilentpartner.app.n8n.cloud/webhook/silent-partner-lead`
2. n8n appends the lead to **The Right Hand - Master Pipeline** Google Sheet, "The Ledger" tab, tagged `Source: AI Silent Partner Website`
3. Regardless of that call's outcome, the visitor is then sent to the booking widget in a new tab

## Design system

Built to `BRAND/design.md` (v6/v7) in the Business Brain drive: Cream, Cream-tint, Burgundy, Gold, Sand — five colors, cream as the background everywhere, burgundy as ink/accent (never a large fill), Poppins + Lora + one Pinyon Script accent word in the hero.

## Deploying changes

```
npx vercel --prod --scope thinking-differently
```
Deploys `index.html` to the `aisilentpartner` project under the Thinking Differently Vercel team.
