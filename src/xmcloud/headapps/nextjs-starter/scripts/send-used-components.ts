import { getItems, watchItems } from './utils';
import axios from 'axios';

interface ComponentFile {
  path: string;
  moduleName: string;
  componentName: string;
}

interface PackageDefinition {
  name: string;
  components: {
    moduleName: string;
    componentName: string;
  }[];
}

const componentRootPath = 'src/components';

const isWatch = process.argv.some((arg) => arg === '--watch');

(isWatch ? watchComponentFactory : writeComponentFactory)();

/**
 * Watches component directory for changes. When files are added or deleted, the component factory
 * file (componentFactory.ts) is regenerated. This is used during `jss start` to pick up new or
 * removed components at runtime.
 */
function watchComponentFactory() {
  watchItems(componentRootPath, writeComponentFactory);
}

/**
 * Generates the component factory file and saves it to the filesystem.
 * By convention, we expect to find React components under src/components/** (subfolders are
 * searched recursively). The filename, with the extension stripped, is used for the component's
 * string name (for mapping to Sitecore). The filename, with extension and non-word characters
 * stripped, is used to identify the component's JavaScript module definition (for initializing
 * new component instances in code).
 * Modify this function to use a different convention.
 */
function writeComponentFactory() {
  const packages: PackageDefinition[] = [];
  const components = getComponentList(componentRootPath);

  components.unshift(...packages);

  const baseUrl = process.env.CL_SERVER_URL || 'https://cl-server-prod-app.azurewebsites.net';
  const apiEndpoint = '/api/maintenance/update-use-statistics';
  const url = `${baseUrl}${apiEndpoint}`;
  const site = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.VERCEL_URL || '';

  const data = {
    Site: site,
    Platform: 'xm-cloud-components',
    Components: components.map((c) => (c as ComponentFile).componentName),
    Version: '1.2.0',
  };
  console.log(data);

  if (!site) {
    return;
  }

  console.log('Sending components to Component Library Statistics API');
  axios
    .post(url, data, {
      headers: {
        'Content-Type': 'application/json', // Specify the content type as JSON if sending JSON data
        // You may need to include additional headers, such as authentication tokens
      },
    })
    .then((response) => {
      console.log('Component Library Response');
      console.log(response.data);
    })
    .catch(() => {
      console.log('Error sending components to Component Library Statistics API');
    });
}

function getComponentList(path: string): (PackageDefinition | ComponentFile)[] {
  const components = getItems<PackageDefinition | ComponentFile>({
    path,
    resolveItem: (path, name) => ({
      path: `${path}/${name}`,
      componentName: name,
      moduleName: name.replace(/[^\w]+/g, ''),
    }),
    cb: (name) => console.debug(`Registering JSS component ${name}`),
  });

  return components;
}
