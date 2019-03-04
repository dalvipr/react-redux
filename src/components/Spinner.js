import React from 'react';
import { Loader, Dimmer } from 'semantic-ui-react';

const Spinner = () => (
    <Dimmer active inverted >
        <Loader size="huge" inverted content={"Preparing chat..."} />
   </Dimmer>
);

export default Spinner;