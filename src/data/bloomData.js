// @ts-nocheck
import { bedsById } from './beds.js';

export const bloomMap = {
  'Early spring':        { start: 0, end: 0 },
  'Early to mid-spring': { start: 0, end: 2 },
  'Mid-spring':          { start: 2, end: 2 },
  'Mid to late spring':  { start: 2, end: 4 },
  'Late spring':         { start: 4, end: 4 },
  'Varies':              { start: 0, end: 4 },
};

const typeToBloom = {
  'Tulip Botanical':      'Early spring',
  'Tulip Darwin Hybrid':  'Mid to late spring',
  'Tulip Double Early':   'Early spring',
  'Tulip Double Mid':     'Mid-spring',
  'Tulip Fosteriana':     'Early to mid-spring',
  'Tulip Greigii':        'Early to mid-spring',
  'Tulip Kaufmanniana':   'Early spring',
  'Tulip Lily Flowering': 'Late spring',
  'Tulip Parrot':         'Late spring',
  'Tulip Single Late':    'Late spring',
  'Tulip Triumph':        'Mid to late spring',
};

export const bloomData = Object.entries(typeToBloom)
  .map(([type, bloom]) => {
    const bed = Object.values(bedsById).find(b => b.type === type);
    return { type, bloom, hex: bed?.hex ?? '#ccc' };
  });
