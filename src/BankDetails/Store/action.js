import * as actionTypes from './actionTypes';
import axios from 'axios';

//Init State Action Dispatch
export const initState = () => {
    return dispatch => {
        dispatch({
            type: actionTypes.INIT_STATE
        })
    };
};

//Get Data Action Dispatch
export const getBankData = () => {
    return (dispatch) => {
        dispatch({
            type: actionTypes.GET_BANK_DETAILS_LOADING
        })

        URL = "https://vast-shore-74260.herokuapp.com/banks?city=MUMBAI"
        axios.get(URL)
            .then(response => {
                if (response.status === 200 || response.status === 201) {
                    console.log("SUCCEs", response.data)

                    localStorage.setItem("cacheBankData", JSON.stringify(response.data));
                    dispatch({
                        type: actionTypes.GET_BANK_DETAILS_SUCCESS,
                        BankData: response.data
                    });
                }
            })
            .catch(error => {
                let errMsg = error;
                if (error.response.data && error.response.data.errorMessage) {
                    errMsg = error.response.data.errorMessage;
                }
                dispatch({
                    type: actionTypes.GET_BANK_DETAILS_ERROR,
                    error: errMsg
                });
            });
    };
};

//
export const getBanKdataFromCache = () => {
    let data = JSON.parse(localStorage.getItem('cacheBankData'));
        
    return(dispatch) =>
    {
        dispatch({
            type:actionTypes.CACHE_SUCCESS,
            BankData: data
        })
    }
}
