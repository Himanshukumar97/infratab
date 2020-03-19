import * as actionTypes from './actionTypes';

const initialState = {
    getDataState: 'INIT',
    BankData: {},
    error: null,
    cacheState: 'INIT'
}

const initState = () => {
    return initialState;
}


const resetError = (state, action) => {
    return {...state, 
        error: null
    };
}

//GET DATA REDUCERS
const getDataLoading = (state) => {
    console.log("Loading");
    return {...state, 
        getDataState: 'LOADING'
    } ;
}

const getDataSuccess = (state, action) => {
    console.log("SUCCES",action.BankData);
    
    return {...state,
        getDataState: 'SUCCESS',
        BankData: action.BankData,
        error: null
    }
};

const getDataError = (state, action) => {
    console.log("Loading");
    return {...state,
        getDataState: 'ERROR',
        error: action.error,
    };
};

const getCacheData = (state,action) => {
    return {...state,
        cacheState:'SUCCESS',
        BankData: action.BankData
    }
}



const reducer = (state = initialState, action) => {
   
    switch (action.type) {

        case actionTypes.INIT_STATE: return initState();
        case actionTypes.RESET_ERROR: return resetError(state, action);

        case actionTypes.GET_BANK_DETAILS_LOADING: return getDataLoading(state, action);
        case actionTypes.GET_BANK_DETAILS_SUCCESS: return getDataSuccess(state, action);
        case actionTypes.GET_BANK_DETAILS_ERROR: return getDataError(state, action);

        case actionTypes.CACHE_SUCCESS: return getCacheData(state,action) ;
        default: return state;
    }
};

export default reducer;