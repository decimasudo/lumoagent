/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile ESM-only packages so webpack can bundle them correctly
  transpilePackages: [
    'react-markdown',
    'remark',
    'remark-parse',
    'remark-rehype',
    'rehype',
    'rehype-stringify',
    'unified',
    'bail',
    'is-plain-obj',
    'trough',
    'vfile',
    'vfile-message',
    'unist-util-stringify-position',
    'mdast-util-from-markdown',
    'mdast-util-to-hast',
    'mdast-util-to-string',
    'micromark',
    'decode-named-character-reference',
    'character-entities',
    'hast-util-to-jsx-runtime',
    'hast-util-whitespace',
    'property-information',
    'space-separated-tokens',
    'comma-separated-tokens',
    'estree-util-is-identifier-name',
    'html-url-attributes',
    'devlop',
  ],

  images: {
    remotePatterns: [],
  },
};

export default nextConfig;