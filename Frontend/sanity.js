import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'v0e99uc0',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-03-02',
});

const builder = imageUrlBuilder(client);
export const urlFor = (source) => builder.image(source);
