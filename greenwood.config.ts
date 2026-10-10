import { greenwoodPluginAdapterNetlify } from '@greenwood/plugin-adapter-netlify';
import type { Config } from '@greenwood/cli';

export default {
  plugins: [
    greenwoodPluginAdapterNetlify()
  ]
} as Config;