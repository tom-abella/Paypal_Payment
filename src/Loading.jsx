// ******************* STYLES ******************************//
import XLogoLoader from './assets/X_Logo_Loader/gif';
// ******************* STYLES ******************************//

//******************** IMPORT REACT NATIVE *****************//
import React from 'react';
//******************** IMPORT REACT NATIVE *****************//

//******************** FUNCTION *****************//
const LoadingView = () => {
    return (
        <div className='loading'>
            <img src={XLogoLoader} alt="loader" />

        </div>
    );
};
//******************** FUNCTION *****************//

export default LoadingView;
