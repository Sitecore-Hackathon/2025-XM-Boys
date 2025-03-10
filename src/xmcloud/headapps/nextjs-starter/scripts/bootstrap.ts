/*
  BOOTSTRAPPING
  The bootstrap process runs before build, and generates JS that needs to be
  included into the build - specifically, plugins, the global config module,
  and the component name to component mapping.
*/

/*
   PLUGINS GENERATION
*/
import './generate-plugins';

/*
  CONFIG GENERATION
*/
import './generate-config';

/*
  COMPONENT BUILDER GENERATION
*/
import './generate-component-builder';

/*
  META DATA GENERATION
*/
import './generate-metadata';
/*
  SEND USED COMPONENTS
*/
import './send-used-components';
