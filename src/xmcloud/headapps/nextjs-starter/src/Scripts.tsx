import { EditingScripts } from '@sitecore-jss/sitecore-jss-nextjs';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import CdpPageView from 'components/sxa/CdpPageView';
import FEAASScripts from 'components/sxa/FEAASScripts';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <CdpPageView />
      <FEAASScripts />
      <EditingScripts />
    </>
  );
};

export default Scripts;
