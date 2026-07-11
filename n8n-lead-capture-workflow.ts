import { workflow, node, trigger, expr, newCredential } from '@n8n/workflow-sdk';

const leadWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Silent Partner Lead Form',
    parameters: {
      httpMethod: 'POST',
      path: 'silent-partner-lead',
      responseMode: 'responseNode',
      options: { allowedOrigins: '*' }
    }
  },
  output: [{
    body: {
      name: 'Jamie Whitfield',
      email: 'jamie@yourcoaching.com',
      focus: 'Business & Executive Coaching',
      revenue: '$8,000 – $20,000',
      bottleneck: "I lose leads because I can't respond fast enough between client sessions."
    }
  }]
});

const normalizeLead = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Normalize Lead Data',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'lead-id', name: 'leadId', value: expr('{{ $now.toFormat("yyyyMMddHHmmss") }}'), type: 'string' },
          { id: 'date-captured', name: 'dateCaptured', value: expr('{{ $now.toISO() }}'), type: 'string' },
          { id: 'name', name: 'name', value: expr('{{ $json.body?.name ?? $json.name ?? "" }}'), type: 'string' },
          { id: 'email', name: 'email', value: expr('{{ $json.body?.email ?? $json.email ?? "" }}'), type: 'string' },
          { id: 'notes', name: 'notes', value: expr('Focus: {{ $json.body?.focus ?? $json.focus ?? "" }} | Revenue: {{ $json.body?.revenue ?? $json.revenue ?? "" }} | Bottleneck: {{ $json.body?.bottleneck ?? $json.bottleneck ?? "" }}'), type: 'string' }
        ]
      }
    }
  },
  output: [{
    leadId: '20260711153000',
    dateCaptured: '2026-07-11T15:30:00.000-04:00',
    name: 'Jamie Whitfield',
    email: 'jamie@yourcoaching.com',
    notes: 'Focus: Business & Executive Coaching | Revenue: $8,000 – $20,000 | Bottleneck: I lose leads because I can\'t respond fast enough between client sessions.'
  }]
});

const appendToLedger = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: {
    name: 'Append to The Ledger',
    parameters: {
      resource: 'sheet',
      operation: 'append',
      documentId: {
        __rl: true,
        mode: 'id',
        value: '11CbFpgEPO1WBJV6bXhXwEG9KFeZbiIbC2PNQay6LRiM',
        cachedResultName: 'The Right Hand - Master Pipeline'
      },
      sheetName: {
        __rl: true,
        mode: 'list',
        value: '1010594523',
        cachedResultName: 'The Ledger'
      },
      columns: {
        mappingMode: 'defineBelow',
        value: {
          'Lead ID': expr('{{ $json.leadId }}'),
          'Date Captured': expr('{{ $json.dateCaptured }}'),
          'Name': expr('{{ $json.name }}'),
          'Email': expr('{{ $json.email }}'),
          'Phone': '',
          'Source': 'AI Silent Partner Website',
          'Stage': 'Catch',
          'Qualified': '',
          'Offer Value': '',
          'Discovery Call Date': '',
          'Call Outcome': '',
          'Last Contact Date': '',
          'Follow-up Count': 0,
          'Notes': expr('{{ $json.notes }}'),
          'Unsubscribed': 'No'
        },
        schema: [
          { id: 'Lead ID', displayName: 'Lead ID', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: true },
          { id: 'Date Captured', displayName: 'Date Captured', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Name', displayName: 'Name', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Email', displayName: 'Email', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Phone', displayName: 'Phone', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Source', displayName: 'Source', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Stage', displayName: 'Stage', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Qualified', displayName: 'Qualified', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Offer Value', displayName: 'Offer Value', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Discovery Call Date', displayName: 'Discovery Call Date', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Call Outcome', displayName: 'Call Outcome', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Last Contact Date', displayName: 'Last Contact Date', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Follow-up Count', displayName: 'Follow-up Count', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Notes', displayName: 'Notes', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false },
          { id: 'Unsubscribed', displayName: 'Unsubscribed', required: false, defaultMatch: false, display: true, type: 'string', canBeUsedToMatch: false }
        ]
      },
      options: {}
    },
    credentials: { googleSheetsOAuth2Api: newCredential('Google Sheets account') }
  },
  output: [{ Row: 27 }]
});

const respondOk = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond OK',
    parameters: {
      respondWith: 'json',
      responseBody: { status: 'ok' },
      options: {}
    }
  },
  output: [{ status: 'ok' }]
});

export default workflow('silent-partner-lead-capture', 'AI Silent Partner — Lead Capture to Ledger')
  .add(leadWebhook)
  .to(normalizeLead)
  .to(appendToLedger)
  .to(respondOk);
