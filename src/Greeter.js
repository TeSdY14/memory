import React from 'react';

const Greeter = ({ whom }) => (
    <button onClick={() => console.log(`Bonjour ${ whom } !`)}>
        Vas-y, clique !
    </button>
)

export default Greeter
